import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { profileImageSchema } from './schema/profileimage.schema';
import { Profile, ProfileSchema } from './schema/profile.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:"profileimage",schema:profileImageSchema},{name:Profile.name,schema:ProfileSchema}]),
],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports:[ProfileService]
})
export class ProfileModule {}
