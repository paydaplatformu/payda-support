import React, { useReducer } from "react";
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
      isCustomizable
      repeatInterval
    }
    __type(name: "Currency") {
      name
      enumValues {
        name
      }
    }
  }
`;

export const PackageContext = React.createContext();

export const PackageContextProvider = ({ children }) => {
  const initialState = {
    selectedPackage: {}
  };

  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case "selectPackage":
        return { ...state, selectedPackage: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const selectPackage = selectedPackage =>
    dispatch({ type: "selectPackage", payload: selectedPackage });

  return (
    <Query
      query={query}
      variables={{ sortOrder: "DESC", sortField: "priority" }}
    >
      {({ loading, error, data }) => {
        if (error) return <p>error</p>;

        return (
          <PackageContext.Provider
            value={{
              loading,
              packages: data.allPackages,
              availableCurrencies:
                data.__type && data.__type.enumValues.map(c => c.name),
              selectedPackage: state && state.selectedPackage,
              selectPackage
            }}
          >
            {children}
          </PackageContext.Provider>
        );
      }}
    </Query>
  );
};
