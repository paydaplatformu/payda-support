import { gql } from "apollo-server-core";

export const SchemaDefinition = gql`
  schema {
    query: Query
    mutation: Mutation
  }
`;
