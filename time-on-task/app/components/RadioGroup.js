import React, { Component } from 'react';
import { View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import PropTypes from 'prop-types';

export default class RadioGroup extends Component {
  state = {
    checkedId: this.props.selectedId
  };
  _checked = checkedId => {
    this.setState({
      checkedId
    });
    this.props.onChange(checkedId);
  };
  render() {
    return (
      <View>
        {this.props.values.map(item => (
          <CheckBox
            key={item.id}
            title={item.text}
            checkedIcon="ios-radio-button-on"
            iconType="ionicon"
            uncheckedIcon="ios-radio-button-off-outline"
            checkedColor="blue"
            checked={this.state.checkedId === item.id}
            onPress={this._checked.bind(this, item.id)}
          />
        ))}
      </View>
    );
  }
}

RadioGroup.propTypes = {
  values: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  selectedId: PropTypes.string.isRequired
};
