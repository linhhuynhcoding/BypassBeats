import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProcessorRoute } from './routes/processor.route';
import { UserRoute } from './routes/user.route';
import { SongRouter } from './routes/song.route';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ProcessorRoute, UserRoute, SongRouter],
})
export class AppModule {}
