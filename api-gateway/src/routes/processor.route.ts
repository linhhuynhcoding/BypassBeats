import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { forwardRequest } from '../utils/http';
import { Request, Response } from 'express';

@Controller('api')
export class ProcessorRoute {
  @Post('convert')
  async convert(@Req() req: Request, @Res() res: Response) {
    const response = await forwardRequest(
      `${process.env.PROCESSOR_SERVICE_URL}/convert`,
      'POST',
      req.body,
    );
    res.json(response.data);
  }

  @Get('play/:id')
  async stream(@Req() req: Request, @Res() res: Response) {
    const videoId = req.params.id;
    const streamRes = await forwardRequest(
      `${process.env.PROCESSOR_SERVICE_URL}/play/${videoId}`,
      'GET',
      null,
      { responseType: 'stream' },
    );
    streamRes.data.pipe(res);
  }
}
