import { gql } from "apollo-server-core";
import GraphQLJSON from "graphql-type-json";

export const typeDef = gql`
  scalar JSON
`;

export const resolver = GraphQLJSON;
