import { useEffect, useState } from "react";
import DarkModeTutorial from "../Tutorial/forDarkMode";
import DarkMode from "../darkMode";
export default function Dashboard(props){
    const [showTutorial,setShowTutorial]=useState(null);
    useEffect(()=>{
       if(localStorage.getItem('showDarkModeTutorial') !== 'true')
            setShowTutorial(true);
    },[]);
    return (
        <div className="flex flex-col w-full h-[100vh] items-center justify-center bg-[aliceblue] dark:bg-[#000]">
            <DarkMode className="absolute top-[21px] right-[21px]"/>
            { showTutorial && <DarkModeTutorial removeTutorial={()=>{setShowTutorial(false);localStorage.setItem('showDarkModeTutorial',true)}}/>}
            {[['Computer',"Play with Computer"],['Offline','Play with teammate adjacent'],['Create Lobby','Play with online friend'],['Join Lobby','Play with online friend']].map((each,index)=>{
                return <button
                    key={index}
                    title={each[1]}
                    onClick={()=>props.onClick(each[0])}
                    className="
                        bg-[linear-gradient(127deg,#EDB9F1_0%,rgba(95,150,234,0.41)_58.67%,rgba(0,240,255,0.63)_100%)] 
                        h-[41px] w-[185px] 
                        m-[9px] hover:shadow-[0px_3px_6px_1px_rgba(177,58,180,0.26)]
                        text-[darkblue]
                        text-[21px]
                        font-bold
                        dark:bg-[linear-gradient(127deg,#EDB9F1_0%,_#5F96EA_58.67%,#00F0FF_100%)]
                        dark:hover:shadow-[0px_0px_6px_1px_rgba(255,255,255,0.78)]
                        rounded-[11px]
                        "
                >{each[0]}</button>;
            })}
        </div>
    );
}