import { Controller } from '@nestjs/common';
import { DataStorageService } from './data-storage.service';
import { ApiDataStorage } from './data-storage.swagger';

@ApiDataStorage()
@Controller('storage')
export class DataStorageController {
  constructor(private readonly dataStorageService: DataStorageService) {}
}
