export class JwtPayload {
    jti!: string;
    name!: string;
    email!: string;
    groupsid!: string;
    role!: string;
    exp!: number;
    iss!: string;
    aud!: string;
}