import { gql } from "apollo-server-core";
import { IResolvers } from "graphql-tools";
import { UserModel } from "../models/User";
import { IContext } from "./context";

export const typeDef = gql`
  type User {
    id: String!
    email: String!
    createdAt: Date!
    role: String!
  }
`;

export const resolvers: IResolvers<UserModel, IContext> = {
  User: {}
};
