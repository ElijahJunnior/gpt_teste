export interface ICreateSessionDTO {
  id: string;
  user_id: string;
  refresh_token: string;
  expiration_date: Date;
}
