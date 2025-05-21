import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mssqlConfigAsync } from '../mssql.providers';

@Module({
  imports: [TypeOrmModule.forRootAsync(mssqlConfigAsync)],
  exports: [MssqlDBModule],
})
export class MssqlDBModule {}
