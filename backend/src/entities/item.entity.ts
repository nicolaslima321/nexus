import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column('text')
  description: string;
}
