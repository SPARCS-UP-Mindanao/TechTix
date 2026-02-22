export type UserGroup = 'admin' | 'super_admin';

export interface CurrentUser {
  sub: string;
  'cognito:groups': UserGroup[];
  username: string;
}
