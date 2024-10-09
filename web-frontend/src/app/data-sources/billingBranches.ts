import { ContactPersonItem } from "./contact-person";
import { CustomerCompanyItem } from "./customer-company";


export class BillingCustomerItem extends CustomerCompanyItem{
    
    public action:string='';

    constructor(item: Partial<CustomerCompanyItem> = {}) {
        super(item);
        
     }
}

export class BillingContactPersonItem extends ContactPersonItem{
    
    public action:string='';

    constructor(item: Partial<ContactPersonItem> = {}) {
        super(item);
        
     }
}

export class BillingBranchesItem {

    public branchContactPerson?: BillingContactPersonItem[];
    public branchCustomer?: BillingCustomerItem;

    constructor(item: Partial<BillingBranchesItem> = {}) {
       this.branchContactPerson=item.branchContactPerson;
       this.branchCustomer=item.branchCustomer;
    }
}