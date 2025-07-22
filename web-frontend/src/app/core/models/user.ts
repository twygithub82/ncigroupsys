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
  functions!: string[];
  primarygroupsid!: string;
  token!: JwtPayload;
  plainToken!: string;
  expiration!: string;
  refreshToken!: string;
  isStaff!: boolean;
  userdata!: [];
}

export class UserToken {
  token!: string;
  expiration!: string;
  refreshToken!: string;
}
