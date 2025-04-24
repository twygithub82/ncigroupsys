import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankItem } from './storing-order-tank';

export class SurveyDetailGO {
  public guid?: string;
  public sot_guid?: string;
  public status_cv?: string;
  public survey_type_cv?: string;
  public survey_dt?: number;
  public remarks?: string;
  public test_type_cv?: string;
  public test_class_cv?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<SurveyDetailGO> = {}) {
    this.guid = item.guid;
    this.sot_guid = item.sot_guid;
    this.status_cv = item.status_cv;
    this.survey_type_cv = item.survey_type_cv;
    this.survey_dt = item.survey_dt;
    this.remarks = item.remarks;
    this.test_type_cv = item.test_type_cv;
    this.test_class_cv = item.test_class_cv;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class SurveyDetailItem extends SurveyDetailGO {
  public storing_order_tank?: StoringOrderTankItem

  constructor(item: Partial<SurveyDetailItem> = {}) {
    super(item)
    this.storing_order_tank = item.storing_order_tank || undefined;
  }
}

const GET_SURVEY_DETAIL = gql`
  query querySurveyDetail($where: survey_detailFilterInput, $order: [survey_detailSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: querySurveyDetail(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
      nodes {
        create_by
        create_dt
        delete_dt
        guid
        remarks
        sot_guid
        status_cv
        survey_dt
        survey_type_cv
        test_type_cv
        test_class_cv
        update_by
        update_dt
      }
    }
  }
`;

const GET_SURVEY_DETAIL_FOR_MOVEMENT = gql`
  query querySurveyDetail($where: survey_detailFilterInput, $order: [survey_detailSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: querySurveyDetail(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
      nodes {
        create_by
        create_dt
        delete_dt
        guid
        remarks
        sot_guid
        status_cv
        survey_dt
        survey_type_cv
        test_type_cv
        test_class_cv
        update_by
        update_dt
      }
    }
  }
`;

export const GET_SURVEY_DETAIL_BY_TANK_NO = gql`
  query querySurveyDetailByTankNo($tankNo: String!, $rowCount: Int!){
    resultList: querySurveyDetailByTankNo(tankNo: $tankNo, rowCount: $rowCount) {
      delete_dt
      guid
      remarks
      sot_guid
      status_cv
      survey_dt
      survey_type_cv
      test_class_cv
      test_type_cv
      update_by
      update_dt
      create_by
      create_dt
    }
  }
`

export const ADD_SURVEY = gql`
  mutation addSurveyDetail($surveyDetail: survey_detailInput!, $periodicTest: PeriodicTestRequestInput) {
    addSurveyDetail(surveyDetail: $surveyDetail, periodicTest: $periodicTest)
  }
`;

export const UPDATE_SURVEY = gql`
  mutation updateSurveyDetail($surveyDetail: survey_detailInput!, $periodicTest: PeriodicTestRequestInput) {
    updateSurveyDetail(surveyDetail: $surveyDetail, periodicTest: $periodicTest)
  }
`;

export const DELETE_SURVEY = gql`
  mutation deleteSurveyDetail($deletedGuid: String!, $surveyDetail: survey_detailInput!, $periodicTest: PeriodicTestRequestInput) {
    deleteSurveyDetail(deletedGuid: $deletedGuid, surveyDetail: $surveyDetail, periodicTest: $periodicTest)
  }
`;

export class SurveyDetailDS extends BaseDataSource<SurveyDetailItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  searchSurveyDetail(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<SurveyDetailItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_SURVEY_DETAIL,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const resultList = result.data?.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        }),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  searchSurveyDetailForMovement(sot_guid: any): Observable<SurveyDetailItem[]> {
    this.loadingSubject.next(true);
    const where = {
      sot_guid: { eq: sot_guid }
    }
    const order = {
      survey_dt: "DESC"
    }

    return this.apollo
      .query<any>({
        query: GET_SURVEY_DETAIL_FOR_MOVEMENT,
        variables: { where, order },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const resultList = result.data?.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        }),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getSurveyDetailByTankNo(tankNo: string): Observable<SurveyDetailItem[]> {
    this.loadingSubject.next(true);
    const rowCount = 2;
    return this.apollo
      .query<any>({
        query: GET_SURVEY_DETAIL_BY_TANK_NO,
        variables: { tankNo, rowCount },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const resultList = result.data?.resultList || [];
          return resultList;
        }),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  addSurveyDetail(surveyDetail: any, periodicTest?: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_SURVEY,
      variables: {
        surveyDetail, periodicTest
      }
    });
  }

  updateSurveyDetail(surveyDetail: any, periodicTest?: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_SURVEY,
      variables: {
        surveyDetail, periodicTest
      }
    });
  }

  deleteSurveyDetail(deletedGuid: string, surveyDetail: any, periodicTest?: any): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_SURVEY,
      variables: {
        deletedGuid, surveyDetail, periodicTest
      }
    });
  }

  canDelete(surveyDetail: any) {
    return true;
  }
}
