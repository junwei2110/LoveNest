import React, { useEffect, useState, useContext } from 'react';
import Parse from 'parse/react-native.js';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ViewStyle, TextStyle } from 'react-native';

import { Store } from '../../data';
import { retrieveReminders } from '../../data/actions';
import { EventsView } from './styled';
import { getReminders, sortReminders } from './homePageHelper';
import { EventModal, GlobalReminderObj } from './EventModal';
import { InPageModal } from '../../common/InPageModal';
import { CloseButton } from '../../common/CustomButton/CloseButton';
import { Loader } from '../../common/Loader/Loader';


export const CalendarView = () => {

    const [loading, setLoading] = useState(true);
    const [createNewVisible, setNewVisible] = useState(false);
    const [currentVisible, setCurrentVisible] = useState(false);
    const [currentRem, setCurrentRem] = useState<GlobalReminderObj | null>(null);
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
    }, []);


    const handleCurrentEvent = (reminder: GlobalReminderObj) => {
        setCurrentVisible(true);
        setCurrentRem(reminder);

    }

    return (
        <>
        <InPageModal
            visible={createNewVisible}
            size={90}>
            <>
                <CloseButton
                handleModal={() => setNewVisible(false)}
                small={true} />
                <EventModal reminder={null} />
            </>
        </InPageModal>
        <InPageModal
            visible={currentVisible}
            size={90}>           
            <>
                <CloseButton
                handleModal={() => setCurrentVisible(false)}
                small={true} />
                <EventModal 
                reminder={currentRem} 
                setModalVisible={setCurrentVisible} />
            </>
        </InPageModal>
        <View style={styles.overallContainer as TextStyle}>
            <Text style={styles.header as TextStyle}>Upcoming Events</Text>
            <EventsView>
                {loading && <Loader fullScreen={false} screenOpacity={'transparent'}/>}
                {reminderArray?.length &&
                    reminderArray.map((reminder, idx) => (
                        <EventTab
                        key={idx}
                        handleModal={() => handleCurrentEvent(reminder)} 
                        reminder={reminder}
                        />
                ))}
                {/*Add an icon above the text */}
                {!reminderArray?.length && !loading &&
                    <Text>Oh it seems like you do not have any upcoming Events</Text>
                }
            </EventsView>

            <TouchableOpacity onPress={() => setNewVisible(true)}>
                <Text style={styles.footer as TextStyle}>Add a New Event</Text>
            </TouchableOpacity>
        </View>
        </>
    )


}

const EventTab = ({reminder, handleModal} : {
    reminder: GlobalReminderObj;
    handleModal: () => void;
}) => {

    const title: string = reminder?.title;
    const dateTime: string = reminder?.dateTime?.toDateString();


    return (
        <TouchableOpacity onPress={handleModal}>
            <View 
            style={styles.body as ViewStyle}>
                <Text 
                style={styles.tabTitle as TextStyle} 
                numberOfLines={1}
                ellipsizeMode={"tail"}>
                    {title}
                </Text>
                <Text 
                style={styles.tabDate as TextStyle} 
                numberOfLines={1}>
                    {dateTime}
                </Text>
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
    overallContainer: {
        height: "45%",
        borderRadius: 15,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 1,
        backgroundColor: "#fec8c1"
    },
    header: {
        textAlign: textAlignProps.center,
        padding: 10,
        fontWeight: "bold",
    },

    body: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        margin: 10,
        borderWidth: 1,
        borderRadius: 50,
        textAlign: textAlignProps.center,
        backgroundColor: "white"

        
    },

    tabTitle: {
        borderWidth: 0,
        textAlign: textAlignProps.left,
        padding: 15,
        paddingLeft: 30,
        width: 200,
        overflow: "hidden",
        borderRightWidth: 1,
        borderStyle: "dashed",
        borderColor: "rgba(0, 0, 0, 0.3)"
  
    },

    tabDate: {
        borderWidth: 0,
        textAlign: textAlignProps.center,
        width: 150,
        overflow: "hidden",
        padding: 15,
  
    },

    footer: {
        margin: 10,
        marginTop: -10,
        borderWidth: 1,
        borderRadius: 15,
        textAlign: textAlignProps.center,
        padding: 10,
        backgroundColor: "#fe9c8f",
        fontWeight: "bold",
        
    }
};


