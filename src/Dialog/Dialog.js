import { useEffect, useState ,useRef } from "react";
import styles from './Dialog.module.scss';
export default function Dialog(props){
    const [show,setShow]=useState(false);
    useEffect(()=>{
        setShow(props.show);
        if(props.show){
            document.body.style.overflowY="hidden";
        }else{
            document.body.style.overflowY="visible";
        }
    },[props.show]);
    return (
        <>
        {show
        ?<div className={`${styles.container} ${props.className?props.className:''}`} style={props.style} onClick={(event)=>{
            let targetTrue=event.target.className.includes(styles.container);
            if(targetTrue){
                if(props.onDismiss){
                    props.onDismiss(event);
                }
            }
        }}>
            {props.children}
        </div>:<></>
        }
        </>
    );
}