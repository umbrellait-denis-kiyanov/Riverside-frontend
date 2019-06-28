import { Injectable } from '@angular/core';
import User from '../interfaces/user.model';


@Injectable()
export class UserService {

  me: User;

  constructor() { }

  setMeFromData(data: any) {
    this.me = User.fromObject<User>(data);
  }

}
