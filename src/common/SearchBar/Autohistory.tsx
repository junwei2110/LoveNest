import React from 'react';
import { mockData } from './mockData';
//Create a class with the following methods
/* 
update history - Dispatch an action to update the store of the data items
refresh history - clear all historical searches
delete history - clear specified historical searches
fetch history - fetch the historical searches from the store
*/

export class AutoHistory {

    historicalSearchData: historicalSearchData[]

    constructor() {
        this.historicalSearchData = [];
    }

    fetchHistory() {
        //Fetch from back4App
        const data = mockData;
        //this.historicalSearchData = data;
    }



}

type historicalSearchData = {
    searchTerm: string,
    searchDate: Date
}