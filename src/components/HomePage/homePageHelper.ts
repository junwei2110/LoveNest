import React from 'react';
import Parse from 'parse/react-native.js';
import { ChecklistItem, GlobalReminderObj } from './EventModal';

export const getReminders = async (currentUser: Parse.Attributes) => {

        const coupleId = currentUser.get('coupleId');
        const reminderQuery = new Parse.Query("Reminder");
        reminderQuery.containedIn('userOrCoupleId', [currentUser.id, coupleId]);
        reminderQuery.equalTo('completionStatus', false);
        const reminders = await reminderQuery.find();

        return reminders; 

};


//TODO: Change the ParseDB to accept Date object, else need to convert the date obj to string and back to dateobj multiple times
export const sortReminders = (reminderArray: Parse.Object<Parse.Attributes>[]) => {

    if (reminderArray.length < 1) return [];


    const modifiedRemArr: GlobalReminderObj[] = reminderArray.map((reminder) => {
        const id: string = reminder && reminder.id;
        const title: string = reminder && reminder.get('title');
        const recurrence: string = reminder && reminder.get('recurrence');
        const userOrCoupleId: string = reminder && reminder.get('userOrCoupleId');
        const dateTime: Date = reminder && new Date(reminder.get('dateTime')?.toLocaleString("en-US", {timeZone: "Asia/Singapore"}));
        const checkItems: ChecklistItem[] = reminder && reminder.get('checkItems');
        const completionStatus: boolean = reminder && reminder.get('completionStatus');
        const currentDateTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Singapore"}));

        let newReminderObj: GlobalReminderObj = {
            id,
            title,
            dateTime,
            recurrence,
            userOrCoupleId,
            checkItems,
            completionStatus,
        }

        const oneDayMS = 24 * 60 * 60* 1000;
        switch (recurrence) {
            case "Once":
            case "One-Time":
                if (dateTime.getTime() < (currentDateTime.getTime() - oneDayMS)) {
                    reminder.set('completionStatus', true);
                    reminder.save().then(() => console.log("reminder saved"));
                } else {
                    //globalReminderObj.push(newReminderObj);
                    return newReminderObj;
                }
            case "Annual":
                if (dateTime.getMonth() < currentDateTime.getMonth() || 
                    (dateTime.getMonth() === currentDateTime.getMonth() && 
                        dateTime.getDate() < currentDateTime.getDate())) {

                            const newYear = currentDateTime.getFullYear() + 1;
                            dateTime.setFullYear(newYear);
                            reminder.set('dateTime', dateTime.toDateString());
                            reminder.save();
                            newReminderObj = {...newReminderObj, dateTime}
                            //globalReminderObj.push(newReminderObj);
                            return newReminderObj;
                            
                        } else {

                            const newYear = currentDateTime.getFullYear();
                            dateTime.setFullYear(newYear);
                            reminder.set('dateTime', dateTime.toDateString());
                            reminder.save();
                            newReminderObj = {...newReminderObj, dateTime}
                            //globalReminderObj.push(newReminderObj);
                            return newReminderObj;
                        }
            
            case "Month":
                if (dateTime.getDate() < currentDateTime.getDate()) {

                    const newMonth = currentDateTime.getMonth() + 1;
                    dateTime.setFullYear(currentDateTime.getFullYear());
                    dateTime.setMonth(newMonth);
                    reminder.set('dateTime', dateTime.toDateString());
                    reminder.save();
                    newReminderObj = {...newReminderObj, dateTime}
                    //globalReminderObj.push(newReminderObj);
                    return newReminderObj;

                } else {

                    const newMonth = currentDateTime.getMonth();
                    dateTime.setFullYear(currentDateTime.getFullYear());
                    dateTime.setMonth(newMonth);
                    reminder.set('dateTime', dateTime.toDateString());
                    reminder.save();
                    newReminderObj = {...newReminderObj, dateTime}
                    //globalReminderObj.push(newReminderObj);
                    return newReminderObj;
                }
            
            case "Week":
                if (dateTime.getTime() < currentDateTime.getTime()) {
                    const diffMilliSec = currentDateTime.getTime() - dateTime.getTime();
                    const diffDay = Math.ceil(diffMilliSec/(7*24*3600*1000));
                    const newDay = dateTime.getDate() + diffDay*7;

                    dateTime.setFullYear(currentDateTime.getFullYear());
                    dateTime.setMonth(currentDateTime.getMonth());
                    dateTime.setDate(newDay);
                    reminder.set('dateTime', dateTime.toDateString());
                    reminder.save();
                    newReminderObj = {...newReminderObj, dateTime}
                    //globalReminderObj.push(newReminderObj);
                    return newReminderObj;
                } else {
                    //globalReminderObj.push(newReminderObj);
                    return newReminderObj;
                }

            default:
                //globalReminderObj.push(newReminderObj);
                return newReminderObj;
        }


    }).sort((a,b) => {
            const aDate: Date = a?.dateTime;
            const bDate: Date = b?.dateTime;
            return aDate?.getTime() - bDate?.getTime();
        });
    
    return modifiedRemArr;
    
    //Pull the array from the DB
    //case recurrence one-time: check date is later than now, else remove it
    //case recurrence weekly: modify date to nearest date to todays week
    //Take current date - specified date, then divide by 7 and round it up. Add the number of days to the specified date 
    //case annual: check date(without year) is later than now, else remove it
    //case monthly: modify date to current month if day is more than current, else to next month

};