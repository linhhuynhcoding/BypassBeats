import { Module } from '@nestjs/common';
import { ProcessorRoute } from './routes/processor.route';
import { UserRoute } from './routes/user.route';

@Module({
  imports: [],
  controllers: [ProcessorRoute, UserRoute],
})
export class AppModule {}
