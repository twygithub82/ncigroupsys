import gql from 'graphql-tag';

export const CLEANING_METHOD_FRAGMENT = gql`
  fragment CleaningMethodFragment on storing_order_CleaningMethodWithTariff {
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
  fragment CleaningCategoryFragment on storing_order_CleaningCategoryWithTariff {
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