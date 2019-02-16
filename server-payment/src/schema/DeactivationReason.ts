import { gql } from "apollo-server-core";

export const typeDef = gql`
  enum DeactivationReason {
    ERROR
    USER_REQUEST
  }
`;
