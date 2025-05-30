// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 4000;
  const kafkaBroker = configService.get<string>('KAFKA_BROKER') || 'kafka:9092';

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [kafkaBroker],
      },
      consumer: {
        groupId: 'processor-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);

  console.log(`🚀 Processor service is running on http://localhost:${port}`);
}
bootstrap();
