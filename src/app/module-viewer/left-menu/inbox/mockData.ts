import * as moment from 'moment';

export const messages = [
  {
    time: moment(1561939200000).format('MM/DD/YYYY HH:mm:ss'),
    timeSinceEpoch: 1561939200000,
    moduleName: 'Buyer Personas',
    moduleId: 1,
    sender: 'MD Team2',
    link: ['/inbox', '1'],
    message: '<p>oi</p>',
    subject: 'Subject test',
    id: 1
  },
  {
    time: moment(1561939200000).format('MM/DD/YYYY HH:mm:ss'),
    timeSinceEpoch: 1561939200000,
    moduleName: 'Buyer Personas',
    moduleId: 1,
    sender: 'MD Team'
  }
  ,
  {
    time: moment(1561939200000).format('MM/DD/YYYY HH:mm:ss'),
    timeSinceEpoch: 1561939200000,
    moduleName: 'Buyer Personas',
    moduleId: 1,
    sender: 'MD Team3'
  }
];
export const header = [

  {
    id: 'moduleName',
    label: 'Module',
  },
  {
    id: 'orgName',
    label: 'Sender'
  },
  {
    id: 'sent_on',
    label: 'Time',
    transform: (date) => moment(date).format('MMM DD YYYY hh:mm:ss A')
  }
];
