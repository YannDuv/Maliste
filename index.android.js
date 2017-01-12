import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableNativeFeedback,
  ListView,
  AsyncStorage
} from 'react-native';

class Maliste extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        return r1 !== r2;
      }
    });
    const list = [];
    this.state = {
      input: '',
      list: list,
      dataSource: ds.cloneWithRows(list)
    };

    AsyncStorage.getItem('@Maliste:list')
      .then(JSON.parse)
      .then(list => {
            list.sort(this._sortData);
            this.setState({
              list: list,
              dataSource: this.state.dataSource.cloneWithRows(list)
            });
      })
      .catch(console.error);
  }

  _sortData(a, b) {
    if (a.isOk == b.isOk) {
      return a.label.toUpperCase() > b.label.toUpperCase() ? 1 : -1;
    }
    if (a.isOk) {
      return 1;
    }
    return -1;
  }

  _updateList(data) {
    data.sort(this._sortData);
    this.setState({
      input: '',
      list: data,
      dataSource: this.state.dataSource.cloneWithRows(data)
    });
    AsyncStorage
      .setItem('@Maliste:list', JSON.stringify(data))
      .catch(console.error);
  }

  _addToList() {
    if (this.state.input.length === 0) {
      return;
    }

    let data = [{label: this.state.input, isOk: false}].concat(this.state.list);
    this._updateList(data);
  }

  _toggleItem(data) {
    let list = this.state.list.map(l => {
      if (l.label === data.label) {
        l.isOk = !data.isOk;
      }
      return l;
    });
    this._updateList(list);
  }

  _removeItem(data) {
    let list = this.state.list.filter(l => l.label !== data.label);
    this._updateList(list);
  }

  _renderRow(rowData) {
    return (
      <TouchableNativeFeedback
        onPress={() => this._toggleItem(rowData)}
        onLongPress={() => this._removeItem(rowData)}
        background={TouchableNativeFeedback.SelectableBackground()}>

        <View style={[styles.row, rowData.isOk ? styles.done : null]}>
          <Text style={styles.rowTxt}>{rowData.label}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }

  render() {
    return (
      <View style = {styles.maincontainer}>
        <TextInput
          placeholder={'Item'}
          onChangeText={(input) => this.setState({input})}
          value={this.state.input}
          autoCapitalize={'sentences'}
        />
        <TouchableNativeFeedback
            onPress={this._addToList.bind(this)}
            background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.btn}>
            <Text style={styles.btnTxt}>Add</Text>
          </View>
        </TouchableNativeFeedback>
        <ListView
          style={styles.list}
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          renderRow={this._renderRow.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  maincontainer: {
    backgroundColor: '#ede4f6',
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    flex:1,
    marginBottom: 2,
    backgroundColor: 'lightgray',
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowTxt: {
    color: '#333333',
    fontSize: 16
  },
  btn: {
    alignSelf: 'center',
    marginBottom: 5,
    width: 200,
    backgroundColor: 'rgb(139, 23, 173)'
  },
  btnTxt: {
    margin: 12,
    textAlign: 'center',
    color: 'rgb(255, 255, 255)',
    fontSize: 18,
    fontWeight: 'bold'
  },
  list: {
    flexDirection: 'column',
    flex:1,
  },
  done: {
    backgroundColor: 'rgba(199, 149, 214, 1)'
  }
});

AppRegistry.registerComponent('Maliste', () => Maliste);
