import { gql } from "apollo-server-core";

export const typeDef = gql`
  type KeyValue {
    key: String!
    value: String!
  }
`;
