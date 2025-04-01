import { v4 as uuid } from "uuid";

export class User {
  id: string;
  email: string;
  name: string;
  password: string;
  validated: boolean;
  created_at: Date;

  validation_key: string;
  reset_password_key: string;

  constructor() {
    if (this.id == null) {
      this.id = uuid();
    }

    if (this.validated == null) {
      this.validated = false;
    }

    if (this.created_at == null) {
      this.created_at = new Date();
    }
  }
}
