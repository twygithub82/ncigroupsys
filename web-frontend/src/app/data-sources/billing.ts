import { Apollo, gql } from "apollo-angular";
import { ContactPersonItem } from "./contact-person";
import { CurrencyItem } from "./currency";
import { CustomerCompanyItem } from "./customer-company";
import { BaseDataSource } from "./base-ds";
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { StringValueNode } from "graphql";
import { RepairItem } from "./repair";
import { InGateCleaningItem } from "./in-gate-cleaning";
import { ResidueItem } from "./residue";
import { SteamItem } from "./steam";
import { ApolloError } from "@apollo/client/errors";
import { StoringOrderItem } from "./storing-order";
import { StoringOrderTankItem } from "./storing-order-tank";
import { TariffDepotGO, TariffDepotItem } from "./tariff-depot";



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
    public repair_customer?:RepairItem[];
    public repair_owner?:RepairItem[];
    public residue?:ResidueItem[];
    public steaming?:SteamItem[];
    public cleaning?:InGateCleaningItem[];

    constructor(item: Partial<BillingItem> = {}) {
        super(item);
        this.customer_company=item.customer_company;
        this.currency=item.customer_company;
        this.residue=item.residue;
        this.steaming=item.steaming;
        this.cleaning=item.cleaning;
        this.repair_customer=item.repair_customer;
        this.repair_owner=item.repair_owner;
     }
}

export class BillingSOTGo{
  public free_storage?:number;
  public gate_in_cost?:number;
  public gate_out_cost?:number;
  public gateio_billing_guid?:string;
  public guid?:string;
  public lift_off?:boolean;
  public lift_off_cost?:number;
  public lift_on?:boolean;
  public lift_on_cost?:number;
  public lolo_billing_guid?:string;
  public preinsp_billing_guid?:string;
  public preinspection?:boolean;
  public preinspection_cost?:number;
  public remarks?:string;
  public sot_guid?:string;
  public storage_biling_guid?:string;
  public storage_cal_cv?:string;
  public storage_cost?:number;
  public tariff_depot_guid?:string;

  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<BillingSOTGo> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    
    this.free_storage=item.free_storage;
    this.gate_in_cost=item.gate_in_cost;
    this.gate_out_cost= item.gate_out_cost;
    this.gateio_billing_guid=item.gateio_billing_guid;
    this.lift_off=item.lift_off;
    this.lift_off_cost=item.lift_off_cost;

    this.lift_on=item.lift_on;
    this.lift_on_cost=item.lift_on_cost;
    this.lolo_billing_guid= item.lolo_billing_guid;
    this.preinsp_billing_guid=item.preinsp_billing_guid;
    this.preinspection=item.preinspection;
    this.preinspection_cost=item.preinspection_cost;
    this.sot_guid=item.sot_guid;
    this.storage_biling_guid=item.storage_biling_guid;
    this.storage_cal_cv=item.storage_cal_cv;
    this.storage_cost=item.storage_cost;
    this.tariff_depot_guid=item.tariff_depot_guid;
    this.remarks=item.remarks;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class BillingSOTItem extends BillingSOTGo{
    
  public gateio_billing?:BillingItem ;
  public lolo_billing?: BillingItem;
  public preinsp_billing?:BillingItem;
  public storage_billing?:BillingItem[];
  public storing_order_tank?:StoringOrderTankItem;
  public tariff_depot?:TariffDepotItem;
  

  constructor(item: Partial<BillingSOTItem> = {}) {
      super(item);
      this.gateio_billing=item.gateio_billing;
      this.lolo_billing=item.lolo_billing;
      this.preinsp_billing=item.preinsp_billing;
      this.storage_billing=item.storage_billing;
      this.storing_order_tank=item.storing_order_tank;
      this.tariff_depot=item.tariff_depot;
      
   }
}

export class BillingInputRequest {
  public bill_to_guid?: string;
  public currency_guid?: string;
  public guid?:string;
  public invoice_dt?: number;
  public invoice_due?: number;
  public invoice_no?:string;
  public remarks?:string;
  public status_cv?:string;

  //public aspnetsuser?: UserItem;

  constructor(item: Partial<BillingInputRequest> = {}) {

    this.guid = item.guid;
    this.currency_guid = item.currency_guid;
    this.bill_to_guid= item.bill_to_guid;
    // this.aspnetsuser = item.aspnetsuser;
    this.invoice_dt = item.invoice_dt;
    this.invoice_due=item.invoice_due;
    this.invoice_no=item.invoice_no;
    this.remarks=item.remarks;
    this.status_cv=item.status_cv;
  }
}

export class BillingEstimateRequest{
  public action?:string;
  public billing_party?:string;
  public process_guid?:string;
  public process_type?:string;
}


const SEARCH_BILLING_SOT_QUERY=gql`
 query queryBillingSOT($where: billing_sotFilterInput, $order: [billing_sotSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
     queryBillingSOT(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
       nodes {
        create_by
        create_dt
        delete_dt
        free_storage
        gate_in_cost
        gate_out_cost
        gateio_billing_guid
        guid
        lift_off
        lift_off_cost
        lift_on
        lift_on_cost
        lolo_billing_guid
        preinsp_billing_guid
        preinspection
        preinspection_cost
        remarks
        sot_guid
        storage_billing_guid
        storage_cal_cv
        storage_cost
        tariff_depot_guid
        update_by
        update_dt
         storing_order_tank {
          clean_status_cv
          create_by
          create_dt
          delete_dt
          estimate_cv
          eta_dt
          etr_dt
          guid
          job_no
          last_cargo_guid
          last_test_guid
          owner_guid
          remarks
          required_temp
          so_guid
          status_cv
          tank_no
          tank_status_cv
          unit_type_guid
          tariff_cleaning {
            guid
            open_on_gate_cv
            cargo
          }
          storing_order {
            customer_company {
              guid
              code
              name
            }
          }
          in_gate {
            eir_no
            eir_dt
            delete_dt
          }
          out_gate{
            guid
            out_gate_survey{
              guid
              create_dt
              delete_dt
            }
          }
        }
        preinsp_billing {
          bill_to_guid
          create_by
          create_dt
          currency_guid
          delete_dt
          guid
          invoice_dt
          invoice_due
          invoice_no
          remarks
          status_cv
          update_by
          update_dt
        }
        gateio_billing {
          bill_to_guid
          create_by
          create_dt
          currency_guid
          delete_dt
          guid
          invoice_dt
          invoice_due
          invoice_no
          remarks
          status_cv
          update_by
          update_dt
        }
        lolo_billing {
          bill_to_guid
          create_by
          create_dt
          currency_guid
          delete_dt
          guid
          invoice_dt
          invoice_due
          invoice_no
          remarks
          status_cv
          update_by
          update_dt
        }
        storage_billing {
          bill_to_guid
          create_by
          create_dt
          currency_guid
          delete_dt
          guid
          invoice_dt
          invoice_due
          invoice_no
          remarks
          status_cv
          update_by
          update_dt
        }
      }
    }
  }
`;

const SEARCH_BILLING_QUERY = gql`
  query queryBilling($where: billingFilterInput, $order: [billingSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
     queryBilling(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
       nodes {
         cleaning {
            customer_billing_guid
            delete_dt
            guid
            owner_billing_guid
          }
          repair_customer {
            customer_billing_guid
            delete_dt
            guid
            owner_billing_guid
          }
          repair_owner {
            customer_billing_guid
            delete_dt
            guid
            owner_billing_guid
          }
          residue {
            customer_billing_guid
            delete_dt
            guid
            owner_billing_guid
          }
          steaming {
            customer_billing_guid
            delete_dt
            guid
            owner_billing_guid
          }
        bill_to_guid
        delete_dt
        invoice_dt
        invoice_due
        invoice_no
        remarks
        status_cv
        currency{
          currency_code
          currency_name
          rate
          delete_dt
        }
        customer_company {
            code
            currency_guid
            def_tank_guid
            def_template_guid
            delete_dt
            effective_dt
            guid
            main_customer_guid
            name
            remarks
            type_cv
        }
      }
    }
  }
`;


const SEARCH_STEAM_BILLING_QUERY = gql`
  query queryBilling($where: billingFilterInput, $order: [billingSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
     queryBilling(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
       nodes {
          steaming {
            customer_billing_guid
            delete_dt
            guid
            owner_billing_guid
          }
        guid
        bill_to_guid
        delete_dt
        invoice_dt
        invoice_due
        invoice_no
        remarks
        status_cv
        currency_guid
        currency{
          currency_code
          currency_name
          rate
          delete_dt
        }
        customer_company {
            code
            currency_guid
            def_tank_guid
            def_template_guid
            delete_dt
            effective_dt
            guid
            main_customer_guid
            name
            remarks
            type_cv
        }
      }
    }
  }
`;

const SEARCH_RESIDUE_BILLING_QUERY = gql`
  query queryBilling($where: billingFilterInput, $order: [billingSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
     queryBilling(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
       nodes {
          residue {
            customer_billing_guid
            delete_dt
            guid
            owner_billing_guid
          }
        guid
        bill_to_guid
        delete_dt
        invoice_dt
        invoice_due
        invoice_no
        remarks
        status_cv
        currency_guid
        currency{
          currency_code
          currency_name
          rate
          delete_dt
        }
        customer_company {
            code
            currency_guid
            def_tank_guid
            def_template_guid
            delete_dt
            effective_dt
            guid
            main_customer_guid
            name
            remarks
            type_cv
        }
      }
    }
  }
`;
const SEARCH_REPAIR_BILLING_QUERY = gql`
  query queryBilling($where: billingFilterInput, $order: [billingSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
     queryBilling(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
       nodes {
          repair_customer {
            customer_billing_guid
            delete_dt
            guid
            owner_billing_guid
          }
          repair_owner {
            customer_billing_guid
            delete_dt
            guid
            owner_billing_guid
          }
        guid
        bill_to_guid
        delete_dt
        invoice_dt
        invoice_due
        invoice_no
        remarks
        status_cv
        currency_guid
        currency{
          currency_code
          currency_name
          rate
          delete_dt
        }
        customer_company {
            code
            currency_guid
            def_tank_guid
            def_template_guid
            delete_dt
            effective_dt
            guid
            main_customer_guid
            name
            remarks
            type_cv
        }
      }
    }
  }
`;

const SEARCH_CLEANING_BILLING_QUERY = gql`
  query queryBilling($where: billingFilterInput, $order: [billingSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
     queryBilling(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
       nodes {
         cleaning {
            customer_billing_guid
            delete_dt
            guid
            owner_billing_guid
          }
        guid
        bill_to_guid
        delete_dt
        invoice_dt
        invoice_due
        invoice_no
        remarks
        status_cv
        currency_guid
        currency{
          guid
          currency_code
          currency_name
          rate
          delete_dt
        }
        customer_company {
            code
            currency_guid
            def_tank_guid
            def_template_guid
            delete_dt
            effective_dt
            guid
            main_customer_guid
            name
            remarks
            type_cv
        }
      }
    }
  }
`;

export const ADD_BILLING = gql`
  mutation addBilling($newBilling: billingInput!,$billingEstimateRequests:[BillingEstimateRequestInput!]!) {
    addBilling(newBilling: $newBilling,billingEstimateRequests:$billingEstimateRequests)
  }
`;

export const UPDATE_BILLING = gql`
  mutation updateBilling($updateBilling: billingInput,$billingEstimateRequests:[BillingEstimateRequestInput!]!) {
    updateBilling(updateBilling: $updateBilling,billingEstimateRequests:$billingEstimateRequests)
  }
`;

export class BillingDS extends BaseDataSource<BillingItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  searchBillingSOT(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<BillingSOTItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: SEARCH_BILLING_SOT_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateCleaningItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const retResult = result.queryBillingSOT || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          this.pageInfo = retResult.pageInfo;
          return retResult.nodes;
        })
      );
  }

  searchRepairBilling(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<BillingItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: SEARCH_REPAIR_BILLING_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateCleaningItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const retResult = result.queryBilling || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          this.pageInfo = retResult.pageInfo;
          return retResult.nodes;
        })
      );
  }

  searchResidueBilling(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<BillingItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: SEARCH_RESIDUE_BILLING_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateCleaningItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const retResult = result.queryBilling || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          this.pageInfo = retResult.pageInfo;
          return retResult.nodes;
        })
      );
  }

  searchSteamingBilling(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<BillingItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: SEARCH_STEAM_BILLING_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateCleaningItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const retResult = result.queryBilling || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          this.pageInfo = retResult.pageInfo;
          return retResult.nodes;
        })
      );
  }
 
  searchCleaningBilling(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<BillingItem[]> {
      this.loadingSubject.next(true);
      return this.apollo
        .query<any>({
          query: SEARCH_CLEANING_BILLING_QUERY,
          variables: { where, order, first, after, last, before },
          fetchPolicy: 'no-cache' // Ensure fresh data
        })
        .pipe(
          map((result) => result.data),
          catchError((error: ApolloError) => {
            console.error('GraphQL Error:', error);
            return of([] as InGateCleaningItem[]); // Return an empty array on error
          }),
          finalize(() => this.loadingSubject.next(false)),
          map((result) => {
            const retResult = result.queryBilling || { nodes: [], totalCount: 0 };
            this.dataSubject.next(retResult.nodes);
            this.totalCount = retResult.totalCount;
            this.pageInfo = retResult.pageInfo;
            return retResult.nodes;
          })
        );
    }

  searchAllBilling(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<BillingItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: SEARCH_BILLING_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateCleaningItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const retResult = result.queryBilling || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          this.pageInfo = retResult.pageInfo;
          return retResult.nodes;
        })
      );
  }


  addBilling(newBilling: any,billingEstimateRequests:any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_BILLING,
      variables: {
        newBilling,
        billingEstimateRequests
      }
    });
  }

  updateBilling(updateBilling: any,billingEstimateRequests:any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_BILLING,
      variables: {
        updateBilling,
        billingEstimateRequests
      }
    });
  }
}
