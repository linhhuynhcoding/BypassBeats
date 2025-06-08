import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import * as fs from 'fs';
import { existsSync } from 'fs';
import * as path from 'path';
import { join, resolve } from 'path';
import axios from 'axios';
import YtDlpWrap from 'yt-dlp-wrap';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegStatic from 'ffmpeg-static';

@Injectable()
export class SongService {
  private ytDlpWrap: YtDlpWrap;

  constructor(
    @Inject('KAFKA_PRODUCER') private readonly kafkaClient: ClientKafka,
    private readonly configService: ConfigService,
  ) {
    const binaryPath = resolve(__dirname, '../../bin/yt-dlp.exe');
    console.log('yt-dlp exists:', existsSync(binaryPath));
    this.ytDlpWrap = new YtDlpWrap(binaryPath);

    ffmpeg.setFfmpegPath(ffmpegStatic);
  }

  async downloadAndSaveSong(url: string): Promise<string> {
    const videoId = await this.getVideoId(url);
    const title = await this.getVideoTitle(videoId);

    console.log(`[INFO] Video ID: ${videoId}`);
    console.log(`[INFO] Video Title: ${title}`);

    const storagePath = resolve(__dirname, '../../storage');
    const m4aPath = path.join(storagePath, `${videoId}.m4a`);
    const mp3Path = path.join(storagePath, `${videoId}.mp3`);

    if (existsSync(m4aPath) && existsSync(mp3Path)) {
      console.log(`[CACHE HIT] ${videoId} đã tồn tại`);
      return videoId;
    }

    console.log(`[DOWNLOAD] Bắt đầu tải ${videoId}`);

    await new Promise<void>((resolve, reject) => {
      this.ytDlpWrap
        .exec([url, '-f', 'bestaudio', '-o', m4aPath, '--no-playlist'])
        .on('close', () => resolve())
        .on('error', (err) => reject(err));
    });

    if (!existsSync(mp3Path)) {
      await this.convertM4aToMp3(m4aPath, mp3Path);
    }

    await this.kafkaClient.emit('song.converted', {
      id: videoId,
      title,
    });

    return videoId;
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
    return this.ytDlpWrap
      .execPromise(['--get-id', url])
      .then((output) => output.trim());
  }

  private async getVideoTitle(videoId: string): Promise<string> {
    const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos`,
        {
          params: {
            part: 'snippet',
            id: videoId,
            key: apiKey,
          },
        },
      );
      const items = response.data.items;
      if (items && items.length > 0) {
        return items[0].snippet.title;
      }
      return 'Unknown Title';
    } catch (err) {
      console.error('Failed to fetch video title:', err.message);
      return 'Unknown Title';
    }
  }
}
