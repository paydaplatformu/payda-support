import { gql } from "apollo-server-core";

export const typeDef = gql`
  enum RepeatConfig {
    NONE
    MONTHLY
    YEARLY
  }
`;
