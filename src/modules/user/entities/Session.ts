import { v4 as uuid } from "uuid";

export class Session {
  id: string;
  user_id: string;
  refresh_token: string;
  expiration_date: Date;
  created_at: Date;
  updated_at: Date;

  constructor() {
    if (this.id == null) {
      this.id = uuid();
    }

    if (this.created_at == null) {
      this.created_at = new Date();
    }

    if (this.updated_at == null) {
      this.updated_at = new Date();
    }
  }
}
