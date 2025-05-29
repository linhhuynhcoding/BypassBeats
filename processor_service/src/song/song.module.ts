import { SongConsumer } from './song.consumer';
import { Module } from '@nestjs/common';
import { SongService } from './song.service';

@Module({
  providers: [SongService, SongConsumer],
})
export class SongModule {}
