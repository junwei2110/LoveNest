import React, { useContext, useEffect, useState } from 'react';
import { Calendar, DateData } from 'react-native-calendars';

import { Store } from '../../data';
import { filterReminders } from "../../data/actions";
import { YYYYMMDDFormat } from "../../utils/functions/utility";


export const CalendarDateView = () => {

    const currentDate = YYYYMMDDFormat(new Date());
    const [activeDate, setActiveDate] = useState(currentDate);

    const markedDatesMap: Record<string, any> = {
        [currentDate]: {}
    };
    const [markedDates, setMarkedDates] = useState<Record<string, any>>(markedDatesMap)


    const [globalState, dispatch] = useContext(Store);
    const { currentUser, reminderArray } = globalState;
    
    useEffect(() => {
        if (reminderArray?.length) {
            let freshMarkedDates = { ...markedDatesMap };
            const userEvent = {key: 'user', color: 'blue', selectedDotColor: 'blue'};
            const coupleEvent = {key: 'couple', color: 'green', selectedDotColor: 'blue'};
            reminderArray?.forEach((reminder) => {
                const reminderDate = YYYYMMDDFormat(reminder.dateTime);
                const dotsArr = freshMarkedDates?.[reminderDate]?.dots || [];
                if (reminder.userOrCoupleId === currentUser?.id) {
                    freshMarkedDates = {
                        ...freshMarkedDates,
                        [reminderDate]: {
                            ...freshMarkedDates[reminderDate], 
                            dots: [...dotsArr, {...userEvent}]
                        } 
                    }
                } else {
                    freshMarkedDates = {
                        ...freshMarkedDates,
                        [reminderDate]: {
                            ...freshMarkedDates[reminderDate], 
                            dots: [...dotsArr, {...coupleEvent}]
                        } 
                    }

                }
            });
            setMarkedDates(() =>  freshMarkedDates)

        }

    }, [reminderArray]);


    const onPressDate = (date: DateData) => {    
        let newMarkedDates = {...markedDates};
        let newSelectedDateObj = {selected: true, selectedColor: "blue"};
        let oldSelectedDateObj = {selected: false, selectedColor: undefined};
        
        if (newMarkedDates.hasOwnProperty(date.dateString)) {
            
            newSelectedDateObj = {...newMarkedDates[date.dateString], ...newSelectedDateObj};
            newMarkedDates = {
                ...newMarkedDates,
                [activeDate]: {...newMarkedDates[activeDate], ...oldSelectedDateObj}, 
                [date.dateString]: newSelectedDateObj
            }

        } else {
            newMarkedDates = {
                ...newMarkedDates,
                [activeDate]: {...newMarkedDates[activeDate], ...oldSelectedDateObj}, 
                [date.dateString]: newSelectedDateObj
            }
        }
        setActiveDate(YYYYMMDDFormat(new Date(date.dateString)));
        setMarkedDates(() => newMarkedDates);
        filterReminderArray(date);

    }


    const filterReminderArray = (date: DateData) => {
        const filteredReminderArr = reminderArray?.filter((reminder) => {
            const realDate = new Date(reminder?.dateTime);
            const reminderDate = YYYYMMDDFormat(realDate);
            return reminderDate === date.dateString
        }) || [];

        dispatch(filterReminders(filteredReminderArr));
    }


    return (
        <Calendar 
        onDayPress={onPressDate}
        markingType={'multi-dot'}
        markedDates={markedDates}
        />
    )
}