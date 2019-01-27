import React from 'react';
import styled from 'styled-components';

const StyledLegalLinksContainer = styled.div`
  text-align: center;
`;

const LegalLinks = () => (
  <StyledLegalLinksContainer>
    <div>
      <a href="https://www.instagram.com">Satış Sözleşmesi</a>
    </div>
    <div>
      <a href="https://www.eksisozluk.com">İade Şartları</a>
    </div>
  </StyledLegalLinksContainer>
);

export default LegalLinks;
