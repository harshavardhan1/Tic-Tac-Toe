import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
const toggleMode=(mode)=>mode === 'Light'?'Dark':'Light';
export default function DarkMode(props){
    const [mode,setMode]=useState(document.documentElement.classList.contains('dark')?'Dark':'Light');
    useEffect(()=>{
        if(mode === 'Light'){
            document.documentElement.classList.remove('dark');
        }else{
            document.documentElement.classList.add('dark');
        }
    },[mode]);
    return (
        <FontAwesomeIcon 
            title={`Switch to ${mode === 'Light'?'Dark Mode':'Normal Mode'}`}
            className={props.className}
            icon={faCircleHalfStroke} 
            size='2xl' 
            style={{color:mode === 'Dark'?"yellow":'grey'}} 
            onClick={()=>setMode(toggleMode)} 
        />
    );
}