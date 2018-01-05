import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { NetInfo, View, Text } from 'react-native';
import { observationSynced } from '../actions';

class Sync extends Component {
  state = {
    isSyncOn: false,
    isConnected: false
  };

  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        isConnected
      });
    });
  }

  componentWillReceiveProps(newProps) {
    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        isConnected
      });
    });
  }

  _sync = async () => {
    this.setState({
      isSyncOn: true
    });
    for (item of this.props.observations) {
      try {
        if (!item.readings.length) {
          this.props.observationSynced(item.uuid);
          return;
        }
        await this.props.mutate({
          variables: {
            input: {
              endtime: item.endtime,
              starttime: item.starttime,
              readings: JSON.stringify(item.readings)
            },
            classroomId: item.classId
          }
        });
        this.props.observationSynced(item.uuid);
      } catch (err) {
        console.log(err);
      }
    }
    this.setState({
      isSyncOn: false
    });
  };

  render() {
    if (!this.props.observations.length || !this.state.isConnected) {
      return null;
    }
    if (this.state.isSyncOn) {
      return <Text>Syncing data</Text>;
    }
    return <Button title="sync" onPress={this._sync} />;
  }
}

const addObservationMutation = gql`
  mutation addObservation($input: ObservationInput!, $classroomId: ID!) {
    addObservation(input: $input, classroomId: $classroomId) {
      id
    }
  }
`;

const SyncWithMutation = graphql(addObservationMutation)(Sync);
export default connect(
  ({ observations }) => ({
    observations
  }),
  { observationSynced }
)(SyncWithMutation);
