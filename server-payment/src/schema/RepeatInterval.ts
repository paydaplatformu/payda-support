import { gql } from "apollo-server-core";

export const typeDef = gql`
  enum RepeatInterval {
    NONE
    MONTHLY
    YEARLY
    TEST_A
    TEST_B
  }
`;
