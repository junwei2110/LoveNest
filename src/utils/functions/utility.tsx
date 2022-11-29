import React from 'react';
import { Month, MonthToNumeric } from '../../models/enum';


export const YYYYMMDDFormat = (date: Date) => {
    const dateTime = date.toLocaleString("en-US", {timeZone: "Asia/Singapore"});
    return manualDateConversion(dateTime);
}

export const manualDateConversion = (dateString: string) => { // day month date year

    const [_day, month, date, _time, year] = dateString.split(" ");
    const monthLowerCase = month.toLowerCase() as Month;

    const monthNumeric = MonthToNumeric[monthLowerCase];
    
    return `${year}-${monthNumeric}-${date}`;

}


export const getFirstItemInSet = (set: Set<any>) => {

    const [firstItem] = set;
    return firstItem;

}