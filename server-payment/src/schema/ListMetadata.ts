import { gql } from "apollo-server-core";

export const typeDef = gql`
  type ListMetadata {
    count: Int!
  }
`;
