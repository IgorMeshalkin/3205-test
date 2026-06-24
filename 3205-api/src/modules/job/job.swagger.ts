import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function ApiJob() {
  return applyDecorators(ApiTags('Job'));
}
