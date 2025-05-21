import { Module } from '@nestjs/common';
import { DataExtractService } from './data-extract.service';
import { DataExtractController } from './data-extract.controller';
import { ClientsModule } from '@nestjs/microservices';
import { kafkaClientAsyncOptions } from '@app/kafka';

@Module({
  imports: [ClientsModule.registerAsync(kafkaClientAsyncOptions)],
  controllers: [DataExtractController],
  providers: [DataExtractService],
})
export class DataExtractModule {}
