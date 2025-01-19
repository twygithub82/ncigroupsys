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
  public guid?:string;
  public billing_party?:string;
  public process_guid?:string;
  public process_type?:string;
}


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
  mutation updateBilling($updateBilling: billingInput!,$billingEstimateRequests:[BillingEstimateRequestInput!]!) {
    updateBilling(updateBilling: $updateBilling,billingEstimateRequests:$billingEstimateRequests)
  }
`;

export class BillingDS extends BaseDataSource<BillingItem> {
  constructor(private apollo: Apollo) {
    super();
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

