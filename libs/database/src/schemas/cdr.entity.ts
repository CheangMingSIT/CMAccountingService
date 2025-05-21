import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'CDR', schema: 'dbo' })
export class CdrDataParameter {
  @PrimaryGeneratedColumn()
  id: number; // Add this only if there's a primary key auto-generated column

  @Column({ type: 'nvarchar', length: 6, nullable: true })
  date: string;

  @Column({ type: 'nvarchar', length: 4, nullable: true })
  time: string;

  @Column({ type: 'nvarchar', length: 4, nullable: true })
  duration: string;

  @Column({ type: 'nvarchar', length: 5, nullable: true })
  secdur: string;

  @Column({ type: 'int', nullable: true })
  condCode: number;

  @Column({ type: 'nvarchar', length: 4, nullable: true })
  codeDial: string;

  @Column({ type: 'nvarchar', length: 4, nullable: true })
  codeUsed: string;

  @Column({ type: 'nvarchar', length: 25, nullable: true })
  dialedNum: string;

  @Column({ type: 'nvarchar', length: 15, nullable: true })
  callingNum: string;

  @Column({ type: 'nvarchar', length: 13, nullable: true })
  authCode: string;

  @Column({ type: 'int', nullable: true })
  inCrtID: number;

  @Column({ type: 'int', nullable: true })
  outCrtID: number;
}
