import { Module } from '@nestjs/common';
import { ProcessorRoute } from './routes/processor.route';
import { UserRoute } from './routes/user.route';
import { SongRouter } from './routes/song.route';

@Module({
  imports: [],
  controllers: [ProcessorRoute, UserRoute, SongRouter],
})
export class AppModule {}
