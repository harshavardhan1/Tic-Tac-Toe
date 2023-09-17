import { useEffect, useReducer, useState } from "react";
import App from "../App/App";
import ChoiceSelector from "../ChoiceSelector/ChoiceSelector";
import Lobby from "../Lobby/Lobby";
import BackButton from "../backButton";
import DarkMode from "../darkMode";
import { closeSocket } from "../App/functions";
function reducer(state,action){
    switch(action.type){
        case 'add_choice':{
            let newState={...state};
            state[action.player].choice=action.choice;
            return newState;
        }
        case 'add_socket':{
            let newState={...state};
            newState[action.player].socket=action.socket;
            return newState;
        }
        default:
            return state;
    }
}
export default function GameInitial(props){
    const [state,dispatch]=useReducer(reducer,{
        gameType:props.choice,
        p_one:{
            choice:''
        },
        p_two:{
            choice:''
        }
    });
    const [game,setGame]=useState(false);
    const [player,setPlayer]=useState('p_one');
    const [choiceSelector,setChoiceSelector]=useState(false);
    const [lobby,setLobby]=useState(false);
    const choiceHandler=(selectedChoice) => {
        dispatch({ type: 'add_choice', player: player, choice: selectedChoice });
        if (props.choice === 'Computer') {
            dispatch({ type: 'add_choice', player: 'p_two', choice: selectedChoice === 'A' ? 'B' : 'A' });
        } else if (props.choice === 'Offline') {
            if (player === 'p_one') {
                setPlayer('p_two');
                return;
            }
        }
        setChoiceSelector(false);
        setPlayer('');
        setGame(true);
    }
    const stopGame=()=>{
        closeSocket({gameData:state});
        props.setChoice('');
        props.setView('dashboard');
    };
    useEffect(()=>{
        if(props.choice === 'Computer' || props.choice === 'Offline'){
            setChoiceSelector(true);
        }else{
            setLobby(true);
        }
    },[]);
    useEffect(()=>{
        let temp=document.getElementById('navBar');
        if(!choiceSelector){
            temp.style.backgroundImage='linear-gradient(90deg,#FFDBDB 0.29%,rgba(255,251,160,0.65) 35.47%,rgba(122,255,89,0.25) 75.07%,rgba(0,194,255,0.36) 99.67%)';
            temp.style.backgroundColor='';
        }else{
            temp.style.backgroundColor='#77C6FF';
            temp.style.backgroundImage='';
        }
    },[choiceSelector]);
    return (
        <div>
            <div id='navBar' className="flex items-center h-[57px] p-[0px_23px] justify-between
                dark:!bg-none
                dark:!bg-[#000]
                w-full
                ">
                <BackButton onClick={stopGame}/>
                <DarkMode />
            </div>
            {choiceSelector && <ChoiceSelector onClick={choiceHandler} player={player} p_one_choice={state['p_one'].choice} />}
            {lobby && <Lobby 
                p_one_choice={state['p_one'].choice} 
                p_two_choice={state['p_two'].choice} 
                dispatch={dispatch} 
                gameChoice={props.choice}
                startGame={()=>{
                    setLobby(false);
                    setGame(true);
                }}
                stopGame={stopGame}
            />}
            {game && <App gameData={state} stopGame={stopGame}/>}
        </div>
    );
}