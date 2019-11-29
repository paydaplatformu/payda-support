import { gql } from "apollo-server-core";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

export const typeDef = gql`
  scalar Date
`;

export const resolver = new GraphQLScalarType({
  name: "Date",
  description: "Date scalar type",
  parseValue(value) {
    return new Date(value);
  },
  serialize(value: Date) {
    return value.toISOString(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value); // ast value is always in string format
    }
    return null;
  }
});
