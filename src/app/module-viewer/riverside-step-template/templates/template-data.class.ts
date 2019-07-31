import { BehaviorSubject } from 'rxjs';
import { TemplateContentDataType } from './template.interface';
import User from 'src/app/common/interfaces/user.model';


interface TemplateContentDataProps {
  data: TemplateContentDataType;
  me: User;
}
export class TemplateContentData {
  data: TemplateContentDataType;
  me: User;

  constructor({data, me}: TemplateContentDataProps) {
    this.data = data;
    this.me = me;
  }

  onHideChanges: BehaviorSubject<boolean> = new BehaviorSubject(true);
  get hideChanges() {
    return this.onHideChanges.getValue();
  }

  set hideChanges(val: boolean) {
    this.onHideChanges.next(val);
  }

}
