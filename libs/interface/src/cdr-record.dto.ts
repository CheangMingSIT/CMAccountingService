import { IsInt, IsString } from 'class-validator';

export class CdrRecordDto {
  @IsString()
  date: string;

  @IsString()
  time: string;

  @IsString()
  duration: string;

  @IsString()
  secdur: string;

  @IsInt()
  condCode: number;

  @IsString()
  codeDial: string;

  @IsString()
  codeUsed: string;

  @IsString()
  dialedNum: string;

  @IsString()
  callingNum: string;

  @IsString()
  authCode: string;

  @IsInt()
  inCrtID: number;

  @IsInt()
  outCrtID: number;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}
