import { IsEmail, IsNotEmpty, IsOptional, IsString, ArrayNotEmpty, IsArray } from 'class-validator';

export class SendMailDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz.' })
  @IsNotEmpty({ message: 'Alıcı e-posta adresi boş olamaz.' })
  to!: string;

  @IsString()
  @IsNotEmpty({ message: 'Mail başlığı boş olamaz.' })
  subject!: string;

  @IsString()
  @IsNotEmpty({ message: 'Mail içeriği boş olamaz.' })
  content!: string;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true, message: 'CC alanındaki tüm adresler geçerli e-posta olmalıdır.' })
  cc?: string[];
}