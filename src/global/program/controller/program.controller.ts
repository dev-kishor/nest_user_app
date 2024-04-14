import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProgramService } from '../service/program.service';
import { CreateProgramDto } from '../dto/create-program.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('program')
@Controller('program')
export class ProgramController {
  constructor(private readonly globaluseService: ProgramService) {}

  @Post()
  create(@Body() createGlobaluseDto: CreateProgramDto) {
    return this.globaluseService.create(createGlobaluseDto);
  }

  @Get()
  findAll() {
    return this.globaluseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.globaluseService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGlobaluseDto: CreateProgramDto,
  ) {
    return this.globaluseService.update(+id, updateGlobaluseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.globaluseService.remove(+id);
  }
}
