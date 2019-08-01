import BaseModel from 'src/app/common/interfaces/base.model';


class Message extends BaseModel {
  from_org_id: number = null;
  to_org_id: number = null;
  module_id: number = null;
  step_id: number = null;
  message: string = null;
  sent_on: Date = null;
  read_on: Date = null;
}
export default Message;
