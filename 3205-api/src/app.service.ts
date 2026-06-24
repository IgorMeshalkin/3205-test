import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthcheck(): string {
    return 'This is a 3205-api';
  }
}
