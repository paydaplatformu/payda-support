import { gql } from "apollo-server-core";

export const typeDef = gql`
  input PackageTagInput {
    code: LanguageCode!
    name: String!
    description: String
  }

  type PackageTag {
    code: LanguageCode!
    name: String!
    description: String
  }
`;
