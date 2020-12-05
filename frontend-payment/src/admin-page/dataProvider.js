import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  HttpLink,
} from "apollo-boost";

const requestFormatterLink = new ApolloLink((operation, forward) => {
  console.log(operation.variables);
  if (operation.variables) {
    operation.variables = JSON.parse(
      JSON.stringify(operation.variables),
      (key, value) => (key === "__typename" ? undefined : value)
    );
  }

  return forward(operation);
});

const httpLink = new HttpLink({
  uri: "/graphql",
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
  link: authLink.concat(requestFormatterLink).concat(httpLink), // Chain it with the HttpLink
  cache: new InMemoryCache(),
});
