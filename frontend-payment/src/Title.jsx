import React from 'react';
import styled from 'styled-components';

const StyledTitleContainer = styled.div`
  text-align: center;
`;

const Title = () => (
  <StyledTitleContainer>
    <h1>Payda'ya destek olun</h1>
    <p>
      Eğer siz de Payda’ya destek vermek istiyorsanız aşağıdaki formu
      kullanabilirsiniz.
    </p>
  </StyledTitleContainer>
);

export default Title;
