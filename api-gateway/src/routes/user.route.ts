import { Controller, Post, Req, Res } from '@nestjs/common';
import { forwardRequest } from '../utils/http';
import { Request, Response } from 'express';

@Controller()
export class UserRoute {
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const response = await forwardRequest(
      `${process.env.USER_SERVICE_URL}/login`,
      'POST',
      req.body,
    );
    res.status(response.status).set(response.headers).json(response.data);
  }

  @Post('register')
  async register(@Req() req: Request, @Res() res: Response) {
    const response = await forwardRequest(
      `${process.env.USER_SERVICE_URL}/register`,
      'POST',
      req.body,
    );
    res.status(response.status).set(response.headers).json(response.data);
  }
}
