import { useEffect } from "react";

export default function ChoiceSelector(props) {
    return (
        <>
        <div className="pt-[34px] h-[76px] bg-[#77C6FF] dark:bg-[#000] text-[#0029BB] font-bold text-center md:text-[36px] sm:text-[27px] dark:text-[white]">PLEASE SELECT {props.player.replace('_',' ').toUpperCase()}</div>
        <div className="
                bg-[#77C6FF]
                dark:bg-[#000]
                w-full
                h-[calc(100vh_-_133px)]
                flex
                flex-col
                items-center
                overflow-auto
            " 
            style={props.style}>
            <div 
                className="flex flex-wrap sm:w-[100%] md:w-[90%] items-center justify-center"
            >
                {(() => {
                    let res = [];
                    for (let i = 65; i < 91; ++i) {
                        const temp = String.fromCharCode(i)
                        if (props['p_one_choice'] !== temp)
                            res.push(String.fromCharCode(i));
                    }
                    return res.map((eachSymbol, index) => <div 
                        className="text-[90px] text-[#CDFFAE] font-semibold w-[78px] h-[100px] flex items-center justify-center border-[#77C6FF] border-[5px] border-solid rounded-[11px] leading-[100px] hover:border-[#9E00FF] m-[0px_7px] p-[0px_7px] cursor-pointer dark:border-[#000] dark:hover:border-[#9E00FF]"
                        key={index} onClick={() => props.onClick(eachSymbol)}>{eachSymbol}</div>);
                })()}
            </div>
        </div>
        </>
    );
}