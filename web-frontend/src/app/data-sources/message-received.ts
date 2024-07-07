export class messageReceived {
    event_id: string;
    event_name: string;
    
  
    constructor(data: any) {
      this.event_id = data.event_id;
      this.event_name = data.event_name;
    }
  }