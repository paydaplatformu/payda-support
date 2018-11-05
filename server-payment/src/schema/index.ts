import { gql, IResolvers } from "apollo-server-express";
import { merge } from "lodash";
import { IContext } from "./context";
import { resolvers as packageResolvers, typeDef as Package } from "./Package";

const Query = gql`
  type Query {
    packages: [Package!]!
  }
  type Mutation {
    potato: String
  }
`;

const SchemaDefinition = gql`
  schema {
    query: Query
    mutation: Mutation
  }
`;

const scalarResolvers = {};

const rootResolvers: IResolvers<any, IContext> = {
  Query: {
    packages: (parent, args, { packageService }) => packageService.getAll()
  },
  Mutation: {
    potato: () => "potata"
  }
};

export const typeDefs = [SchemaDefinition, Query, Package];

export const resolvers = merge(rootResolvers, scalarResolvers, packageResolvers);
