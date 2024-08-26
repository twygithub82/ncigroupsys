import { JwtPayload } from "./JwtPayload";

export class User {
  id!: number;
  img!: string;
  username!: string;
  name!: string;
  email!: string;
  groupsid!: string;
  role!: string;
  roles!: string[];
  primarygroupsid!: string;
  token!: JwtPayload;
  plainToken!: string;
  expiration!: string;
  refreshToken!: string;
}
