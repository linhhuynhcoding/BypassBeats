import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Res,
  Headers,
  Query,
} from '@nestjs/common';
import { SongService } from '../services/song.service';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post('convert')
  async convert(@Body() body: { url: string }) {
    const result = await this.songService.downloadAndSaveSong(body.url);
    return { success: true, songId: result };
  }

  @Get('play/:id')
  async stream(
    @Param('id') id: string,
    @Query('type') type: 'm4a' | 'mp3' = 'mp3',
    @Headers('range') range: string,
    @Res() res: Response,
  ) {
    const filePath = path.join(__dirname, '../../storage', `${id}.${type}`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': type === 'mp3' ? 'audio/mpeg' : 'audio/mp4',
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': type === 'mp3' ? 'audio/mpeg' : 'audio/mp4',
        'Accept-Ranges': 'bytes',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  }
}
