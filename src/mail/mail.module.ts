import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MailService } from './mail.service.js';
import { RabbitMQService } from './rabbitmq.service.js';
import { MailController } from './mail.controller.js';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [MailController],
  providers: [MailService, RabbitMQService],
  exports: [MailService, RabbitMQService],
})
export class MailModule {}