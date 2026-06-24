import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function ApiDataStorage() {
  return applyDecorators(ApiTags('DataStorage'));
}
