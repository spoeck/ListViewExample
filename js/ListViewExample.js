/**
 * Created by spoeck on 12/7/16.
 */

'use strict';
import React from 'react';
import {
    ListView, StyleSheet, View, Text, RecyclerViewBackedScrollView
} from 'react-native';

export default class ListViewExample extends React.Component {


    // data for the listView
    data = [{
        section: 'Audi',
        rows: ["A3", "A4", "R8"]
    },{
        section: 'BMW',
        rows: ["1er", "3er", "M4", "Z3"]
    },{
        section: 'Mercedes',
        rows: ["A Klasse", "E Klasse", "GLA", "SLK", "AMG GT"]
    }];

    props: {};

    static defaultProps = {};


    constructor() {
        super();
        this._getDataSource = this._getDataSource.bind(this);
        this.render = this.render.bind(this);
        this._renderRow = this._renderRow.bind(this);

    }


    /*
     transform data to a list compatible dataSource format
      */
    _getDataSource(data: any) {

        let dataBlob = [];
        let sectionIDs = [];
        let rowIDs = [];

        // handle sections
        for (let i = 0; i < data.length; ++i) {
            sectionIDs.push(data[i].section);

            // handle row data
            rowIDs[i] = [];
            for (let j = 0; j < data[i].rows.length; ++j) {
                // add an unique row id
                rowIDs[i].push(dataBlob.length + j);
            }
            // append row data to dataBlob
            dataBlob.push(...data[i].rows);
        }

        if (!this.dataSource) {
            // initialize dataSource
            this.dataSource = new ListView.DataSource({
                getRowData: (dataBlob, sectionID, rowID) => dataBlob[rowID],
                getSectionHeaderData: (dataBlob, sectionID, rowID) => dataBlob[rowID],
                rowHasChanged: (r1, r2) => r1 !== r2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2
            });
        }

        // return dataSource with generated data
        return this.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
    }


    render() {

        let ds = this._getDataSource(this.data);

        return (
            <View style={styles.container}>
                <ListView
                    enableEmptySections
                    refreshControl={null}
                    style={styles.listView}
                    dataSource={ds}
                    renderSectionHeader={this._renderSectionHeader}
                    renderRow={this._renderRow}
                    initialListSize={10}
                    pageSize={4}
                    renderScrollComponent={props => {return <RecyclerViewBackedScrollView {...props} />;}} />
            </View>
        );
    }

    _renderRow(rowData: any, sectionID: any, rowID: number) {

        if (sectionID === this.data[0].section) {
            // if AUDI
            return <Text style={{color: 'red'}}>{rowData}</Text>;

        } else if (sectionID === this.data[1].section) {
            // if BMW
            return <Text style={{color: 'blue'}}>{rowData}</Text>;

        } else if (sectionID === this.data[2].section) {
            // if Mercedes
            return <Text style={{color: 'black'}}>{rowData}</Text>;
        }

    }

    _renderSectionHeader(sectionData: string, sectionID: string, rowID: number) {
        return (
            // header: just show car company as text
            <View style={styles.section}>
                <Text>{sectionID}</Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    listView: {
        flex: 1,
        backgroundColor: 'rgb(238, 238, 238)',
    },

    section: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 6,
        backgroundColor: 'grey',
    },

});