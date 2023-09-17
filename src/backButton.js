import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
export default function BackButton(props){
    const [beat,setBeat]=useState(false);
    return (
        <FontAwesomeIcon 
            onClick={props.onClick}
            onMouseEnter={()=>setBeat(true)}
            onMouseLeave={()=>setBeat(false)}
            icon={faLeftLong} 
            beat={beat}
            className="
            text-[45px]
            text-[#ff0088]
            "
            title="Go Back"
        />
    );
}