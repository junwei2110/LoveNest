import React, { MutableRefObject } from 'react';

//Debounce function only triggers after a certain timing happens
//If the function triggers again before the timer hits the target, the timer will be reset

export const debounce = (cb: (...arg: any[]) => void, delay: number, timerRef: MutableRefObject<NodeJS.Timeout | null | undefined>) => {

    return (...args: any[]) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        
        timerRef.current = setTimeout(() => cb(...args), delay);
        console.log(timerRef.current);
    }
    
}

// Debounce has an timedID variable and returns a function that clears the timedID and creates a new timedID
// When you add a debounced function to a listener, the following occurs:
/*
onPress = debounced(cb, delay)
onPress will trigger the cb after the specified delay

If the cb is triggered before the delay time is up, within the cb, the clearTimeout is called which removes the currently in active cb
The timedID is the hidden variable that is active when the debounce function is activated. This is the reference for the cb
*/