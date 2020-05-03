import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Category from './Category';

export type TransactionTypeEnum = 'income' | 'outcome';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ enum: ['income', 'outcome'] })
  type: TransactionTypeEnum;

  @Column()
  value: number;

  @Column()
  category_id: string;

  @ManyToOne(() => Category, category => category.id)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
