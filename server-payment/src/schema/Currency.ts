import { gql } from "apollo-server-core";

export const typeDef = gql`
  enum Currency {
    USD
    TRY
  }
`;
