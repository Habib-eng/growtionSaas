import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Contact } from '../contacts/contact.entity';
import { Account } from '../accounts/account.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reference: string;

  @Column()
  status: string;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => Contact, contact => contact.orders)
  contact: Contact;

  @Column()
  accountId: number;

  @ManyToOne(() => Account, account => account.orders)
  @JoinColumn({ name: 'accountId' })
  account: Account;
}
