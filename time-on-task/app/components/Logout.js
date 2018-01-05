import React from 'react';
import { connect } from 'react-redux';
import { loggingOut } from '../actions';
import { TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-elements';

const Logout = ({ loggingOut, accessToken, refreshToken }) => (
  <Icon
    style={{ marginRight: 10 }}
    name="sign-out"
    type="octicon"
    color="blue"
    size={28}
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
