import { ObjectId } from "mongoose";

export interface IUser {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}
