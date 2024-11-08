import { gql } from "@apollo/client";

export const GET_CLOUD_RESOURCES = gql`
  query GetCloudResources($filter: String, $type: String, $status: String) {
    cloudResources(filter: $filter, type: $type, status: $status) {
      id
      name
      type
      status
    }
  }
`;

export const RESOURCE_UPDATED = gql`
  subscription ResourceUpdated {
    resourceUpdated {
      id
      name
      type
      status
    }
  }
`;
