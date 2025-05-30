import { ApolloError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { ContactPersonItem } from './contact-person';
import { CurrencyItem } from './currency';
import { StoringOrderItem } from './storing-order';
import { StoringOrderTankItem } from './storing-order-tank';

export class CustomerCompanyGO {
  public guid?: string;
  public name?: string;
  public code?: string;
  public tariff_depot_guid?: string;
  public address_line1?: string;
  public address_line2?: string;
  public city?: string;
  public country?: string;
  public postal?: string;
  public country_code?: string;
  public phone?: string;
  public email?: string;
  public website?: string;
  public effective_dt?: number;
  public agreement_due_dt?: number;
  public def_template_guid?: string;
  public def_tank_guid?: string;
  public type_cv?: string;
  public remarks?: string;
  public currency_guid?: string;
  public main_customer_guid?: string;

  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<CustomerCompanyGO> = {}) {
    this.guid = item.guid;
    this.name = item.name;
    this.code = item.code;
    this.tariff_depot_guid = item.tariff_depot_guid;
    this.address_line1 = item.address_line1;
    this.address_line2 = item.address_line2;
    this.city = item.city;
    this.country = item.country;
    this.postal = item.postal;
    this.country_code = item.country_code;
    this.phone = item.phone;
    this.email = item.email;
    this.website = item.website;
    this.effective_dt = item.effective_dt;
    this.agreement_due_dt = item.agreement_due_dt;
    this.def_template_guid = item.def_template_guid;
    this.def_tank_guid = item.def_tank_guid;
    this.type_cv = item.type_cv;
    this.remarks = item.remarks;
    this.currency_guid = item.currency_guid;
    this.main_customer_guid = item.main_customer_guid;
    //this.billing_branch = item.billing_branch;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class CustomerCompanyItem extends CustomerCompanyGO {
  public currency?: CurrencyItem;
  public cc_contact_person?: ContactPersonItem[] = [];
  public storing_order_tank?: StoringOrderTankItem[] = [];
  public storing_orders?: StoringOrderItem[] = [];
  constructor(item: Partial<CustomerCompanyItem> = {}) {
    super(item);
    this.currency = item.currency;
    this.cc_contact_person = item.cc_contact_person;
    this.storing_order_tank = item.storing_order_tank;
    this.storing_orders = item.storing_orders;
  }
}

export interface CustomerCompanyResult {
  items: CustomerCompanyItem[];
  totalCount: number;
}

export const UPDATE_CUSTOMER_COMPANY = gql`
  mutation updateCustomerCompany($customer: CustomerRequestInput!,$contactPersons:[customer_company_contact_personInput],$billingBranches:[BillingBranchRequestInput]) {
    updateCustomerCompany(customer: $customer,contactPersons:$contactPersons,billingBranches:$billingBranches)
  }
`

export const DELETE_CUSTOMER_COMPANY = gql`
  mutation deleteCustomerCompany($customerGuids: [String!]!) {
    deleteCustomerCompany(customerGuids: $customerGuids)
  }
`

export const ADD_CUSTOMER_COMPANY = gql`
    mutation addCustomerCompany($customer: CustomerRequestInput!,$contactPersons:[customer_company_contact_personInput],$billingBranches:[BillingBranchRequestInput]) {
    addCustomerCompany(customer: $customer,contactPersons:$contactPersons,billingBranches:$billingBranches)
  }
`

export const GET_COMPANY_QUERY = gql`
  query queryCustomerCompany($where: customer_companyFilterInput, $order: [customer_companySortInput!],$first: Int) {
    companyList: queryCustomerCompany(where: $where, order: $order,first: $first) {
      nodes {
        code
        name
        guid
      }
    }
  }
`;

export const SEARCH_COMPANY_QUERY = gql`
  query queryCustomerCompany($where: customer_companyFilterInput, $order: [customer_companySortInput!],$first: Int, $after: String, $last: Int, $before: String ) {
    companyList: queryCustomerCompany(where: $where, order: $order,first: $first, after: $after, last: $last, before: $before) {
      nodes {
        address_line1
        address_line2
        agreement_due_dt
        city
        code
        country
        create_by
        create_dt
        delete_dt
        effective_dt
        def_tank_guid
        email
        guid
        name
        country_code
        phone
        postal
        type_cv
        update_by
        update_dt
        website
        main_customer_guid
        remarks
        cc_contact_person {
          create_by
          create_dt
          customer_guid
          delete_dt
          department
          did
          email
          email_alert
          guid
          job_title
          name
          phone
          title_cv
          update_by
          update_dt
        }
        currency_guid
        currency {
          create_by
          create_dt
          currency_code
          currency_name
          delete_dt
          guid
          is_active
          rate
          sequence
          update_by
          update_dt
        }
        tank {
          guid
          unit_type
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

export const SEARCH_COMPANY_QUERY_WITH_SO_SOT = gql`
  query queryCustomerCompany($where: customer_companyFilterInput, $order: [customer_companySortInput!],$first: Int, $after: String, $last: Int, $before: String ) {
    companyList: queryCustomerCompany(where: $where, order: $order,first: $first, after: $after, last: $last, before: $before) {
      nodes {
        address_line1
        address_line2
        agreement_due_dt
        city
        code
        country
        create_by
        create_dt
        delete_dt
        effective_dt
        def_tank_guid
        email
        guid
        name
        country_code
        phone
        postal
        type_cv
        update_by
        update_dt
        website
        main_customer_guid
        remarks
        cc_contact_person {
          create_by
          create_dt
          customer_guid
          delete_dt
          department
          did
          email
          email_alert
          guid
          job_title
          name
          phone
          title_cv
          update_by
          update_dt
        }
        currency_guid
        currency {
          create_by
          create_dt
          currency_code
          currency_name
          delete_dt
          guid
          is_active
          rate
          sequence
          update_by
          update_dt
        }
        storing_orders{
          guid
          so_no
        }
        storing_order_tank{
          guid
          tank_no
        }
        tank {
          guid
          unit_type
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

export const SEARCH_CUSTOMER_COMPANY_WITH_COUNT = gql`
  query queryCustomerCompanyWithCount($where: CustomerCompanyResultFilterInput, $order: [CustomerCompanyResultSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    companyList: queryCustomerCompanyWithCount(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        customer_company {
          address_line1
          address_line2
          agreement_due_dt
          city
          code
          country
          create_by
          create_dt
          delete_dt
          effective_dt
          def_tank_guid
          email
          guid
          name
          country_code
          phone
          postal
          type_cv
          update_by
          update_dt
          website
          main_customer_guid
          remarks
          cc_contact_person {
            create_by
            create_dt
            customer_guid
            delete_dt
            department
            did
            email
            email_alert
            guid
            job_title
            name
            phone
            title_cv
            update_by
            update_dt
          }
          currency_guid
          currency {
            create_by
            create_dt
            currency_code
            currency_name
            delete_dt
            guid
            is_active
            rate
            sequence
            update_by
            update_dt
          }
          storing_orders{
            guid
            so_no
          }
          storing_order_tank{
            guid
            tank_no
          }
          tank {
            guid
            unit_type
          }
        }
        so_count
        sot_count
        tank_info_count
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

export const GET_COMPANY_AND_BRANCH = gql`
  query queryCustomerCompany($where: customer_companyFilterInput, $order: [customer_companySortInput!]) {
    resultList: queryCustomerCompany(where: $where, order: $order) {
      nodes {
        guid
        code
        name
        type_cv
      }
    }
  }
`

export const CAN_DELETE_COMPANY = gql`
  query queryCanDeleteCustomer($guid: String!) {
    value: queryCanDeleteCustomer(guid: $guid) 
  }
`

export class CustomerCompanyDS extends BaseDataSource<CustomerCompanyItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  loadItems(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<CustomerCompanyItem[]> {
    this.loadingSubject.next(true);
    where = { ...where, type_cv: { in: [...(where?.type_cv?.in || []), "BRANCH", "OWNER"] } };
    where = this.addDeleteDtCriteria(where)
    return this.apollo
      .query<any>({
        query: SEARCH_COMPANY_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CustomerCompanyItem[]); // Return an empty array on error
        }),
        finalize(() =>
          this.loadingSubject.next(false)
        ),
        map((result) => {
          const list = result.companyList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(list.nodes);

          this.totalCount = list.totalCount;
          return list.nodes;
        })
      );
  }

  getOwnerLessee(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<CustomerCompanyItem[]> {
    this.loadingSubject.next(true);
    where = { ...where, type_cv: { in: [...(where?.type_cv?.in || []), "LEESSEE", "OWNER", "BRANCH"] } };
    where = this.addDeleteDtCriteria(where)
    return this.apollo
      .query<any>({
        query: SEARCH_COMPANY_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CustomerCompanyItem[]); // Return an empty array on error
        }),
        finalize(() =>
          this.loadingSubject.next(false)
        ),
        map((result) => {
          const list = result.companyList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(list.nodes);

          this.totalCount = list.totalCount;
          return list.nodes;
        })
      );
  }

  getOwnerList(owner_guid?: string): Observable<CustomerCompanyItem[]> {
    this.loadingSubject.next(true);
    const where = {
      guid: { eq: owner_guid },
      type_cv: { in: ["OWNER"] }
    }
    const order = {

    }
    return this.apollo
      .query<any>({
        query: GET_COMPANY_QUERY,
        variables: { where, order },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CustomerCompanyItem[]); // Return an empty array on error
        }),
        finalize(() =>
          this.loadingSubject.next(false)
        ),
        map((result) => {
          const list = result.companyList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(list.nodes);

          this.totalCount = list.totalCount;
          return list.nodes;
        })
      );
  }

  search(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<CustomerCompanyItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: SEARCH_COMPANY_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CustomerCompanyItem[]); // Return an empty array on error
        }),
        finalize(() =>
          this.loadingSubject.next(false)
        ),
        map((result) => {
          const list = result.companyList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(list.nodes);
          this.pageInfo = list.pageInfo;
          this.totalCount = list.totalCount;
          return list.nodes;
        })
      );
  }

  searchWithSOT(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<CustomerCompanyItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: SEARCH_COMPANY_QUERY_WITH_SO_SOT,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CustomerCompanyItem[]); // Return an empty array on error
        }),
        finalize(() =>
          this.loadingSubject.next(false)
        ),
        map((result) => {
          const list = result.companyList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(list.nodes);
          this.pageInfo = list.pageInfo;
          this.totalCount = list.totalCount;
          return list.nodes;
        })
      );
  }

  searchCustomerCompanyWithCount(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<CustomerCompanyItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: SEARCH_CUSTOMER_COMPANY_WITH_COUNT,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CustomerCompanyItem[]); // Return an empty array on error
        }),
        finalize(() =>
          this.loadingSubject.next(false)
        ),
        map((result) => {
          const list = result.companyList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(list.nodes);
          this.pageInfo = list.pageInfo;
          this.totalCount = list.totalCount;
          return list.nodes;
        })
      );
  }

  getCustomerAndBranch(guid: string) {
    this.loadingSubject.next(true);
    const where = {
      or: [
        { guid: { eq: guid } },
        { main_customer_guid: { eq: guid } }
      ]
    }
    const order = {

    }
    return this.apollo
      .query<any>({
        query: GET_COMPANY_AND_BRANCH,
        variables: { where, order },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CustomerCompanyItem[]); // Return an empty array on error
        }),
        finalize(() =>
          this.loadingSubject.next(false)
        ),
        map((result) => {
          const list = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(list.nodes);
          this.pageInfo = list.pageInfo;
          this.totalCount = list.totalCount;
          return list.nodes;
        })
      );
  }

  getCustomerBranch(guid: string) {
    this.loadingSubject.next(true);
    const where = {
      or: [
        { main_customer_guid: { eq: guid } }
      ]
    }
    const order = {

    }
    return this.apollo
      .query<any>({
        query: GET_COMPANY_AND_BRANCH,
        variables: { where, order },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CustomerCompanyItem[]); // Return an empty array on error
        }),
        finalize(() =>
          this.loadingSubject.next(false)
        ),
        map((result) => {
          const list = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(list.nodes);
          this.pageInfo = list.pageInfo;
          this.totalCount = list.totalCount;
          return list.nodes;
        })
      );
  }

  getSurveyorList(where?: any, order?: any) {
    this.loadingSubject.next(true);
    where.type_cv = { in: ["SURVEYOR"] }
    where = this.addDeleteDtCriteria(where)
    return this.apollo
      .query<any>({
        query: GET_COMPANY_QUERY,
        variables: { where, order },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CustomerCompanyItem[]); // Return an empty array on error
        }),
        finalize(() =>
          this.loadingSubject.next(false)
        ),
        map((result) => {
          const list = result.companyList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(list.nodes);
          this.pageInfo = list.pageInfo;
          this.totalCount = list.totalCount;
          return list.nodes;
        })
      );
  }

  displayName(cc?: CustomerCompanyItem): string {
    return cc?.code ? (cc?.name ? `${cc.code} (${cc.name})` : `${cc.code}`) : '';
  }

  displayCodeDashName(cc?: CustomerCompanyItem): string {
    return cc?.code ? (cc?.name ? `${cc.code} - ${cc.name}` : `${cc.code}`) : '';
  }

  AddCustomerCompany(customer: any, contactPersons: any, billingBranches: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_CUSTOMER_COMPANY,
      variables: {
        customer,
        contactPersons,
        billingBranches
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  UpdateCustomerCompany(customer: any, contactPersons: any, billingBranches: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_CUSTOMER_COMPANY,
      variables: {
        customer,
        contactPersons,
        billingBranches
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  DeleteCustomerCompany(customerGuids: any): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_CUSTOMER_COMPANY,
      variables: {
        customerGuids
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  CanDeleteCustomerCompany(guid: any): Observable<any> {
    return this.apollo
      .query<any>({
        query: CAN_DELETE_COMPANY,
        variables: { guid },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of(false); // Return an empty array on error
        }),
        finalize(() =>
          this.loadingSubject.next(false)
        ),
        map((result) => {
          return result;
        })
      );
  }
}
