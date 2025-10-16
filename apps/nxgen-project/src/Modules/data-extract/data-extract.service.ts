import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import * as net from 'net';

@Injectable()
export class DataExtractService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('CdrSocket');
  private readonly PORT: number;

  constructor(
    @Inject('CMLOGSERVICE') private readonly kafkaClient: ClientKafka,
    private readonly configService: ConfigService,
  ) {
    this.PORT = this.configService.get<number>('CDR_PORT') || 3000;
  }

  async onModuleInit() {
    await this.retryKafkaConnect(10, 3000); // retry 10 times, 3s delay
    await this.kafkaClient.emit('CmLog.created', { init: true }).toPromise();

    this.startSocketServer();
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  private async retryKafkaConnect(maxRetries: number, delayMs: number) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(`Connecting to Kafka (attempt ${attempt})`);
        await this.kafkaClient.connect();
        this.logger.log('Kafka connected');
        return;
      } catch (err) {
        this.logger.error(`Kafka connection failed: ${err.message}`);
        if (attempt === maxRetries) throw err;
        this.logger.log(`Retrying in ${delayMs}ms...`);
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }

  private startSocketServer() {
    const server = net.createServer((socket) => {
      let headerSkipped = false;

      this.logger.log(`📱 Avaya connected: ${socket.remoteAddress}`);
      socket.on('data', async (data) => {
        if (!headerSkipped) {
          headerSkipped = true;
          return;
        }

        const message = this.removeTimestampLine(data.toString('ascii'));

        this.kafkaClient
          .emit('CmLog.created', {
            value: message,
          })
          .subscribe();
      });

      socket.on('close', () => {
        this.logger.log(`🔌 Connection closed: ${socket.remoteAddress}`);
      });

      socket.on('error', (err) => {
        this.logger.error(`Socket error: ${err.message}`);
      });
    });

    server.listen(this.PORT, '0.0.0.0', () => {
      this.logger.log(`📡 TCP Server listening on port ${this.PORT}`);
    });
  }

  private removeTimestampLine(text: string): string {
    return text.replace(/\d{2}:\d{2} \d{2}\/\d{2}/g, '').trim();
  }
}
