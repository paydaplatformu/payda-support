import { gql } from "apollo-server-core";

export const typeDef = gql`
  enum LanguageCode {
    TR
    EN
  }
`;
