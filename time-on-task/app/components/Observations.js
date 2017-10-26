import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Icon } from 'react-native-elements';
import { Text, View, Button, FlatList, RefreshControl } from 'react-native';
import Sync from './Sync';
import Report from './Report';

class Observations extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Observations, ${navigation.state.params.classSubject}`
  });

  state = {
    modalVisible: true,
    isRefreshing: false
  };

  _addRecord = () => {
    const { navigate } = this.props.navigation;
    navigate('Recorder', {
      classId: this.props.navigation.state.params.classroomId
    });
  };

  _onRefresh = () => {
    this.setState({ isRefreshing: true });
    this.props.data.refetch().then(() => {
      this.setState({
        isRefreshing: false
      });
    });
  };

  render() {
    const { data: { getClassroom } } = this.props;
    const listData =
      getClassroom && getClassroom.observations
        ? getClassroom.observations.map(item => ({
            ...item,
            key: item.id
          }))
        : [];
    console.log(listData);
    return (
      <View style={{ flex: 1 }}>
        {this.props.navigation.state.params.isAllowed ? (
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              zIndex: 5
            }}
          >
            <Icon
              raised
              name="plus"
              type="entypo"
              color="blue"
              size={32}
              onPress={this._addRecord}
            />
          </View>
        ) : null}
        {!getClassroom ? null : (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                title="Loading..."
              />
            }
            data={listData}
            renderItem={({ item }) => (
              <View>
                <Report observation={item} />
              </View>
            )}
          />
        )}
        <Sync />
      </View>
    );
  }
}

const addObservationMutation = gql`
  mutation addObservation($input: ObservationInput!, $classroomId: ID!) {
    addObservation(input: $input, classroomId: $classroomId) {
      id
    }
  }
`;

const getObservations = gql`
  query getClassroom($classroomId: ID!) {
    getClassroom(classroomId: $classroomId) {
      id
      observations {
        endtime
        id
        starttime
        readings
      }
      subject
      teacher
      totalStudents
    }
  }
`;

export default graphql(getObservations, {
  options: props => {
    return {
      variables: { classroomId: props.navigation.state.params.classroomId }
    };
  }
})(Observations);
