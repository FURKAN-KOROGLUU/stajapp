import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto.js';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: Number(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  async sendMail(mailData: SendMailDto): Promise<boolean> {
    try {
      const mailOptions = {
        from: '"Staj Projesi Bildirim" <no-reply@stajapp.com>',
        to: mailData.to,
        cc: mailData.cc ? mailData.cc.join(',') : undefined,
        subject: mailData.subject,
        text: mailData.content,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Mail başarıyla gönderildi: ${mailData.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Mail gönderim hatası: ${mailData.to}`, error);
      throw error;
    }
  }
}