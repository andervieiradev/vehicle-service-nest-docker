import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 7, unique: true })
  placa: string;

  @Column({ length: 17, unique: true })
  chassi: string;

  @Column({ length: 11, unique: true })
  renavam: string;

  @Column()
  modelo: string;

  @Column()
  marca: string;

  @Column()
  ano: number;

  constructor(partial?: Partial<Vehicle>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
