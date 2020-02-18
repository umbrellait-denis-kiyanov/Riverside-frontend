import { ReadableTimePipe } from "src/app/common/pipes/readabletime.pipe";

const timePipe = new ReadableTimePipe();

export const header = [
  {
    id: "moduleName",
    label: "Module"
  },
  {
    id: "orgName",
    label: "Sender"
  },
  {
    id: "sent_on",
    label: "Time",
    transform: (date: string) => timePipe.transform(date)
  }
];
