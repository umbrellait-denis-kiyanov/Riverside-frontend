import BaseModel from './base.model';

class User extends BaseModel {
  name: string  = '';
  fname: string = '';
  lname: string = '';
  email: string = '';
  id: string = '';
  roles = {
    riverside_facilitator: false,
    is_riverside_managing_director: false,
    super_admin: false
  };
  permissions = {
    riversideRMCFDashboard: false,
    riversideSalesDashboard: false,
    riversideModuleEditor: false,
    riversideRequestFeedback: false
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
          is_riverside_managing_director: !!data.is_riverside_managing_director,
          super_admin: !!data.is_super_admin,
        };
      }
    };
  }

}
export default User;
