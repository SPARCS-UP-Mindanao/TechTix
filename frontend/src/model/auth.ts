export interface CurrentUser {
  sub: string;
  'cognito:groups': string;
  username: string;
}
