import { gql } from "apollo-server-core";

export const typeDef = gql`
  input PackageRecurrenceConfigInput {
    repeatInterval: RepeatInterval!
    count: Int!
  }

  type PackageRecurrenceConfig {
    repeatInterval: RepeatInterval!
    count: Int!
  }
`;
