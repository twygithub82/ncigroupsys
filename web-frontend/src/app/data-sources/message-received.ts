export class messageReceived {
    event_id: string;
    event_name: string;
    event_dt :number;
    count:number;
    
  
    constructor(data: any) {
      this.event_id = data.event_id;
      this.event_name = data.event_name;
      this.event_dt=data.event_dt;
      this.count=data.count;
    }
  }