import { Controller, Get } from '@nestjs/common';
import { WorkerServiceService } from './worker-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class WorkerServiceController {
  constructor(private readonly workerServiceService: WorkerServiceService) {}

  @EventPattern('CmLog.created') // topic name
  handleMessage(@Payload() message: any) {
    if (typeof message == 'object') {
      return;
    }
    this.workerServiceService.handleCmDataLog(message);
  }
}
