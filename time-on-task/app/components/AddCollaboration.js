import React from 'react';
import { View, TextInput, StyleSheet, ScrollView } from 'react-native';
import { searchUser, searchUserSuccess } from '../actions';
import { connect } from 'react-redux';
import { SearchBar, List, ListItem, Button } from 'react-native-elements';
import RadioGroup from './RadioGroup';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { userQuery } from './Home';

class AddCollaboration extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `For school ${navigation.state.params.schoolName}`
  });
  state = {
    text: '',
    selectedUser: null,
    shareType: 'SHARED'
  };
  _change = text => {
    this.setState({ text });
    if (!text) return;
    this.props.searchUser(text);
    this.setState({ selectedUser: null });
  };
  componentDidMount() {
    this.props.searchUserSuccess([]);
  }
  _selectUser = selectedUser => {
    this.setState({ selectedUser, text: '' });
  };
  _shareType = shareType => {
    console.log(shareType);
    this.setState({
      shareType
    });
  };
  _addCollaboration = async () => {
    const { selectedUser, shareType } = this.state;
    if (!selectedUser || !shareType) {
      alert('Please select a user');
      return;
    }
    try {
      const collaboration = await this.props.mutate({
        variables: {
          schoolId: this.props.navigation.state.params.schoolId,
          userId: selectedUser._id,
          collaborationType: shareType
        },
        refetchQueries: [
          {
            query: userQuery
          }
        ]
      });
      this.setState({
        text: '',
        selectedUser: null,
        shareType: 'SHARED'
      });
      alert('Sharing is successful.');
    } catch (err) {
      console.log(err);
      alert('We are encountering some issues, please try later');
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <SearchBar
          lightTheme
          onChangeText={this._change}
          value={this.state.text}
          placeholder="Type email Here..."
        />
        <List containerStyle={{ marginBottom: 20 }}>
          <ScrollView>
            {!this.state.text ? (
              this.state.selectedUser ? (
                <ListItem
                  roundAvatar
                  avatar={{ uri: this.state.selectedUser.picture }}
                  title={this.state.selectedUser.userName}
                  subtitle={this.state.selectedUser.email}
                  rightIcon={<View />}
                />
              ) : null
            ) : (
              this.props.search.map(user => (
                <ListItem
                  key={user._id}
                  roundAvatar
                  avatar={{ uri: user.picture }}
                  title={user.userName}
                  subtitle={user.email}
                  rightIcon={<View />}
                  onPress={this._selectUser.bind(this, user)}
                />
              ))
            )}
          </ScrollView>
        </List>
        <RadioGroup
          values={[
            { id: 'SHARED', text: 'SHARED' },
            { id: 'CONTRIBUTING', text: 'CONTRIBUTING' }
          ]}
          onChange={this._shareType}
          selectedId="SHARED"
        />
        <View style={{ marginTop: 20 }}>
          <Button title="Add Collboration" onPress={this._addCollaboration} />
        </View>
      </View>
    );
  }
}

const addCollaborationMutation = gql`
  mutation addCollaboration(
    $schoolId: ID!
    $userId: ID!
    $collaborationType: Collboration!
  ) {
    addCollborator(
      schoolId: $schoolId
      userId: $userId
      collaborationType: $collaborationType
    ) {
      id
    }
  }
`;

const AddCollaborationRedux = connect(({ search }) => ({ search }), {
  searchUser,
  searchUserSuccess
})(AddCollaboration);

export default graphql(addCollaborationMutation)(AddCollaborationRedux);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  results: {
    flex: 8
  }
});
