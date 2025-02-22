import { StoringOrderTankItem } from "./storing-order-tank";

export class report_customer_inventory{
  guid?:string;
  code?:string;
  customer?:string;
  tank_no_in_gate?:number=0;
  tank_no_out_gate?:number=0;
  tank_no_in_yard?:number=0;
  tank_no_pending?:number=0;
  tank_no_ro?:number=0;
  tank_no_total?:number=0;
  in_yard_storing_order_tank?:StoringOrderTankItem[];
  released_storing_order_tank?:StoringOrderTankItem[];

  constructor(item: Partial<report_customer_inventory> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    
    this.customer=item.customer;
    this.code=item.code;
    this.tank_no_in_gate=Number(item.tank_no_in_gate||0);
    this.tank_no_out_gate=Number(item.tank_no_out_gate||0);
    this.tank_no_in_yard=Number(item.tank_no_in_yard||0);
    this.tank_no_pending=Number(item.tank_no_pending||0);
    this.tank_no_ro=Number(item.tank_no_ro||0);
    this.tank_no_total=Number(item.tank_no_total||0);
    this.in_yard_storing_order_tank=item.in_yard_storing_order_tank;
    this.released_storing_order_tank=item.released_storing_order_tank;
  }
}

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

export class report_inventory_yard{
  code?:string;
  open_balance?:number=0;
  close_balance?:number=0;
  in_gate?:number=0;
  out_gate?:number=0;
  transfer_in?:number=0;
  transfer_out?:number=0;
  
  constructor(item: Partial<report_inventory_yard> = {}) {
    this.code = item.code;
    if (!this.code) this.code = '';
    this.code =item.code;
    this.open_balance=Number(item.open_balance||0);
    this.close_balance=Number(item.close_balance||0);
    this.in_gate=Number(item.in_gate||0);
    this.out_gate=Number(item.out_gate||0);
    this.transfer_in=Number(item.transfer_in||0);
    this.transfer_out=Number(item.transfer_out||0);
  }
}
export class report_status_yard{
    code?:string;
    noTank_repair?:number=0;
    noTank_clean?:number=0;
    noTank_storage?:number=0;
    noTank_steam?:number=0;
    noTank_in_survey?:number=0;
    storing_order_tank?:StoringOrderTankItem[];

    constructor(item: Partial<report_status_yard> = {}) {
      this.code = item.code;
      if (!this.code) this.code = '';
      
      this.noTank_repair=Number(item.noTank_repair||0);
      this.noTank_clean=Number(item.noTank_clean||0);
      this.noTank_storage=Number(item.noTank_storage||0);
      this.noTank_steam=Number(item.noTank_steam||0);
      this.storing_order_tank=item.storing_order_tank;
      this.noTank_in_survey=Number(item.noTank_in_survey||0);
    }


}