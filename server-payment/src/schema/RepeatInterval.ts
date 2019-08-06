import { gql } from "apollo-server-core";
import { isNonProduction } from "../utilities/helpers";

const getRepeatInterval = () => {
  if (isNonProduction()) {
    return gql`
      enum RepeatInterval {
        NONE
        MONTHLY
        YEARLY
        TEST_A
        TEST_B
      }
    `;
  }
  return gql`
    enum RepeatInterval {
      NONE
      MONTHLY
      YEARLY
    }
  `;
};

export const typeDef = getRepeatInterval();
