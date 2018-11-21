import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

import DonationSelect from './DonationSelect';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: 20
  }
};

const DonationSelectWithDetails = props => (
  <Paper elevation={0} className={props.classes.root}>
    <DonationSelect />
    <a href="http://www.google.com">
      Paketlerin detaylarını görmek için tıklayınız
    </a>
  </Paper>
);

export default withStyles(styles)(DonationSelectWithDetails);
