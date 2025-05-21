import { CdrDataParameter } from '@app/database';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { CdrRecordDto } from '@app/interface';

@Injectable()
export class WorkerServiceService {
  constructor(
    @InjectRepository(CdrDataParameter, 'mssql')
    private cdrRepository: Repository<CdrDataParameter>,
  ) {}

  private baseLogDir = path.join(__dirname, 'assets/CDR-logs');

  private getLogFilePath(): string {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // month is 0-indexed
    const day = String(now.getDate()).padStart(2, '0');

    const dirPath = path.join(this.baseLogDir, year, month, day);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    return path.join(dirPath, 'cdr-records.txt');
  }

  async handleCmDataLog(message: any) {
    if (!message) {
      throw new BadRequestException('Empty CM data parameter log');
    }
    const filePath = this.getLogFilePath();
    fs.appendFileSync(filePath, message + '\n'); // append to daily log
    const parsedRecord = this.parseCdrRecord(message);
    this.cdrRepository.save(parsedRecord);
  }

  private parseCdrRecord(record: string): CdrRecordDto {
    return {
      date: record.slice(0, 6).trim(),
      time: record.slice(7, 11).trim(),
      duration: record.slice(12, 16).trim(),
      secdur: record.slice(17, 22).trim(),
      condCode: parseInt(record.slice(23, 24).trim() || '0', 10),
      codeDial: record.slice(25, 29).trim(),
      codeUsed: record.slice(30, 34).trim(),
      dialedNum: record.slice(35, 58).trim(),
      callingNum: record.slice(59, 74).trim(),
      authCode: record.slice(75, 83).trim(),
      inCrtID: parseInt(record.slice(84, 87).trim() || '0', 10),
      outCrtID: parseInt(record.slice(88, 93).trim() || '0', 10),
    };
  }
}
