import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { WorkerServiceService } from './worker-service.service';

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
