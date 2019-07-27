import BaseModel from './base.model';

class User extends BaseModel {
  name: string  = '';
  fname: string = '';
  lname: string = '';
  id: string = '';
  roles = {
    riverside_facilitator: false,
    riverside_se: false,
    super_admin: false
  };
  org = {
    id: 0
  };

  protected transform() {
    return {
      name: (val: any, data: any) => {
        return `${data.fname} ${data.lname}`;
      },
      roles: (val: any, data: any) => {
        return {
          riverside_facilitator: !!data.is_riverside_facilitator,
          riverside_se: !!data.is_riverside_se,
          super_admin: !!data.is_super_admin,
        };
      }
    };
  }

}
export default User;
