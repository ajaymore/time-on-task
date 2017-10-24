import React from 'react';
import { connect } from 'react-redux';
import { loggingOut } from '../actions';
import { Button } from 'react-native';

const Logout = ({ loggingOut, accessToken, refreshToken }) => (
  <Button
    title="Logout"
    color="#841584"
    onPress={loggingOut.bind(this, accessToken, refreshToken)}
  />
);

export default connect(
  ({ auth }, ownProps) => ({
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken
  }),
  { loggingOut }
)(Logout);
