import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import moment from 'moment';
import range from 'lodash/range';

export default class Report extends Component {
  render() {
    const { starttime, endtime, readings } = this.props.observation;
    const duration = moment.duration(
      moment(endtime).valueOf() - moment(starttime).valueOf()
    );
    // let ds = {
    //   One: [],
    //   Two: [],
    //   Three: [],
    //   Four: [],
    //   'Total -': [],
    //   'Total 0-1': [],
    //   'Total 2': [],
    //   'Total 3-6': []
    // };
    // let values = JSON.parse(readings);
    // const max = 7;
    // const min = 0;
    // values = range(35).map(i => {
    //   return {
    //     minuteValue: i + 1,
    //     ratings: [
    //       {
    //         title: 'One',
    //         givenRating: Math.floor(Math.random() * (max - min + 1)) + min
    //       },
    //       {
    //         title: 'Two',
    //         givenRating: Math.floor(Math.random() * (max - min + 1)) + min
    //       },
    //       {
    //         title: 'Three',
    //         givenRating: Math.floor(Math.random() * (max - min + 1)) + min
    //       },
    //       {
    //         title: 'Four',
    //         givenRating: Math.floor(Math.random() * (max - min + 1)) + min
    //       }
    //     ]
    //   };
    // });
    // values.forEach(val => {
    //   const minute = val.minuteValue - 1;
    //   const ratings = val.ratings;
    //   ratings.forEach(rat => {
    //     ds[rat.title][minute] = rat.givenRating === 7 ? '-' : rat.givenRating;
    //     if (rat.givenRating === 7) {
    //       ds['Total -'][minute] = ds['Total -'][minute]
    //         ? ds['Total -'][minute] + 1
    //         : 1;
    //     } else if (rat.givenRating === 0 || rat.givenRating === 1) {
    //       ds['Total 0-1'][minute] = ds['Total 0-1'][minute]
    //         ? ds['Total 0-1'][minute] + 1
    //         : 1;
    //     } else if (rat.givenRating === 2) {
    //       ds['Total 2'][minute] = ds['Total 2'][minute]
    //         ? ds['Total 2'][minute] + 1
    //         : 1;
    //     } else if (rat.givenRating >= 3 && rat.givenRating <= 6) {
    //       ds['Total 3-6'][minute] = ds['Total 3-6'][minute]
    //         ? ds['Total 3-6'][minute] + 1
    //         : 1;
    //     }
    //   });
    // });
    const ds = JSON.parse(readings);
    console.log(ds);
    const cols = range(35);
    return (
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 20,
            paddingBottom: 10,
            paddingTop: 10
          }}
        >
          Duration {duration.hours()} Hours, {duration.minutes()} minutes.
        </Text>
        <ScrollView horizontal>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.titleTextBold}>Timeline</Text>
              <Text style={styles.titleTextBold}>1-5 Min.</Text>
              <Text style={styles.titleTextBold}>6-10 Min.</Text>
              <Text style={styles.titleTextBold}>11-15 Min.</Text>
              <Text style={styles.titleTextBold}>16-20 Min.</Text>
              <Text style={styles.titleTextBold}>20-25 Min.</Text>
              <Text style={styles.titleTextBold}>26-30 Min.</Text>
              <Text style={styles.titleTextBold}>31-35 Min.</Text>
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>One</Text>
              {cols.map(index => (
                <Text style={styles.cell} key={index}>
                  {ds.One[index]}
                </Text>
              ))}
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Two</Text>
              {cols.map(index => (
                <Text style={styles.cell} key={index}>
                  {ds.Two[index]}
                </Text>
              ))}
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Three</Text>
              {cols.map(index => (
                <Text style={styles.cell} key={index}>
                  {ds.Three[index]}
                </Text>
              ))}
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Four</Text>
              {cols.map(index => (
                <Text style={styles.cell} key={index}>
                  {ds.Four[index]}
                </Text>
              ))}
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Total -</Text>
              {cols.map(index => (
                <Text style={styles.cell} key={index}>
                  {ds['Total -'][index]}
                </Text>
              ))}
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Total 0-1</Text>
              {cols.map(index => (
                <Text style={styles.cell} key={index}>
                  {ds['Total 0-1'][index]}
                </Text>
              ))}
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Total 2</Text>
              {cols.map(index => (
                <Text style={styles.cell} key={index}>
                  {ds['Total 2'][index]}
                </Text>
              ))}
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Total 3-6</Text>
              {cols.map(index => (
                <Text style={styles.cell} key={index}>
                  {ds['Total 3-6'][index]}
                </Text>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 20,
    justifyContent: 'flex-start',
    flex: 1
  },
  titleRow: { flexDirection: 'row' },
  titleText: {
    width: 125,
    padding: 5,
    borderWidth: 1,
    borderBottomColor: '#000',
    borderLeftColor: '#000'
  },
  titleTextBold: {
    width: 125,
    padding: 5,
    borderWidth: 1,
    borderBottomColor: '#000',
    fontWeight: 'bold'
  },
  cell: {
    borderLeftColor: '#000',
    borderWidth: 1,
    width: 25,
    textAlign: 'center',
    padding: 2
  }
});
