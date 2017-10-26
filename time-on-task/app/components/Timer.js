import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { View, Text, StyleSheet, Button } from 'react-native';
import Report from './Report';
import { Icon } from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  records: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 8
  },
  timeDisplay: {
    flex: 6,
    paddingTop: 30,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  timeLabel: {
    fontSize: 20
  },
  timeValue: {
    fontSize: 80,
    color: 'powderblue'
  },
  startRecordBtn: {
    flex: 4
  }
});

const pad = (num, size) => {
  var s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
};

export default class Timer extends Component {
  static propTypes = {
    startTimer: PropTypes.func.isRequired,
    recordingOn: PropTypes.bool.isRequired,
    stopRecording: PropTypes.func.isRequired
  };

  componentDidMount() {}

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  render() {
    const {
      now,
      startTime,
      recordingOn,
      startTimer,
      stopRecording,
      dataAvailable,
      submitData
    } = this.props;
    const duration =
      now && startTime
        ? moment.duration(now.valueOf() - startTime.valueOf())
        : null;
    return (
      <View style={styles.container}>
        <View style={styles.records}>
          {duration ? (
            <View style={styles.timeDisplay}>
              <Text style={styles.timeValue}>
                {`${pad(duration.minutes(), 2)}`} :{' '}
              </Text>
              <Text style={styles.timeValue}>{`${pad(
                duration.seconds(),
                2
              )}`}</Text>
            </View>
          ) : (
            <View style={styles.timeDisplay}>
              <Text style={styles.timeValue}>00 : </Text>
              <Text style={styles.timeValue}>00</Text>
            </View>
          )}
          <View style={styles.startRecordBtn}>
            {recordingOn ? (
              // <Button
              //   color="#841584"
              //   onPress={stopRecording}
              //   title="Stop Recording"
              // />
              <View style={{}}>
                <Icon
                  raised
                  name="stop-circle-outline"
                  type="material-community"
                  color="#fff"
                  size={42}
                  containerStyle={{ backgroundColor: 'orange' }}
                  onPress={stopRecording}
                />
              </View>
            ) : (
              <View style={{}}>
                <Icon
                  raised
                  name="play-circle-outline"
                  type="material-community"
                  color="#fff"
                  size={42}
                  containerStyle={{ backgroundColor: 'orange' }}
                  onPress={startTimer}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}
