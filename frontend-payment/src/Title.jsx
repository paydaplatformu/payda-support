import React from 'react';
import styled from 'styled-components';

import { paydaOrange } from './constants';

const StyledTitleContainer = styled.div`
  padding: 50px 30px;
  text-align: center;
  background-color: ${paydaOrange};
`;

const StyledHeading = styled.p`
  margin: 0;
  color: #ffffff;

  @media (max-width: 768px) {
    font-size: 32px;
    font-weight: 600;
  }
`;

const StyledDescription = styled.p`
  @media (max-width: 768px) {
    font-size: 16px;
    font-weight: 300;
  }

  color: #ffffff;
`;

const Title = () => (
  <StyledTitleContainer>
    <StyledHeading>Payda'ya destek olun</StyledHeading>
    <StyledDescription>
      Eğer siz de Payda’ya destek vermek istiyorsanız aşağıdaki formu
      kullanabilirsiniz.
    </StyledDescription>
  </StyledTitleContainer>
);

export default Title;
