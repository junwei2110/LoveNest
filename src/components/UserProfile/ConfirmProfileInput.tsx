import React, { useContext } from 'react';
import { Modal, View, Text, Button, TouchableOpacity, Alert } from 'react-native';
import Parse from "parse/react-native.js";
import messaging from "@react-native-firebase/messaging";
import { useNavigation } from '@react-navigation/native';

import { ProfileInputs, DateObj } from './SetUpTabs';
import { 
    CloseButton, 
    ConfirmationModalOverallView, 
    ConfirmationModalView, 
    ConfirmationText, 
    ConfirmationTextView, 
    DateButtonView, 
    DateSpanView,
    DateTextInput,
    DateTitleView } from './styled';

import { Store } from '../../data';
import { userLoggingEnd, userLoggingInit } from '../../data/actions';




export const ConfirmProfileInput = ({
    modalVisible, 
    handleModal,
    profileInputs,
    partnerObj,
}: {modalVisible: boolean|undefined; 
    handleModal: () => void;
    profileInputs: ProfileInputs;
    partnerObj: Parse.Attributes|null
}) => {

    const [globalState, dispatch] = useContext(Store);
    const {currentUser} = globalState;
    const navigation = useNavigation();

    const handleUpdateProfileFirstTime = async () => {

        if (currentUser) {
            dispatch(userLoggingInit());

            try {
                currentUser.set('firstTimerProfile', false);
                currentUser.set('avatarName', profileInputs.name);
                //currentUser.set('partnerId', profileInputs.partnerId);
                currentUser.set('coupleId', currentUser.id);
                await currentUser.save();

                
                if (partnerObj) {
                    const deviceToken = await messaging().getToken();
                    await Parse.Cloud.run("sendPartnerRequest", {
                        partnerEmail: profileInputs.partnerEmail,
                        userId: currentUser?.id,
                        deviceToken
                    });
                }

                const reminderBdayObj = new Parse.Object('Reminder');
                reminderBdayObj.set('title', profileInputs.bdate.title);
                reminderBdayObj.set('dateTime', profileInputs.bdate.date?.toDateString());
                reminderBdayObj.set('recurrence', profileInputs.bdate.recurrence);
                reminderBdayObj.set('completionStatus', false);
                reminderBdayObj.set('userOrCoupleId', currentUser.id);
                reminderBdayObj.set('userOrCouple', "couple");
                await reminderBdayObj.save();

                const reminderAnnidayObj = new Parse.Object('Reminder');
                reminderAnnidayObj.set('title', profileInputs.annidate.title);
                reminderAnnidayObj.set('dateTime', profileInputs.annidate.date?.toDateString());
                reminderAnnidayObj.set('recurrence', profileInputs.annidate.recurrence);
                reminderAnnidayObj.set('completionStatus', false);
                reminderAnnidayObj.set('userOrCoupleId', currentUser.id);
                reminderAnnidayObj.set('userOrCouple', "couple");
                await reminderAnnidayObj.save();

                profileInputs.importantDates?.forEach(async (dateObj) => {
                    const reminderObj = new Parse.Object('Reminder');
                    reminderObj.set('title', dateObj.title);
                    reminderObj.set('dateTime', dateObj.date?.toDateString());
                    reminderObj.set('recurrence', dateObj.recurrence);
                    reminderObj.set('completionStatus', false);
                    reminderObj.set('userOrCoupleId', currentUser.id);
                    reminderAnnidayObj.set('userOrCouple', "user");

                    await reminderObj.save();
                });

                Alert.alert("Information saved!");
                handleModal();
                dispatch(userLoggingEnd());
                navigation.goBack(); 

            } catch(e: any) {
                dispatch(userLoggingEnd());
                handleModal(); 
                navigation.goBack(); 
                Alert.alert(e.message);
            }
            
        }
    }
    //TODO: Add InPageModal Here
    return(
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}>
            <View style={styles.translucentBG}>      
                <ConfirmationModalOverallView>
                    <TouchableOpacity onPress={handleModal}>
                        <CloseButton
                            small 
                            source={require("../../../assets/BaseApp/close.png")} 
                            />
                    </TouchableOpacity>
                    <Text></Text>
                    <ConfirmationModalView>
                        <ConfirmationTextView>
                            <Text>Your Name:</Text>                            
                            <ConfirmationText 
                                editable={false}
                                selectTextOnFocus={false}
                                placeholder={"Will fill in Later"}>
                                {profileInputs.name}
                            </ConfirmationText>                           
                        </ConfirmationTextView>
                        <Text></Text>
                        <ConfirmationTextView>
                            <Text>Your Partner's Email:</Text>                            
                            <ConfirmationText 
                                editable={false}
                                selectTextOnFocus={false}
                                placeholder={"Will fill in Later"}>
                                {profileInputs.partnerEmail}
                            </ConfirmationText>                           
                        </ConfirmationTextView>
                        <Text></Text>
                        <ConfirmationTextView>
                            <Text>Your Important Dates:</Text>                            
                            <ConfirmDateComponent 
                            dateObj={profileInputs.bdate}
                            />                         
                        </ConfirmationTextView>
                        <ConfirmationTextView>                        
                            <ConfirmDateComponent 
                            dateObj={profileInputs.annidate}
                            />                         
                        </ConfirmationTextView>
                        {profileInputs.importantDates && 
                            profileInputs.importantDates.map((date, idx) => (
                                <ConfirmationTextView key={idx}>                        
                                    <ConfirmDateComponent 
                                    dateObj={date}
                                    />                         
                                </ConfirmationTextView>
                            ))}
                        <Text></Text>
                        <ConfirmationTextView>
                        <Text>-------------- End --------------</Text>
                        </ConfirmationTextView>
                    </ConfirmationModalView>
                    
                    <Text></Text>
                    <Button 
                        title={"Update"}
                        onPress={handleUpdateProfileFirstTime}
                    />
                    <Text></Text>
                </ConfirmationModalOverallView>
            </View>
        </Modal>
    )   
}


const styles = {

    translucentBG: {
        backgroundColor: 'hsla(211, 12%, 48%, 0.8)',
        height: '100%'

    },

    /*

    <CustomButton 
        shape="circle"
        size={30}
        color={"black"} 
        handlePress={handleModal} 
        styleContainer={styles.exitButton} />
    exitButton: {
        backgroundColor: 'transparent',
        position: 'absolute',
        marginTop: 100,
        marginRight: 25,
        marginBottom: 100,
        marginLeft: 25,
        translateY: -15,
        translateX: -15,
        zIndex: 2
      }
    */
}

const ConfirmDateComponent = ({dateObj} : {dateObj: DateObj}) => {
    
    if (!dateObj.date || !dateObj.title ) {
        return null;
    }

    const title = (dateObj.date.toDateString() + " " + dateObj.recurrence) || "";

    return (
        <DateSpanView>
            <DateTitleView>
                <DateTextInput 
                    editable={false}
                    selectTextOnFocus={false}>
                        {dateObj.title}
                </DateTextInput>
                    
            </DateTitleView>
            <DateButtonView>
                <Button
                    title={title}
                    disabled={true}
                />
            </DateButtonView>
        </DateSpanView>
        
    )
}