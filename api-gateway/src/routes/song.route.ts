import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { forwardRequest } from '../utils/http';
import { Request, Response } from 'express';

@Controller('api')
export class SongRouter {
  @Get('/:id')
  async getSongById(@Req() req: Request, @Res() res: Response) {}
}
