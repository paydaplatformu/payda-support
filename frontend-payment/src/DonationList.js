import React from 'react';
import styled from 'styled-components';

import { paydaOrange } from './constants';

import DonationSelectWithDetails from './DonationSelectWithDetails';

const StyledDonationListContainer = styled.div`
  text-align: center;
`;

const StyledDonateTitle = styled.p`
  color: ${paydaOrange};
  font-size: 28px;
  font-weight: 600;
`;

const DonationList = () => (
  <StyledDonationListContainer>
    <StyledDonateTitle>Bağış Yap!</StyledDonateTitle>
    <p>Aşağıdaki paket ile Payda'ya destek olmak istiyorum</p>
    <DonationSelectWithDetails />
  </StyledDonationListContainer>
);

export default DonationList;
