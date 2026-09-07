import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity.js';

// Bu sınıfın NestJS servislerine (AuthService vb.) enjekte edilebilmesini sağlar
@Injectable()
export class UserRepository extends Repository<User> {
  // Veritabanı bağlantısını alıp TypeORM'un User tablosuyla eşleşmesini sağlarız
   constructor(private dataSource: DataSource) {
      super(User, dataSource.createEntityManager());
   }

  // Giriş ve kayıt işlemlerinde e-posta kontrolü yapmak için kullandığımız özel sorgu
   async findByEmail(email: string): Promise<User | null> {
      return this.findOne({ where: { email } });
   }

  // Kullanıcı giriş yaptığında token'ını kaydetmek, çıkış yaptığında null yapmak için kullanılır
   async updateRefreshToken(userId: string, refreshTokenHash: string | null): Promise<void> {
      await this.update(userId, { refreshTokenHash });
   }
}