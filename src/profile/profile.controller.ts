import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User, UserDocument } from 'src/users/schema/users.schema';

@ApiTags('user_profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('update-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profileImage'))
  updateImage(@UploadedFile() file: Express.Multer.File) {
    return this.profileService.updateImageS(file);
  }

  @Post('follow/:user_id')
  followFriend(@Param('user_id') userID: string) {    
    return this.profileService.followFriendS(userID);
  }

  @Post('unfollow/:user_id')
  UnFollowFriend(@Param('user_id') userID: string) {    
    return this.profileService.UnFollowFriendS(userID);
  }

  @Post('abcbcb')
  findOne(@Body() object: CreateProfileDto) {
    return this.profileService.create(object);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
