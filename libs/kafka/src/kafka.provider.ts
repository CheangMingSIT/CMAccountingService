// kafka.config.ts
import {
  Transport,
  ClientProviderOptions,
  ClientsModuleAsyncOptions,
} from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

export default class KafkaConfig {
  static getKafkaConfig(configService: ConfigService): ClientProviderOptions {
    const broker = configService.get<string>('BROKER');
    if (!broker) {
      throw new Error('BROKER is not defined');
    }

    return {
      name: 'CMLOGSERVICE',
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
    };
  }
}

export const kafkaClientAsyncOptions: ClientsModuleAsyncOptions = [
  {
    name: 'CMLOGSERVICE',
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      return KafkaConfig.getKafkaConfig(configService);
    },
    inject: [ConfigService],
  },
];
