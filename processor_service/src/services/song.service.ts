import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as ytdl from 'ytdl-core';
import { join } from 'path';

@Injectable()
export class SongService {
  async downloadAndSaveSong(url: string): Promise<string> {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.videoId;
    const filePath = join(__dirname, '../../storage', `${title}.mp3`);

    await new Promise<void>((resolve, reject) => {
      ytdl(url, { filter: 'audioonly' })
        .pipe(fs.createWriteStream(filePath))
        .on('finish', () => resolve())
        .on('error', (err) => reject(err));
    });

    return title;
  }

  getAudioStream(id: string) {
    const filePath = join(__dirname, '../../storage', `${id}.mp3`);
    return fs.createReadStream(filePath);
  }
}
