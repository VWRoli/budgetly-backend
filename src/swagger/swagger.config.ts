import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function initializeSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Budgetly')
    .setDescription('The budgetly API description')
    .setVersion('1.0')
    .addTag('budgetly')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
