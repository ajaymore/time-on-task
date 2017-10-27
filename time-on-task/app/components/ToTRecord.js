import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Timer from './Timer';
import VirtualGroup from './VirtualGroup';
import moment from 'moment';
import { StyleSheet, View, Text, Button } from 'react-native';
import uuidv4 from 'uuid/v4';
import { connect } from 'react-redux';
import { newEntry, addUnitObservation } from '../actions';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class ToTRecord extends Component {
  static propTypes = {};

  state = {
    timerToggle: false,
    currentMinute: 0,
    collectionData: [],
    startTime: null,
    now: null,
    recordingOn: false,
    minuteTobeRecorded: false,
    uuid: uuidv4()
  };

  componentDidMount() {}

  startTimer = () => {
    this.props.newEntry(
      this.state.uuid,
      this.props.navigation.state.params.classId
    );
    this.setState({ startTime: moment(), recordingOn: true });
    this.timerId = setInterval(() => {
      const now = moment();
      this.setState({
        now
      });
      const duration = moment.duration(
        now.valueOf() - this.state.startTime.valueOf()
      );
      const secondsElapsed = Math.round(duration.asSeconds() % 60);
      if (secondsElapsed > 50 && !this.state.minuteTobeRecorded) {
        this.setState({
          minuteTobeRecorded: true
        });
      }
      if (secondsElapsed > 15 && this.state.timerToggle) {
        this.setState({
          timerToggle: false
        });
      }
      if (
        secondsElapsed === 60 ||
        (this.state.minuteTobeRecorded && secondsElapsed < 5)
      ) {
        this.minutePassed(Math.round(duration.asMinutes()));
      }
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  stopRecording = () => {
    this.setState({
      recordingOn: false,
      startTime: null,
      minuteTobeRecorded: false
    });
    clearInterval(this.timerId);
  };

  minutePassed = minutes => {
    this.setState({
      currentMinute: minutes,
      timerToggle: !this.state.timerToggle,
      minuteTobeRecorded: false
    });
  };

  ratingSubmission = ratings => {
    const { currentMinute, timerToggle } = this.state;
    this.props.addUnitObservation(this.state.uuid, {
      minuteValue: currentMinute,
      ratings
    });
    this.setState({
      currentMinute: null,
      timerToggle: !timerToggle
    });
  };

  render() {
    const { timerToggle } = this.state;
    return (
      <View style={styles.container}>
        {timerToggle ? (
          <VirtualGroup ratingSubmission={this.ratingSubmission} />
        ) : (
          <Timer
            now={this.state.now}
            startTime={this.state.startTime}
            recordingOn={this.state.recordingOn}
            startTimer={this.startTimer}
            stopRecording={this.stopRecording}
            submitData={this._submitData}
          />
        )}
      </View>
    );
  }
}

export default connect(() => ({}), { newEntry, addUnitObservation })(ToTRecord);
