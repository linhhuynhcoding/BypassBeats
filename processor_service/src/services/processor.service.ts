import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import YtDlpWrap from 'yt-dlp-wrap';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegStatic from 'ffmpeg-static';
import * as path from 'path';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class SongService {
  private ytDlpWrap: YtDlpWrap;

  constructor(
    @Inject('KAFKA_PRODUCER') private readonly kafkaClient: ClientKafka,
  ) {
    const binaryPath = resolve(__dirname, '../../bin/yt-dlp.exe');
    console.log('yt-dlp exists:', existsSync(binaryPath));
    this.ytDlpWrap = new YtDlpWrap(binaryPath);

    // Thiết lập path ffmpeg
    ffmpeg.setFfmpegPath(ffmpegStatic);
  }

  async downloadAndSaveSong(url: string): Promise<string> {
    const title = await this.getVideoId(url);
    const storagePath = resolve(__dirname, '../../storage');
    const m4aPath = path.join(storagePath, `${title}.m4a`);
    const mp3Path = path.join(storagePath, `${title}.mp3`);

    if (existsSync(m4aPath) && existsSync(mp3Path)) {
      console.log(`[CACHE HIT] ${title} đã tồn tại`);
      return title;
    }

    console.log(`[DOWNLOAD] Bắt đầu tải ${title}`);

    await new Promise<void>((resolve, reject) => {
      this.ytDlpWrap
        .exec([url, '-f', 'bestaudio[ext=m4a]', '-o', m4aPath, '--no-playlist'])
        .on('close', () => resolve())
        .on('error', (err) => reject(err));
    });

    if (!existsSync(mp3Path)) {
      await this.convertM4aToMp3(m4aPath, mp3Path);
    }

    return title;
  }

  private convertM4aToMp3(
    inputPath: string,
    outputPath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat('mp3')
        .on('error', (err) => {
          console.error('Error converting file:', err);
          reject(err);
        })
        .on('end', () => {
          console.log('Conversion finished:', outputPath);
          resolve();
        })
        .save(outputPath);
    });
  }

  getAudioStream(id: string, type: 'm4a' | 'mp3' = 'm4a') {
    const filePath = path.join(__dirname, '../../storage', `${id}.${type}`);
    return fs.createReadStream(filePath);
  }

  private async getVideoId(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.ytDlpWrap
        .execPromise(['--get-id', url])
        .then((output) => {
          resolve(output.trim());
        })
        .catch((err) => reject(err));
    });
  }
}
