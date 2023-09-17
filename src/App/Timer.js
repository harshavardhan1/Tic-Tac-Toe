import React from 'react';
import { useState,useEffect } from 'react';
export default function Timer(props){
    const [time, setTime] = useState(props.duration);
    const [timerId, setTimerId] = useState('');
    useEffect(() => {
        if (time === 0) {
            props.timeOut();
            clearInterval(timerId);
        }
    }, [time]);
    useEffect(() => {
        if (props.visibility) {
            setTime(props.duration);
            let id = setInterval(() => {
                setTime((time) => time - 1);
            }, 1000);
            setTimerId(id);
            return () => {
                clearInterval(id);
            };
        } else {
            clearInterval(timerId);
        }
    }, [props.visibility]);
    return (
        <div style={{ visibility: props.visibility ? 'visible' : 'hidden' }} className={props.className}>{time}</div>
    );
};