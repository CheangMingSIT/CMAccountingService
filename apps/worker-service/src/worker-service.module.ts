import { Global, Module } from '@nestjs/common';
import { WorkerServiceController } from './worker-service.controller';
import { WorkerServiceService } from './worker-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CdrDataParameter, MssqlDBModule } from '@app/database';

@Module({
  imports: [
    MssqlDBModule,
    TypeOrmModule.forFeature([CdrDataParameter], 'mssql'),
  ],
  controllers: [WorkerServiceController],
  providers: [WorkerServiceService],
})
export class WorkerServiceModule {}
