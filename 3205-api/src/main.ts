import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
  });
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'healthcheck', method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .setTitle('3205-api')
    .setDescription('3205-api API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    jsonDocumentUrl: 'docs-json',
  });

  const port = process.env.PORT || 8080;

  await app.listen(port);

  console.log(`Docs available at http://localhost:${port}/api-docs`);
  console.log(`OpenAPI JSON available at http://localhost:${port}/docs-json`);
}
bootstrap();
