import { Injectable } from '@nestjs/common';
import { CreateProgramDto } from '../dto/create-program.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Program, ProgramDocument } from '../schema/program.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProgramService {
  constructor(
    @InjectModel(Program.name)
    private readonly programModel: Model<ProgramDocument>,
  ) {}
  create(createGlobaluseDto: CreateProgramDto) {
    return 'This action adds a new globaluse';
  }

  findAll() {
    return `This action returns all globaluse`;
  }

  findOne(id: number) {
    return `This action returns a #${id} globaluse`;
  }

  update(id: number, updateGlobaluseDto: CreateProgramDto) {
    return `This action updates a #${id} globaluse`;
  }

  remove(id: number) {
    return `This action removes a #${id} globaluse`;
  }
}
