import { JwtPayload } from "./JwtPayload";

export class User {
  id!: number;
  img!: string;
  username!: string;
  firstName!: string;
  lastName!: string;
  token!: JwtPayload;
}
