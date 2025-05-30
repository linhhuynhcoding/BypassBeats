import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SongService } from './services/song.service';
import { SongConsumer } from './consumers/song.consumer';
import { SongController } from './controllers/song.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'SONG_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'song-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [SongController, SongConsumer],
  providers: [SongService],
})
export class AppModule {}
