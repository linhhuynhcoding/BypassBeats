import { Controller, Post, Body, Param, Get, Res } from '@nestjs/common';
import { SongService } from '../services/song.service';
import { Response } from 'express';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post('convert')
  async convert(@Body() body: { url: string }) {
    console.log({ url: body.url });
    const result = await this.songService.downloadAndSaveSong(body.url);
    return { success: true, songId: result };
  }

  @Get('play/:id')
  async stream(@Param('id') id: string, @Res() res: Response) {
    const stream = await this.songService.getAudioStream(id);
    stream.pipe(res);
  }
}
