import BaseModel from './base.model';

class User extends BaseModel {
  name: string  = '';
  fname: string = '';
  lname: string = '';
  email: string = '';
  id: string = '';

  permissions = {
    riversideRMCFDashboard: false,
    riversideSalesDashboard: false,
    riversideModuleEditor: false,
    riversideRequestFeedback: false,
    riversideProvideFeedback: false,
  };

  protected transform() {
    return {
      name: (val: any, data: any) => {
        return `${data.fname} ${data.lname}`;
      }
    };
  }

}
export default User;
