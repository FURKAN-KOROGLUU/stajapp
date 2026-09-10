import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service.js';
import { SendMailDto } from './dto/send-mail.dto.js';
import { JwtAuthGuard } from '../users/jwt-auth.guard.js';

@Controller('mail')
@UseGuards(JwtAuthGuard)
export class MailController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Post('send')
  async sendMail(@Body() sendMailDto: SendMailDto) {
    await this.rabbitMQService.sendToQueue(sendMailDto);
    return { message: 'Mail gönderme isteği işleme alındı ve kuyruğa eklendi.' };
  }
}