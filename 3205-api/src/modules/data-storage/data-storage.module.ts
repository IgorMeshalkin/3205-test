import {Module} from '@nestjs/common';
import {DataStorageService} from './data-storage.service';

@Module({
    providers: [DataStorageService],
    exports: [DataStorageService],
})
export class DataStorageModule {
}
