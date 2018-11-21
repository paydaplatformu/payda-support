import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withStyles } from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';
import Select from './Select';

const query = gql`
  {
    packages {
      id
      defaultTag {
        code
        name
        description
      }
      tags {
        code
        name
        description
      }
    }
  }
`;

const DonationSelect = props => (
  <Query query={query}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error!</p>;

      return (
        <Select>
          {data.packages.map(({ defaultTag: { name } }) => (
            <MenuItem value={name}>{name}</MenuItem>
          ))}
        </Select>
      );
    }}
  </Query>
);

const styles = {
  container: {
    marginBottom: 20,
    width: '100%'
  }
};

export default withStyles(styles)(DonationSelect);
