import { gql } from "apollo-server-core";
import { IResolvers } from "graphql-tools";
import { IUser } from "../models/User";
import { IContext } from "./context";

export const typeDef = gql`
  type User {
    id: String!
    username: String!
    email: String!
    createdAt: Date!
    role: String!
  }
`;

export const resolvers: IResolvers<IUser, IContext> = {
  User: {}
};
