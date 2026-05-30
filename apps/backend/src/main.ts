import 'reflect-metadata';
import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';
  const isProduction = nodeEnv === 'production';
  const httpServer = app.getHttpAdapter().getInstance();

  app.setGlobalPrefix('api');
  httpServer.disable('x-powered-by');
  httpServer.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: configService.get<number>('RATE_LIMIT_WINDOW_MS') ?? 60000,
      limit: configService.get<number>('RATE_LIMIT_MAX_REQUESTS') ?? 100,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: {
        statusCode: 429,
        message: 'Too many requests, please try again later.'
      }
    })
  );
  app.enableCors({
    origin: [configService.get<string>('APP_URL') ?? 'http://localhost:3000'],
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );

  const swaggerEnabled = configService.get<boolean>('ENABLE_SWAGGER') ?? !isProduction;
  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('CryptoMerchant API')
      .setDescription('Crypto payment gateway for merchants')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  const port = configService.get<number>('PORT') ?? 4000;
  await app.listen(port);
}

void bootstrap();
