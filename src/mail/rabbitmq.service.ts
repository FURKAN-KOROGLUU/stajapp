import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import { MailService } from './mail.service.js';
import { SendMailDto } from './dto/send-mail.dto.js';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);
  private channel!: amqp.Channel;

  private readonly QUEUE_NAME = 'mail_queue';
  private readonly DLQ_NAME = 'mail_queue_dlq';
  private readonly EXCHANGE_NAME = 'mail_exchange';
  private readonly DLX_NAME = 'mail_dlx';

  constructor(private readonly mailService: MailService) {}

  async onModuleInit() {
    await this.initRabbitMQ();
  }

  private async initRabbitMQ() {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
      this.channel = await connection.createChannel();

      await this.channel.assertExchange(this.DLX_NAME, 'direct', { durable: true });
      await this.channel.assertQueue(this.DLQ_NAME, { durable: true });
      await this.channel.bindQueue(this.DLQ_NAME, this.DLX_NAME, 'mail_dlq_key');

      await this.channel.assertExchange(this.EXCHANGE_NAME, 'direct', { durable: true });
      await this.channel.assertQueue(this.QUEUE_NAME, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': this.DLX_NAME,
          'x-dead-letter-routing-key': 'mail_dlq_key',
        },
      });
      await this.channel.bindQueue(this.QUEUE_NAME, this.EXCHANGE_NAME, 'mail_key');

      this.logger.log('RabbitMQ bağlantısı ve kuyruklar başarıyla kuruldu.');
      this.consumeQueue();
    } catch (error) {
      this.logger.error('RabbitMQ başlatılamadı:', error);
    }
  }

  async sendToQueue(mailDto: SendMailDto) {
    const message = Buffer.from(JSON.stringify(mailDto));
    this.channel.publish(this.EXCHANGE_NAME, 'mail_key', message, { persistent: true });
    this.logger.log(`Mesaj kuyruğa eklendi: ${mailDto.to}`);
  }

  private consumeQueue() {
    this.channel.consume(this.QUEUE_NAME, async (msg) => {
      if (!msg) return;

      const content = msg.content.toString();
      const mailData: SendMailDto = JSON.parse(content);

      // Optional chaining (?. ve ??) kullanarak undefined hatası engellendi
      const headers = msg.properties?.headers;
      const deathHeader = headers ? headers['x-death'] : undefined;
      const retryCount = deathHeader && Array.isArray(deathHeader) && deathHeader[0] ? deathHeader[0].count : 0;

      try {
        await this.mailService.sendMail(mailData);
        this.channel.ack(msg);
      } catch (error) {
        if (retryCount < 3) {
          this.logger.warn(`Mail gönderimi başarısız! Tekrar deneniyor... (${retryCount + 1}/3)`);
          this.channel.nack(msg, false, false);
        } else {
          this.logger.error(`3 deneme sonunda mail gönderilemedi. DLQ (Hatalı Mesaj Kuyruğu)'ya aktarılıyor.`);
          this.channel.nack(msg, false, false);
        }
      }
    });
  }
}