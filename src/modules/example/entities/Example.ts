import { v4 as uuid } from "uuid";

export class Example {
  id: string;
  name: string;
  email: string;
  active: boolean;
  created_at: Date;

  constructor() {
    if (this.id == null) {
      this.id = uuid();
    }

    if (this.active == null) {
      this.active = false;
    }

    if (this.created_at == null) {
      this.created_at = new Date();
    }
  }
}
