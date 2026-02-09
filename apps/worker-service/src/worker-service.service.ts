import { CdrDataParameter } from '@app/database';
import { CdrRecordDto } from '@app/interface';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class WorkerServiceService {
  private readonly logger = new Logger('worker-service');
  constructor(
    @InjectRepository(CdrDataParameter, 'mssql')
    private cdrRepository: Repository<CdrDataParameter>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private baseLogDir = path.join(__dirname, 'assets/CDR-logs');

  private getLogFilePath(): string {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // month is 0-indexed
    const day = String(now.getDate()).padStart(2, '0');

    const dirPath = path.join(this.baseLogDir, year, month, day);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true }); // make the file directory
    }

    return path.join(dirPath, 'cdr-records.txt');
  }

  async handleCmDataLog(message: any) {
    // main function of handling the logs
    if (!message) {
      throw new BadRequestException('Empty CM data parameter log');
    }
    const filePath = this.getLogFilePath();
    fs.appendFileSync(filePath, message + '\n'); // append to daily log
    const parsedRecord = this.parseCdrRecord(message);
    await this.cdrRepository.save(parsedRecord); // append to database

    // passing to Hein service
    const url = this.configService.get('URL');
    if (!url) throw new BadRequestException('INVALID URL');
    try {
      await firstValueFrom(
        this.httpService.post(url, null, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Request failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private parseCdrRecord(record: string): CdrRecordDto {
    return {
      date: record.slice(0, 6).trim(),
      time: record.slice(7, 11).trim(),
      duration: record.slice(12, 16).trim(),
      secdur: record.slice(17, 22).trim(),
      condCode: record.slice(23, 24).trim(),
      codeDial: record.slice(25, 29).trim(),
      codeUsed: record.slice(30, 34).trim(),
      dialedNum: record.slice(35, 58).trim(),
      callingNum: record.slice(59, 74).trim(),
      authCode: record.slice(75, 83).trim(),
      inCrtID: parseInt(record.slice(84, 87).trim() || '0', 10),
      outCrtID: parseInt(record.slice(88, 93).trim() || '0', 10),
      startTime: record.slice(94, 101).trim(),
      endTime: record.slice(101, 108).trim(),
    };
  }
}
