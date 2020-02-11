import BaseModel from './base.model';

class User extends BaseModel {
  name = '';
  fname = '';
  lname = '';
  email = '';
  abbreviation = '';
  id = '';
  profile_picture = '';
  permissions = {
    riversideRMCFDashboard: false,
    riversideSalesDashboard: false,
    riversideModuleEditor: false,
    riversideRequestFeedback: false,
    riversideProvideFeedback: false
  };

  protected transform() {
    return {
      name: (val: any, data: User) => {
        return `${data.fname} ${data.lname}`;
      },
      abbreviation: (val: any, data: User) => {
        return `${data.fname[0].toUpperCase()}${data.lname[0].toUpperCase()}`;
      }
    };
  }
}
export default User;
