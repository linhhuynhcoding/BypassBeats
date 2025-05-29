import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { forwardRequest } from '../utils/http';
import { Request, Response } from 'express';

@Controller('api')
export class UserRoute {
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const response = await forwardRequest(
      `${process.env.USER_SERVICE_URL}/login`,
      'POST',
      req.body,
    );
    res.json(response.data);
  }

  @Post('playlist')
  async createPlaylist(@Req() req: Request, @Res() res: Response) {
    const response = await forwardRequest(
      `${process.env.USER_SERVICE_URL}/playlist`,
      'POST',
      req.body,
      { Authorization: req.headers.authorization },
    );
    res.json(response.data);
  }

  @Get('playlist')
  async getPlaylist(@Req() req: Request, @Res() res: Response) {
    const response = await forwardRequest(
      `${process.env.USER_SERVICE_URL}/playlist`,
      'GET',
      null,
      { Authorization: req.headers.authorization },
    );
    res.json(response.data);
  }
}
