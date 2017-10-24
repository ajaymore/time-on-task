import React, { Component } from 'react';
import Svg, {
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop
} from 'react-native-svg';

export default class AddIcons extends Component {
  render() {
    return (
      <Svg height="50" width="50">
        <G>
          <Path d="M50,87.5c20.7,0,37.5-16.8,37.5-37.5S70.7,12.5,50,12.5S12.5,29.3,12.5,50S29.3,87.5,50,87.5z M50,15.5   C69,15.5,84.5,31,84.5,50S69,84.5,50,84.5S15.5,69,15.5,50S31,15.5,50,15.5z" />
          <Path d="M33,52h15v15c0,0.8,0.7,1.5,1.5,1.5S51,67.8,51,67V52h16c0.8,0,1.5-0.7,1.5-1.5S67.8,49,67,49H51V33c0-0.8-0.7-1.5-1.5-1.5   S48,32.2,48,33v16H33c-0.8,0-1.5,0.7-1.5,1.5S32.2,52,33,52z" />
        </G>
      </Svg>
    );
  }
}