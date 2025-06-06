import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  Res,
  Param,
} from '@nestjs/common';
import { forwardRequest } from '../utils/http';
import { Request, Response } from 'express';

@Controller()
export class SongRouter {
  @Get('song/:id')
  async getSongById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const response = await forwardRequest(
      `${process.env.SONG_SERVICE_URL}/song/${id}`,
      'GET',
      null,
      {
        headers: {
          Authorization: req.headers.authorization || '',
        },
      },
    );
    res.status(response.status).set(response.headers).json(response.data);
  }

  @Post('playlist')
  async createPlaylist(@Req() req: Request, @Res() res: Response) {
    const response = await forwardRequest(
      `${process.env.SONG_SERVICE_URL}/playlist`,
      'POST',
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization || '',
        },
      },
    );
    res.status(response.status).set(response.headers).json(response.data);
  }

  @Get('playlist')
  async getPlaylist(@Req() req: Request, @Res() res: Response) {
    const response = await forwardRequest(
      `${process.env.SONG_SERVICE_URL}/playlist`,
      'GET',
      null,
      {
        headers: {
          Authorization: req.headers.authorization || '',
        },
      },
    );
    res.status(response.status).set(response.headers).json(response.data);
  }

  @Put('playlist/:id')
  async updatePlaylist(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const response = await forwardRequest(
      `${process.env.SONG_SERVICE_URL}/playlist/${id}`,
      'PUT',
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization || '',
        },
      },
    );
    res.status(response.status).set(response.headers).json(response.data);
  }

  @Delete('playlist/:id')
  async deletePlaylist(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const response = await forwardRequest(
      `${process.env.SONG_SERVICE_URL}/playlist/${id}`,
      'DELETE',
      null,
      {
        headers: {
          Authorization: req.headers.authorization || '',
        },
      },
    );
    res.status(response.status).set(response.headers).json(response.data);
  }
}
