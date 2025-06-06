import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { forwardRequest } from '../utils/http';
import { Request, Response } from 'express';

@Controller()
export class ProcessorRoute {
  @Post('convert')
  async convert(@Req() req: Request, @Res() res: Response) {
    const response = await forwardRequest(
      `${process.env.PROCESSOR_SERVICE_URL}/songs/convert`,
      'POST',
      req.body,
    );
    res.json(response.data);
  }

  @Get('play/:id')
  async stream(@Req() req: Request, @Res() res: Response) {
    const videoId = req.params.id;
    const rangeHeader = req.headers.range;

    try {
      const streamRes = await forwardRequest(
        `${process.env.PROCESSOR_SERVICE_URL}/songs/play/${videoId}?type=mp3`,
        'GET',
        null,
        {
          responseType: 'stream',
          headers: {
            Range: rangeHeader || '',
          },
        },
      );

      res.set(streamRes.headers);
      res.status(streamRes.status);
      streamRes.data.pipe(res);
    } catch (err: any) {
      if (err.response) {
        res
          .status(err.response.status)
          .json({ message: err.response.data?.message || 'Upstream error' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}
