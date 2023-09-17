import { useState } from "react";
import Dashboard from "./Dashboard/Dashboard";
import GameInitial from "./GameInitialization/GameInitial";
export default function Home(){
    const [view,setView]=useState('dashboard');
    const [choice,setChoice]=useState('');
    return (
       <>
            {view === 'dashboard' && <Dashboard onClick={(choice)=>{setView('');setChoice(choice)}} />}
            {choice && <GameInitial choice={choice} setChoice={setChoice} setView={setView} />}
       </>
    );
}