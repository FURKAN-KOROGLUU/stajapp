// import { Injectable } from '@nestjs/common';
// import { DataSource, Repository } from 'typeorm';
// import { User } from './user.entity.js';

// // Bu sınıfın NestJS servislerine (AuthService vb.) enjekte edilebilmesini sağlar
// @Injectable()
// export class UserRepository extends Repository<User> {
//   // Veritabanı bağlantısını alıp TypeORM'un User tablosuyla eşleşmesini sağlarız
//    constructor(private dataSource: DataSource) {
//       super(User, dataSource.createEntityManager());
//    }

//   // Giriş ve kayıt işlemlerinde e-posta kontrolü yapmak için kullandığımız özel sorgu
//    async findByEmail(email: string): Promise<User | null> {
//       return this.findOne({ where: { email } });
//    }

//   // Kullanıcı giriş yaptığında token'ını kaydetmek, çıkış yaptığında null yapmak için kullanılır
//    async updateRefreshToken(userId: string, refreshTokenHash: string | null): Promise<void> {
//       await this.update(userId, { refreshTokenHash });
//    }
// }




import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  // Bu metodun olduğundan emin olun:
  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repo.create(userData);
    return this.repo.save(user);
  }

  async updateRefreshToken(id: string, refreshTokenHash: string | null): Promise<void> {
    await this.repo.update(id, { refreshTokenHash });
  }
}