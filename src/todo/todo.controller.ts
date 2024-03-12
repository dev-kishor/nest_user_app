import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as mimeTypes from 'mime-types';
// import { AuthGuard } from 'src/auth/auth. guard';

@ApiTags('Controller_Todo')
// @ApiBearerAuth("access-token")
@Controller('/todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly configService: ConfigService,
  ) {}

  @Get('all-logs')
  async allLogsAndDwlndFile(@Res() res: any) {
    try {
      const logFile = await this.todoService.getAllLogsInFile().then((data) => {
        const filePath = path.resolve(data);
        const file_name = this.configService.get('DB_LOG_FILE');
        res.download(filePath, file_name);
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
  
  @Post('read-all-logs')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
      const allowedMimeTypes = ['text/plain'];
      const fileExtension = file.originalname.split('.').pop();
      const fileMimeType = mimeTypes.lookup(fileExtension);
      if (!fileMimeType || !allowedMimeTypes.includes(fileMimeType)) {
        throw new BadRequestException(
          'Invalid file type. Only text files are allowed.',
        );
      }
      const parseFileResult =
        await this.todoService.readLogFileAndDumpIntoDB(file);
      return {
        message: 'File content read successfully',
        content: parseFileResult,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @ApiBody({ type: CreateTodoDto })
  create(@Body() createTodoDto: CreateTodoDto) {
    try {
      return this.todoService.create(createTodoDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
  
  @Get("")
  // @UseGuards(AuthGuard)
  findAll(@Request() req:any) {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.todoService.findOne(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Patch('/:id')
  @ApiBody({ type: UpdateTodoDto })
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, updateTodoDto);
  }

  // Transaction Example
  @Post('/tran')
  async runTran() {
    try {
      const result = await this.todoService.runTran();
      return result;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
