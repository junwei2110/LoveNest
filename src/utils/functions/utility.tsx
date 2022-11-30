import React from 'react';
import { Month, MonthToNumeric } from '../../models/enum';


export const YYYYMMDDFormat = (date: Date) => {
    const dateTime = date.toLocaleString("en-US", {timeZone: "Asia/Singapore"});
    return manualDateConversion(dateTime);
}

export const manualDateConversion = (dateString: string) => { // day month date year and date can be single digit

    const [_day, month, date, date2, _time, year] = dateString.split(" ");

    const monthLowerCase = month.toLowerCase() as Month;
    const monthNumeric = MonthToNumeric[monthLowerCase];
    
    if (year) {
        // This is the condition for single digit dates
        return `${year}-${monthNumeric}-0${date2}`;
    }

    return `${_time}-${monthNumeric}-${date}`;

}


export const getFirstItemInSet = (set: Set<any>) => {

    const [firstItem] = set;
    return firstItem;

}