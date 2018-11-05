import { gql } from "apollo-server-core";
import { IResolvers } from "graphql-tools";
import { IPackage } from "../models/Package";
import { IContext } from "./context";

export const typeDef = gql`
  type Package {
    name: String!
    donations: String!
  }
`;

export const resolvers: IResolvers<IPackage, IContext> = {
  Package: {
    donations: () => ""
  }
};
