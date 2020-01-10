import BaseModel from './base.model';

class User extends BaseModel {
  name: string  = '';
  fname: string = '';
  lname: string = '';
  email: string = '';
  abbreviation: string = '';
  id: string = '';
  profile_picture: string = '';
  permissions = {
    riversideRMCFDashboard: false,
    riversideSalesDashboard: false,
    riversideModuleEditor: false,
    riversideRequestFeedback: false,
    riversideProvideFeedback: false,
  };

  protected transform() {
    return {
      name: (val: any, data: User) => {
        return `${data.fname} ${data.lname}`;
      },
      abbreviation: (val: any, data: User) => {
        return `${data.fname[0].toUpperCase()}${data.lname[0].toUpperCase()}`;
      },
    };
  }

}
export default User;
