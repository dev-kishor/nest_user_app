import { DocumentBuilder } from "@nestjs/swagger";

export const documentConfig = new DocumentBuilder()
.setTitle('User App APIs')
.setDescription('User app apis doc.')
.setVersion('1.0')
// .addTag('UserApp')
.build();