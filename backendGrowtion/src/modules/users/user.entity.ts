import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  password: string; // hashed password

  @Column({ nullable: true })
  resetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpires: Date;
}
