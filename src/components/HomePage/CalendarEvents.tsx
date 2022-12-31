import React, { useEffect, useState, useContext } from 'react';
import Parse from 'parse/react-native.js';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle, TextProps } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign"
import IconIonicons from "react-native-vector-icons/Ionicons"

import { Store } from '../../data';
import { retrieveReminders, clearfilterReminders } from '../../data/actions';
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


    const { currentUser, reminderArray, filteredArray, useFilteredArray } = globalState;


    useEffect(() => {
        const remindersArrayRetrieval = async () => {
            if (currentUser) {
                const newReminderArray = await getReminders(currentUser);
                const modifiedArray = sortReminders(newReminderArray)
                dispatch(retrieveReminders(modifiedArray));
            }          
            setLoading(false);
        }
        remindersArrayRetrieval();

    }, [currentUser]);


    const handleCurrentEvent = (reminder: GlobalReminderObj) => {
        setCurrentVisible(true);
        setCurrentRem(reminder);

    }

    const clearFilters = () => {
        dispatch(clearfilterReminders());
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
                
            <View style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <TouchableOpacity 
                style={{ justifyContent: "center", alignItems: "flex-start"}}
                onPress={clearFilters}
                >
                    {!useFilteredArray ? 
                        <IconIonicons name="chevron-down" size={24} color="white" />
                    : <IconIonicons name="chevron-up" size={24} color="white" />}
                </TouchableOpacity>    
                <Text style={styles.header as TextStyle}>UPCOMING</Text>
            </View>

            <EventsView>
                {loading && <Loader fullScreen={false} screenOpacity={'transparent'} />}
                {!useFilteredArray && reminderArray?.length ?
                    reminderArray.map((reminder, idx) => (
                        <EventTab
                        key={idx}
                        handleModal={() => handleCurrentEvent(reminder)} 
                        reminder={reminder}
                        userId={currentUser?.id}
                        />
                )): null}
                {useFilteredArray && filteredArray?.length ?
                    filteredArray.map((reminder, idx) => (
                        <EventTab
                        key={idx}
                        handleModal={() => handleCurrentEvent(reminder)} 
                        reminder={reminder}
                        userId={currentUser?.id}
                        />
                )) : null}
                {!useFilteredArray && !reminderArray?.length && !loading &&
                    <Text style={styles.emptyText as TextProps}>
                        Oh it seems like you do not have any upcoming events
                    </Text>
                }
                {useFilteredArray && !filteredArray?.length && !loading &&
                    <Text style={styles.emptyText as TextProps}>
                        Oh it seems like you do not have any upcoming events
                    </Text>
                }
            </EventsView>

            <TouchableOpacity 
            onPress={() => setNewVisible(true)}>
                <View style={styles.footer as ViewStyle}>
                    <Icon name="pluscircleo" size={20} color="white" />
                    
                    <Text style={{fontSize: 10, fontWeight: "bold", color: "white"}}>
                        Add a New Event
                    </Text>
                </View>                 
            </TouchableOpacity>
        </View>
        </>
    )


}

const EventTab = ({reminder, handleModal, userId} : {
    reminder: GlobalReminderObj;
    handleModal: () => void;
    userId?: string;
}) => {

    const title: string = reminder?.title;
    const dateTime: string = reminder?.dateTime?.toDateString();
    const userOrCouple: string = reminder?.userOrCoupleId;

    const assignUserOrCouple = () => {

        if (userOrCouple === userId) {
            return "User"
        } else {
            return "Couple"
        }
    }
    


    return (
        <TouchableOpacity onPress={handleModal}>
            <View style={styles.eventTabBody as ViewStyle}>
                <View 
                style={styles.titleDatebody as ViewStyle}>
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

                <View style={styles.userCouplebody}>
                    <Text style={styles.tabUserCoupleType as TextStyle}>
                        {assignUserOrCouple()}
                    </Text>
                </View>
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
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderWidth: 1,
        flex: 1,
        alignSelf:'stretch',
        backgroundColor: "#f0516f"
    },
    header: {
        textAlign: textAlignProps.center,
        alignItems: "center",
        padding: 10,
        fontWeight: "bold",
        color: "white",
        fontSize: 20,
    },

    eventTabBody: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "100%",
        paddingHorizontal: "5%",
        marginVertical: 15,
    },

    titleDatebody: {
        display: "flex",
        flexDirection: "column",
        flex: 4,
        margin: 10,
        //borderWidth: 1,
        // borderRadius: 50,        
        //backgroundColor: "white"

        
    },

    tabTitle: {
        //borderWidth: 0,
        //textAlign: textAlignProps.left,
        //padding: 15,
        //paddingLeft: 30,
        //width: 200,
        overflow: "hidden",
        // borderRightWidth: 1,
        // borderStyle: "dashed",
        // borderColor: "rgba(0, 0, 0, 0.3)",
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
  
    },

    tabDate: {
        borderWidth: 0,
        //textAlign: textAlignProps.center,
        //width: 150,
        overflow: "hidden",
        //padding: 15,
        color: "white",
        fontSize: 10,
        fontWeight: "normal"
  
    },

    userCouplebody: {
        flex: 1,
        margin: 10,
        //borderWidth: 1,
        // borderRadius: 50,
        //backgroundColor: "white"  
    },

    tabUserCoupleType: {
        borderWidth: 0,
        //textAlign: textAlignProps.center,
        //width: 150,
        //padding: 15,
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: textAlignProps.center,
  
    },

    emptyText: {
        fontSize: 16,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },

    footer: {
        alignItems: "center",
        marginBottom: 10        
    }
};


