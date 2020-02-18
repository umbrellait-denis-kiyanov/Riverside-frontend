export interface RecorderMessageEvent {
  data: {
    type: 'iframe_event';
    data: {
      type: 'DONE';
      data: {
        sourceId: string;
        url: string;
      };
    };
  };
}
