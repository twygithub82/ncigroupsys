import { ContactPersonItem } from "./contact-person";
import { CurrencyItem } from "./currency";
import { CustomerCompanyItem } from "./customer-company";


export class BillingGo {
    public guid?: string;
    public bill_to_guid?:string;
    public currency_guid?:string;
    public invoice_dt?:number;
    public invoice_no?:string;
    public invoice_due?:number;
    public remarks?:string;
    public status_cv?:string;
  
    public create_dt?: number;
    public create_by?: string;
    public update_dt?: number;
    public update_by?: string;
    public delete_dt?: number;
    
    constructor(item: Partial<BillingGo> = {}) {
      this.guid = item.guid;
      if (!this.guid) this.guid = '';
      
      this.bill_to_guid=item.bill_to_guid;
      this.currency_guid=item.currency_guid;
      this.invoice_dt= item.invoice_dt;
      this.invoice_no=item.invoice_no;
      this.invoice_due=item.invoice_due;
      this.status_cv=item.status_cv;

      this.remarks=item.remarks;
      this.create_dt = item.create_dt;
      this.create_by = item.create_by;
      this.update_dt = item.update_dt;
      this.update_by = item.update_by;
      this.delete_dt = item.delete_dt;
    }
  }

export class BillingItem extends BillingGo{
    
    public customer_company? : CustomerCompanyItem;
    public currency?: CurrencyItem;


    constructor(item: Partial<BillingItem> = {}) {
        super(item);
        this.customer_company=item.customer_company;
        this.currency=item.customer_company;
     }
}

