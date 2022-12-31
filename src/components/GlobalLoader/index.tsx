import React, {useContext} from 'react';
import { Modal } from 'react-native';
import { Loader } from '../../common/Loader/Loader';
import { Store } from '../../data';


export const GlobalLoader = () => {

    const [globalState, dispatch] = useContext(Store);
    const { loading } = globalState;
    console.log("I am loading", loading);

    if (loading) {
        return (
            <Modal transparent={true}>
                <Loader 
                    fullScreen={true}
                    screenOpacity={"translucent"}
                />
            </Modal>
        )
    } else {
        return null;
    }

}
