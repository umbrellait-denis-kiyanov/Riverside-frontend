import BaseModel from 'src/app/common/interfaces/base.model';



class Message extends BaseModel {
  id: number = null;
  assessment_session_id: number = null;
  from_org_id: number = null;
  to_org_id: number = null;
  module_id: number = null;
  step_id: number = null;
  message: string = null;
  stepName: string = null;
  moduleName: string = null;
  orgName: string = null;
  sent_on: Date = null;
  read_on: Date = null;
  is_pending: boolean = false;
}

export type MessageRow = Message  & {
  link: string[];
  className?: string;
};

export default Message;
