import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableHighlight, Button, Dimensions } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column'
	},
	group: {
		flexDirection: 'row',
		width: Dimensions.get('window').width * 0.5 - 5
	},
	groupChild: {
		margin: 5,
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-around'
	},
	ratingButton: {
		textAlign: 'center',
		borderColor: '#000',
		borderWidth: 1,
		fontSize: 30,
		borderRadius: 60,
		width: (Dimensions.get('window').width * 0.5 - 5) / 3 - 8,
		height: (Dimensions.get('window').width * 0.5 - 5) / 3 - 8,
		lineHeight: (Dimensions.get('window').width * 0.5 - 5) / 3 - 14,
		color: '#3f3f3f',
		marginBottom: 5
	},
	groupTitle: {
		width: '100%',
		textAlign: 'center',
		fontSize: 20,
		paddingTop: 10,
		paddingBottom: 10,
		color: '#009688'
	},
	groupContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		flex: 0.95,
		flexWrap: 'wrap',
		padding: 5
	},
	submitBtnCtn: {
		width: '100%',
		padding: 20,
		flex: 0.05
	}
});

export default class VirtualGroup extends Component {
	state = {
		groupHeight: 100
	};

	componentDidMount() {}

	static propTypes = {
		ratingSubmission: PropTypes.func.isRequired
	};

	state = {
		groups: [
			{ title: 'One', items: [ 0, 1, 2, 3, 4, 5, 6, '-' ], givenRating: null },
			{ title: 'Two', items: [ 0, 1, 2, 3, 4, 5, 6, '-' ], givenRating: null },
			{ title: 'Three', items: [ 0, 1, 2, 3, 4, 5, 6, '-' ], givenRating: null },
			{ title: 'Four', items: [ 0, 1, 2, 3, 4, 5, 6, '-' ], givenRating: null }
		]
	};

	_onPressButton(groupIndex, ratingIndex) {
		this.setState({
			groups: this.state.groups.map((item, i) => {
				return {
					...item,
					givenRating: groupIndex === i ? ratingIndex : item.givenRating
				};
			})
		});
	}

	__submitRating = () => {
		this.props.ratingSubmission(
			this.state.groups.map((item) => ({
				title: item.title,
				givenRating: item.givenRating
			}))
		);
		this.setState({
			groups: this.state.groups.map((item, i) => {
				return { ...item, givenRating: null };
			})
		});
	};

	render() {
		const { groups } = this.state;
		return (
			<View style={styles.container}>
				<View
					style={styles.groupContainer}
					onLayout={(event) => {
						{
							/* var { x, y, width, height } = event.nativeEvent.layout; */
						}
						this.setState({ groupHeight: event.nativeEvent.layout.height / 2 });
					}}
				>
					{groups.map((group, i) => (
						<View key={i} style={[ styles.group, { height: this.state.groupHeight } ]}>
							<View style={styles.groupChild}>
								<Text style={styles.groupTitle}>{group.title}</Text>
								{group.items.map((rating, j) => (
									<TouchableHighlight key={j} onPress={this._onPressButton.bind(this, i, j)}>
										<Text
											style={[
												styles.ratingButton,
												{
													color: group.givenRating === j ? '#fff' : '#000',
													backgroundColor: group.givenRating === j ? '#000' : '#fff'
												}
											]}
										>
											{rating}
										</Text>
									</TouchableHighlight>
								))}
							</View>
						</View>
					))}
				</View>
				<View style={styles.submitBtnCtn}>
					<Button
						disabled={
							groups[0].givenRating === null ||
							groups[1].givenRating === null ||
							groups[2].givenRating === null ||
							groups[3].givenRating === null
						}
						onPress={this.__submitRating}
						title="Submit"
					/>
				</View>
			</View>
		);
	}
}
