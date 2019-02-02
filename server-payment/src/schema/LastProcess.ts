import { gql } from "apollo-server-core";

export const typeDef = gql`
  type LastProcess {
    date: Date!
    result: JSON
    isSuccess: Boolean!
  }
`;
