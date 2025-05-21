import { Module } from '@nestjs/common';
import { DataExtractModule } from './Modules/data-extract/data-extract.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DataExtractModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
