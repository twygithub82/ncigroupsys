import { StoringOrderTankItem } from "./storing-order-tank";

export class report_customer_tank_activity{
  guid?:string;
  code?:string;
  customer?:string;
  number_tank?:number=0;
  storing_order_tank?:StoringOrderTankItem[];

  constructor(item: Partial<report_customer_tank_activity> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    
    this.customer=item.customer;
    this.code=item.code;
    this.number_tank=item.number_tank;
    this.storing_order_tank=item.storing_order_tank;
  }
}

export class report_status{
  guid?:string;
  code?:string;
  customer?:string;
  number_tank?:number=0;
  yards?:report_status_yard[];
  constructor(item: Partial<report_status> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    
    this.customer=item.customer;
    this.code=item.code;
    this.number_tank=item.number_tank;
    this.yards=item.yards;
  }
}

export class report_status_yard{
    code?:string;
    noTank_repair?:number=0;
    noTank_clean?:number=0;
    noTank_storage?:number=0;
    noTank_steam?:number=0;
    noTank_offhire?:number=0;
    storing_order_tank?:StoringOrderTankItem[];

    constructor(item: Partial<report_status_yard> = {}) {
      this.code = item.code;
      if (!this.code) this.code = '';
      
      this.noTank_repair=item.noTank_repair;
      this.noTank_clean=item.noTank_clean;
      this.noTank_storage=item.noTank_storage;
      this.noTank_steam=item.noTank_steam;
      this.storing_order_tank=item.storing_order_tank;
    }


}