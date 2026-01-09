import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OxClientService } from './ox-client.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [OxClientService],
  exports: [OxClientService],
})
export class OxModule {}
