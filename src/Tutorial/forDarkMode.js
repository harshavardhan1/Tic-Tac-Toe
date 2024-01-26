import { useEffect, useRef } from "react";

export default function DarkModeTutorial(props){
    const docRef=useRef(null);
    useEffect(()=>{
        docRef.current=()=>{props.removeTutorial()};
        document.documentElement.addEventListener('click',docRef.current);
        return ()=>{
            document.documentElement.removeEventListener('click',docRef.current);
        }; 
    },[]);
    return (
        <>
            <div className="absolute 
                w-[60px] 
                h-[60px] 
                shadow-[0px_0px_0px_9999px_rgba(60,60,60,0.6)]
                top-[7px]
                right-[7px]
                rounded-[50%]
            "></div>
            <div className="absolute flex flex-col items-center
            ">
                <span className="text-[23px] font-bold text-[white]">Please press this button to switch to dark mode and vice versa </span>
                <button className="w-fit mt-[19px] font-bold bg-[darkgrey] p-[3px_35px]
                    rounded-[9px] text-[23px] shadow-[0px_0px_5px_3px_white] hover:shadow-[0px_0px_5px_3px_aqua]
                ">Ok</button>
            </div>
            <img className="absolute h-[69px] top-[0px] animate-[toAndFro_1s_linear_0s_infinite_alternate]
            " src={require('../assets/svg/pointingRightFinger.svg').default} />
        </>
    );
}