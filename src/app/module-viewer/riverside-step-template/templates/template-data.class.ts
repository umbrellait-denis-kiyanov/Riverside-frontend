import { BehaviorSubject } from "rxjs";
import User from "src/app/common/interfaces/user.model";
import ModuleContent from "src/app/common/interfaces/module-content.model";

interface TemplateContentDataProps {
  data: ModuleContent;
  me: User;
  canModify: boolean;
}
export class TemplateContentData {
  data: ModuleContent;
  me: User;
  canModify: boolean;

  constructor({ data, me }: TemplateContentDataProps) {
    this.data = data;
    this.me = me;
  }

  onHideChanges: BehaviorSubject<boolean> = new BehaviorSubject(false);
  get hideChanges() {
    return this.onHideChanges.getValue();
  }

  set hideChanges(val: boolean) {
    this.onHideChanges.next(val);
  }
}
