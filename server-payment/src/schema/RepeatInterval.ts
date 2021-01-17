import { gql } from "apollo-server-core";

export const typeDef = gql`
  enum RepeatInterval {
    NONE
    DAILY
    WEEKLY
    MONTHLY
    YEARLY
  }
`;
