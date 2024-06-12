import { jwtDecode } from 'jwt-decode';

export function decodeToken(token: string): any {
  try {
    return jwtDecode(token);
  } catch (Error) {
    return null;
  }
}
