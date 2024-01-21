import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags("Controller_Todo")
@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @ApiBody({type:CreateTodoDto})
  create(@Body() createTodoDto: CreateTodoDto) {
    try {
      // throw new HttpException('Forbiddenaa', HttpStatus.FORBIDDEN);
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

  @Get()
  findAll() {
    console.log(this.configService.get('PORT'));
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Patch('/:id')
  @ApiBody({type:UpdateTodoDto})
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
