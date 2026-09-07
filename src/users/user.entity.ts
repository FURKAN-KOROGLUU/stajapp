 import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'; //Projede veritabanı işlemlerini yönettiğimiz TypeORM kütüphanesinden gerekli dekoratörleri ve fonksiyonları kodumuza dahil eder.

@Entity('users') //Bu sınıfın (User) PostgreSQL veritabanında bir tabloya karşılık geldiğini belirtir. Veritabanında otomatik olarak users adında bir tablo oluşturulmasını sağlar.
export class User { // NestJS projesinin diğer yerlerinde (Repository, Auth Service vb.) bu kullanıcı modelini kullanabilmemiz için sınıfı dışa aktarır (export eder).
   @PrimaryGeneratedColumn('uuid') // Tablonun birincil anahtarını (Primary Key) tanımlar. uuid parametresi sayesinde veritabanı her yeni kullanıcı kaydında 1, 2, 3 gibi tahmin edilebilir sayılar yerine benzersiz ve karmaşık bir Kimlik No (123e4567-e89b-12d3-a456-426614174000) üretir.
   id: string; // Üretilen bu UUID değerinin TypeScript tarafındaki veri tipinin metin (string) olduğunu belirtir.

   @Column({ unique: true })// Tabloda normal bir sütun (column) oluşturur. unique: true kuralı sayesinde veritabanı seviyesinde aynı e-posta adresiyle ikinci bir kullanıcının kaydolmasını engeller.
   email: string; //Kullanıcının e-posta adresini tutan metin (string) tipindeki alan.

   @Column() // Veritabanı tablosunda varsayılan ayarlarla standart bir sütun oluşturur.
   passwordHash: string; //Kullanıcının şifresini güvenlik nedeniyle yalın halde değil, bcrypt ile şifrelenmiş (hash'lenmiş) olarak tutacağımız metin alanı.

   @Column({ nullable: true }) //Bu sütunun boş kalabileceğini (NULL) belirtir. Kullanıcı ilk kayıt olduğunda henüz bir Refresh Token'ı olmayacağı için bu alanın boş geçilmesine izin verir.
   refreshTokenHash: string; // Kullanıcı giriş yaptığında üretilen Refresh Token bilgisinin şifrelenmiş halini saklayan alan.

   @CreateDateColumn() // Otomatik tarih sütunudur. Veritabanına yeni bir kullanıcı eklendiği anda o anki tarih ve saat bilgisini hiçbir müdahale gerekmeden kendisi kaydeder.
   createdAt: Date; //Kayıt oluşturulma tarihinin TypeScript tarafındaki Date (Tarih) veri tipi karşılığı.
}