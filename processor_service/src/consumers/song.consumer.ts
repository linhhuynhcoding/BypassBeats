import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SongService } from '../services/song.service';

@Controller()
export class SongConsumer {
  constructor(private readonly songService: SongService) {}

  @EventPattern('download_song')
  async handleDownload(@Payload() data: { url: string }) {
    console.log('🎧 Kafka Event: download_song:', data.url);
    await this.songService.downloadAndSaveSong(data.url);
  }
}
