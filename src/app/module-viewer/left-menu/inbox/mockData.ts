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
    transform: (date: string) => window.moment(date).format('MMM DD YYYY hh:mm:ss A')
  }
];