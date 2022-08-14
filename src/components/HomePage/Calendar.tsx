import React, { useEffect, useState, useContext } from 'react';
import Parse from 'parse/react-native.js';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

import { Store } from '../../data';
import { retrieveReminders } from '../../data/actions';
import { EventsView } from './styled';
import { getReminders, sortReminders } from './homePageHelper';
import { InPageModal } from '../../common/InPageModal';
import { CloseButton } from '../../common/CustomButton/CloseButton';
import { Loader } from '../../common/Loader/Loader';


export const CalendarView = () => {

    const [loading, setLoading] = useState(true);
    const [createNewVisible, setNewVisible] = useState(false);
    const [currentVisible, setCurrentVisible] = useState(false);
    const [globalState, dispatch] = useContext(Store);


    const { currentUser, reminderArray } = globalState;


    useEffect(() => {

        const remindersArrayRetrieval = async () => {
            if (currentUser && reminderArray === null) {
                const newReminderArray = await getReminders(currentUser);
                const modifiedArray = sortReminders(newReminderArray)
                dispatch(retrieveReminders(modifiedArray));
            }          
            setLoading(false);
        }
        remindersArrayRetrieval();
    }, [])

    //TODO: Setup the elements for new event and current event
    return (
        <>
        <InPageModal
            visible={createNewVisible}>
            <>
                <CloseButton
                handleModal={() => setNewVisible(false)}
                small={true} />
                <Text>Hello</Text>
            </>
        </InPageModal>
        <InPageModal
            visible={currentVisible}>
            <>
                <CloseButton
                handleModal={() => setCurrentVisible(false)}
                small={true} />
                <Text>Bye</Text>
            </>
        </InPageModal>
        <View>
            <Text style={styles.header}>Upcoming Events</Text>
    
            <EventsView horizontal>
                {loading && <Loader fullScreen={false} screenOpacity={'transparent'}/>}
                {reminderArray && reminderArray.map((reminder, idx) => (
                    <EventTab
                    key={idx}
                    handleModal={() => setCurrentVisible(true)} 
                    reminder={reminder}
                    />
                ))}
            </EventsView>

            <TouchableOpacity onPress={() => setNewVisible(true)}>
                <Text style={styles.footer}>Add a New Event</Text>
            </TouchableOpacity>
        </View>
        </>
    )


}

const EventTab = ({reminder, handleModal} : {
    reminder: Parse.Object<Parse.Attributes>;
    handleModal: () => void;
}) => {

    const title: string = reminder.get('title');
    const dateTime: string = reminder.get('dateTime');


    return (
        <TouchableOpacity onPress={handleModal}>
            <View style={styles.body}>
                <Text 
                style={styles.tab} 
                numberOfLines={1}
                ellipsizeMode={"tail"}>
                    {title}
                </Text>
                <Text style={styles.tab}>{dateTime}</Text>
            </View>
        </TouchableOpacity>

    )
}


type textAlignPropType = {
    center: "center";
    auto: "auto";
    left: "left";
    right: "right";
    justify: "justify";
    undefined: undefined;
}

const textAlignProps: textAlignPropType = {
    center: "center",
    auto: "auto",
    left: "left",
    right: "right",
    justify: "justify",
    undefined: undefined,
}

const styles = {
    header: {
        margin: 10,
        marginBottom: -10,
        borderWidth: 1,
        borderRadius: 15,
        textAlign: textAlignProps.center,
        padding: 10,

    },

    body: {
        marginRight: 10,
        borderWidth: 0,
        borderRadius: 15,
        textAlign: textAlignProps.center,
        padding: 10,
        justifyContent: textAlignProps.center,
        
    },

    tab: {

        borderWidth: 1,
        textAlign: textAlignProps.center,
        padding: 10,
        width: 150,
  
    },

    footer: {
        margin: 10,
        marginTop: -10,
        borderWidth: 1,
        borderRadius: 15,
        textAlign: textAlignProps.center,
        padding: 10,
    }
};


