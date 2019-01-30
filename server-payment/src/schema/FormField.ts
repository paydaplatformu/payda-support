import { gql } from "apollo-server-core";

export const typeDef = gql`
  type FormField {
    key: String!
    value: String!
  }
`;
