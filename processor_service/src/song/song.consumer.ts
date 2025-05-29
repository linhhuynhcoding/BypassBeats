import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SongService } from './song.service';

@Controller()
export class SongConsumer {
  constructor(private readonly songService: SongService) {}

  @EventPattern('download_song')
  async handleDownload(@Payload() data: any) {
    console.log('Received download_song event:', data);
    await this.songService.downloadAndSaveSong(data.url);
  }
}
