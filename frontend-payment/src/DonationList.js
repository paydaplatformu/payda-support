import React from 'react';
import styled from 'styled-components';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const StyledDonationListContainer = styled.div`
  text-align: center;
`;

const DonationList = () => (
  <StyledDonationListContainer>
    <h2>Bağış Yap!</h2>
    <p>Aşağıdaki paket ile Payda'ya destek olmak istiyorum</p>
    <Select
      inputProps={{
        name: 'age',
        id: 'age-simple'
      }}
      value={10}
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      <MenuItem value={10}>Ten</MenuItem>
      <MenuItem value={20}>Twenty</MenuItem>
      <MenuItem value={30}>Thirty</MenuItem>
    </Select>
    <a href="http://www.google.com">
      Paketlerin detaylarını görmek için tıklayınız
    </a>
  </StyledDonationListContainer>
);

export default DonationList;
