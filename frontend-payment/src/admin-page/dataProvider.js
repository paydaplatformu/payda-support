import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  HttpLink,
} from "apollo-boost";
import { baseURL } from "../constants";

const httpLink = new HttpLink({
  uri: `${baseURL}/graphql`,
});

const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  const token = localStorage.getItem("accessToken");

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink), // Chain it with the HttpLink
  cache: new InMemoryCache(),
});
