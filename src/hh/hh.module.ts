import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HhService } from './hh.service';

@Module({
  providers: [HhService],
  imports: [HttpModule],
  exports: [HhService]
})
export class HhModule { }