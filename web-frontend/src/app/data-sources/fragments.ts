import gql from 'graphql-tag';

export const CLEANING_METHOD_FRAGMENT = gql`
  fragment CleaningMethodFragment on CleaningMethodWithTariff {
        create_by
        create_dt
        delete_dt
        description
        guid
        name
        update_by
        update_dt
  }
`;


export const CLEANING_CATEGORY_FRAGMENT = gql`
  fragment CleaningCategoryFragment on CleaningCategoryWithTariff {
        cost
        create_by
        create_dt
        delete_dt
        description
        guid
        name
        update_by
        update_dt
  }
`;