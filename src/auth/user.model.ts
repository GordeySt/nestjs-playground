import { prop } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';
import { IsEmail } from "class-validator";

export interface UserModel extends Base { }
export class UserModel extends TimeStamps {
  @prop({ unique: true })
  @IsEmail()
  email: string;

  @prop()
  passwordHash: string;
}
