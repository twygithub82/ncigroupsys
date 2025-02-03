import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { CleaningCategoryItem } from './cleaning-category';
import { CleaningMethodItem } from './cleaning-method';
import { TankItem } from './tank';
import { CLEANING_CATEGORY_FRAGMENT, CLEANING_METHOD_FRAGMENT } from './fragments';
import { PageInfo } from '@core/models/pageInfo';
import { BaseDataSource } from './base-ds';
import { CustomerCompanyItem } from './customer-company';
import { TariffDepotItem } from './tariff-depot';
import { StoringOrderTankItem } from './storing-order-tank';
//import { ExclusiveSteamComponent } from 'app/admin/package/exclusive-steam/exclusive-steam.component';
import { Utility } from 'app/utilities/utility';

export class PackageDepotGO {
  public guid?: string;
  public profile_name?: string;
  public description?: string;
  public preinspection_cost?: number;
  public remarks?: string;
  public storage_cal_cv?: string;
  public lolo_cost?: number;
  public storage_cost?: number;
  public free_storage?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  public gate_in_cost?: number;
  public gate_out_cost?: number;


  constructor(item: Partial<PackageDepotGO> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    this.profile_name = item.profile_name;
    this.description = item.description;
    this.preinspection_cost = item.preinspection_cost;
    this.lolo_cost = item.lolo_cost;
    this.storage_cost = item.storage_cost;
    this.free_storage = item.free_storage;
    this.remarks = item.remarks;
    this.storage_cal_cv = item.storage_cal_cv;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
    this.gate_in_cost = item.gate_in_cost;
    this.gate_out_cost = item.gate_out_cost;

  }
}

export class PackageDepotItem extends PackageDepotGO {
  public tariff_depot?: TariffDepotItem;
  public customer_company?: CustomerCompanyItem;
  constructor(item: Partial<PackageDepotItem> = {}) {
    super(item);
    this.tariff_depot = item.tariff_depot;
    this.customer_company = item.customer_company;
  }
}

export interface TariffDepotResult {
  items: TariffDepotItem[];
  totalCount: number;
}

export const GET_PACKAGE_DEPOT_QUERY = gql`
  query queryPackageDepot($where: package_depotFilterInput, $order:[package_depotSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    packageDepotResult : queryPackageDepot(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        create_by
        create_dt
        customer_company_guid
        delete_dt
        free_storage
        guid
        lolo_cost
        preinspection_cost
        gate_in_cost
        gate_out_cost
        remarks
        storage_cal_cv
        storage_cost
        tariff_depot_guid
        update_by
        update_dt
        customer_company {
          city
          code
          country
          create_by
          create_dt
          delete_dt
          effective_dt
          email
          guid
          name
          phone
          postal
          type_cv
          update_by
          update_dt
        }
        tariff_depot {
          create_by
          create_dt
          delete_dt
          description
          free_storage
          guid
          lolo_cost
          preinspection_cost
          gate_in_cost
          gate_out_cost
          profile_name
          storage_cost
          update_by
          update_dt
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

export const GET_CUSTOMER_PACKAGE_DEPOT_QUERY = gql`
  query queryPackageDepot($where: package_depotFilterInput) {
    resultList : queryPackageDepot(where: $where) {
      nodes {
        create_by
        create_dt
        customer_company_guid
        delete_dt
        free_storage
        guid
        lolo_cost
        preinspection_cost
        gate_in_cost
        gate_out_cost
        remarks
        storage_cal_cv
        storage_cost
        tariff_depot_guid
        update_by
        update_dt
        tariff_depot {
          create_by
          create_dt
          delete_dt
          description
          free_storage
          guid
          lolo_cost
          preinspection_cost
          gate_in_cost
          gate_out_cost
          profile_name
          storage_cost
          update_by
          update_dt
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

export const UPDATE_PACKAGE_DEPOT = gql`
  mutation updatePackageDepot($pd: package_depotInput!) {
    updatePackageDepot(updatePackageDepot: $pd)
  }
`;

export const UPDATE_PACKAGE_DEPOTS = gql`
  mutation updatePackageDepots($guids: [String!]!,$free_storage:Int!,$lolo_cost:Float!,
  $preinspection_cost:Float!,$storage_cost:Float!,$gate_in_cost:Float!,$gate_out_cost:Float!,$remarks:String!,$storage_cal_cv:String!) {
    updatePackageDepots(updatePackageDepot_guids: $guids,free_storage:$free_storage,
    lolo_cost:$lolo_cost,preinspection_cost:$preinspection_cost,storage_cost:$storage_cost,gate_in_cost:$gate_in_cost,
    gate_out_cost:$gate_out_cost,remarks:$remarks,storage_cal_cv:$storage_cal_cv)
  }
`;

// export const UPDATE_TARIFF_CLEANING = gql`
//   mutation updateTariffClean($tc: tariff_cleaningInput!) {
//     updateTariffClean(updateTariffClean: $tc)
//   }
// `;


export class PackageDepotDS extends BaseDataSource<PackageDepotItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  SearchPackageDepot(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<PackageDepotItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_PACKAGE_DEPOT_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffDepotItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const packageDepotResult = result.packageDepotResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(packageDepotResult.nodes);
          this.pageInfo = packageDepotResult.pageInfo;
          this.totalCount = packageDepotResult.totalCount;
          return packageDepotResult.nodes;
        })
      );
  }

  getCustomerPackage(customer_company_guid: string, tariff_depot_guid: string): Observable<PackageDepotItem[]> {
    this.loadingSubject.next(true);
    const where = this.addDeleteDtCriteria({
      customer_company_guid: { eq: customer_company_guid },
      tariff_depot_guid: { eq: tariff_depot_guid }
    })
    return this.apollo
      .query<any>({
        query: GET_CUSTOMER_PACKAGE_DEPOT_QUERY,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const resultList = result?.data?.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.pageInfo = resultList.pageInfo;
          this.totalCount = resultList.totalCount;
          return resultList.nodes;
        }),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffDepotItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  updatePackageDepot(pd: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_PACKAGE_DEPOT,
      variables: {
        pd
      }
    });
  }

  updatePackageDepots(guids: any, free_storage: any, lolo_cost: any, preinspection_cost: any,
    storage_cost: any, gate_in_cost: any, gate_out_cost: any, remarks: any, storage_cal_cv: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_PACKAGE_DEPOTS,
      variables: {
        guids,
        free_storage,
        lolo_cost,
        preinspection_cost,
        storage_cost,
        gate_in_cost,
        gate_out_cost,
        remarks,
        storage_cal_cv
      }
    });
  }

  getStorageBeginDate(sotItem: StoringOrderTankItem, pdItem: PackageDepotItem): number | undefined {
    if (pdItem?.storage_cal_cv === 'TANK_IN_DATE') {
      return sotItem?.in_gate?.[0]?.eir_dt;
    } else if (pdItem?.storage_cal_cv === 'AFTER_CLEANING_DATE') {
      //return sotItem?.cleaning;
    } else if (pdItem?.storage_cal_cv === 'AFTER_AV_DATE') {

    } else if (pdItem?.storage_cal_cv === 'NO_STORAGE') {

    }
    return undefined;
  }

  getStorageDays(sotItem: StoringOrderTankItem, pdItem: PackageDepotItem, free_storage:number=0): number | undefined {


    sotItem.out_gate=sotItem.out_gate?.filter(outGate => outGate.delete_dt === 0 || outGate.delete_dt === null);  
    var currentDateOut:Date = new Date();
    
      
    if(sotItem?.out_gate?.[0]?.eir_dt)
    {
      const createDtOutSeconds = sotItem.out_gate[0].eir_dt;
      currentDateOut = new Date(createDtOutSeconds * 1000);
    }


    if (pdItem?.storage_cal_cv === 'TANK_IN_DATE') {
      sotItem.in_gate = sotItem.in_gate?.filter(inGate => inGate.delete_dt === 0 || inGate.delete_dt === null);
     

      if (sotItem?.in_gate?.[0]?.eir_dt) {
        const createDtInSeconds = sotItem.in_gate[0].eir_dt;
        const createDate = new Date(createDtInSeconds * 1000);


       /// const currentDateOut = new Date();


        const differenceInMs = currentDateOut.getTime() - createDate.getTime();

        const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24)) - free_storage;


        return differenceInDays;
      }
      else {
        return 0;
      }
    } else if (pdItem?.storage_cal_cv === 'AFTER_CLEANING_DATE') {
      sotItem.cleaning = sotItem.cleaning?.filter(clean => clean.delete_dt === 0 || clean.delete_dt === null);
      if (sotItem?.cleaning?.[0]?.complete_dt) {
        const createDtInSeconds = sotItem.cleaning[0].complete_dt;
        const createDate = new Date(createDtInSeconds * 1000);
       // const currentDate = new Date();

        const differenceInMs = currentDateOut.getTime() - createDate.getTime();

        const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24)) - free_storage;

        return differenceInDays;
      }
      else {
        return 0;
      }
      //return sotItem?.cleaning;
    } else if (pdItem?.storage_cal_cv === 'AFTER_AV_DATE') {
      if (sotItem?.repair) {
        sotItem.repair = sotItem.repair?.filter(repair => repair.delete_dt === 0 || repair.delete_dt === null);
        let qcCompletedList = sotItem?.repair?.[0]?.repair_part?.filter(rp =>
          rp.job_order?.status_cv === "QC_COMPLETED"
        );

        const latestCompleteDate = qcCompletedList
          ?.map(rp => new Date(rp.job_order?.complete_dt!)) // Extract and convert `complete_dt` to Date objects
          ?.reduce((latest, current) =>
            current > latest ? current : latest,
            new Date(0) // Start with epoch as the baseline
          );

        if (latestCompleteDate != new Date(0)) {
          const createDtInSeconds = Number(Utility.convertDate(latestCompleteDate));
          const createDate = new Date(createDtInSeconds * 1000);
         // const currentDate = new Date();

          const differenceInMs = currentDateOut.getTime() - createDate.getTime();

          const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24)) - free_storage;

          return differenceInDays;
        }
        else {
          return 0;
        }
      }
      else {
        return 0;
      }

    } else if (pdItem?.storage_cal_cv === 'NO_STORAGE') {
      return 0;
    }
    return undefined;
  }
}
