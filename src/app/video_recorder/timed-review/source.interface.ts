import { Prompt } from "./prompt.interface";

export interface Source {
  postName: string;
  userid: string;
  pageid: string;
  classid: string;
  timeStarted: string;
  prompts: Array<Prompt>;
}
