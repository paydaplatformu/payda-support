import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const query = gql`
  query AllPackages($sortOrder: String, $sortField: String) {
    allPackages(sortOrder: $sortOrder, sortField: $sortField) {
      id
      defaultTag {
        code
        name
        description
      }
      image
      tags {
        code
        name
        description
      }
      price {
        currency
        amount
      }
    }
  }
`;

export const PackageContext = React.createContext();

export const PackageContextProvider = ({ children }) => {
  return (
    <Query
      query={query}
      variables={{ sortOrder: "DESC", sortField: "priority" }}
    >
      {({ loading, error, data }) => {
        if (error) return <p>error</p>;

        return (
          <PackageContext.Provider
            value={{ loading, packages: data.allPackages }}
          >
            {children}
          </PackageContext.Provider>
        );
      }}
    </Query>
  );
};
