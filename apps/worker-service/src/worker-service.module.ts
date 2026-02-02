import { CdrDataParameter, MssqlDBModule } from '@app/database';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkerServiceController } from './worker-service.controller';
import { WorkerServiceService } from './worker-service.service';

@Module({
  imports: [
    MssqlDBModule,
    TypeOrmModule.forFeature([CdrDataParameter], 'mssql'),
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [WorkerServiceController],
  providers: [WorkerServiceService],
})
export class WorkerServiceModule {}
