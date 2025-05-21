import { NestFactory } from '@nestjs/core';
import { WorkerServiceModule } from './worker-service.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { BadRequestException, ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({ isGlobal: true }),
    {
      logger: new ConsoleLogger({
        colors: true,
      }),
    },
  );
  const configService = appContext.get(ConfigService);

  const broker = configService.get<string>('BROKER');
  if (!broker) {
    throw new BadRequestException(
      'BROKER is not defined in environment variables',
    );
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'CmDataLog',
          brokers: [broker],
        },
        consumer: {
          groupId: 'cm-data-log-group',
          sessionTimeout: 30000,
          heartbeatInterval: 5000,
          rebalanceTimeout: 60000,
          allowAutoTopicCreation: true,
        },
        run: {
          autoCommit: true,
          autoCommitInterval: 5000,
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
