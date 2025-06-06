import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Inject,
} from '@nestjs/common';
import { ForwardInterceptor } from '../interceptors/forward.interceptor';
const SONG_SERVICE_URL = 'SONG_SERVICE_URL';
@Controller()
export class SongRouter {
  constructor() {}

  @Get('song/:id')
  @UseInterceptors(new ForwardInterceptor(SONG_SERVICE_URL || '', '/songs/:id'))
  getSongById() {}

  @Post('playlist')
  @UseInterceptors(new ForwardInterceptor(SONG_SERVICE_URL || '', '/playlist'))
  createPlaylist() {}

  @Get('playlist')
  @UseInterceptors(new ForwardInterceptor(SONG_SERVICE_URL || '', '/playlist'))
  getPlaylist() {}

  @Put('playlist/:id')
  @UseInterceptors(
    new ForwardInterceptor(SONG_SERVICE_URL || '', '/playlist/:id'),
  )
  updatePlaylist() {}

  @Delete('playlist/:id')
  @UseInterceptors(
    new ForwardInterceptor(SONG_SERVICE_URL || '', '/playlist/:id'),
  )
  deletePlaylist() {}
}
