import Timer from './Timer';
import { callWin,checkMatch,closeSocket } from './functions';
import { useEffect, useReducer,useState } from 'react';
import Dialog from '../Dialog/Dialog';
import JSConfetti from 'js-confetti';
const jsConfetti=new JSConfetti();
function togglePlayer(player){
    let res='';
    if(player.includes('p_one')){
        res='p_two';
    }else{
        res='p_one'
    }
    return player.replace(player,res);
}
const reducer=(state,action)=>{
    switch(action.type){
        case 'updateGrid':{
            let newState={...state};
            newState.grid[action.index]=action.props.gameData[state.player].choice;
            newState.moves++;
            action.gridClick(newState);
            return newState;
        }
        case 'updatePlayer':{
            let newState={...state};
            newState.player=togglePlayer(newState.player);
            return newState;
        }
        case 'emptyPlayer':{
            let newState={...state};
            newState.player='';
            return newState;
        }
        default:{
            return state;
        }
    }
};
const handleMove=(event,dispatch,gridClick,props)=>{
    let data=JSON.parse(event.data);
    if(data.event === 10){
        dispatch({type:'updateGrid',gridClick:gridClick,props:props,index:data.index});
    }
};
export default function App(props){
    const [state,dispatch]=useReducer(reducer,{grid:['', '', '', '', '', '', '', '', ''],player:'p_one',moves:0});
    const [dialogText,setDialogText]=useState('');
    const showWinDialog=(player,choice)=>{
        if(props.gameData.gameType === 'Computer' || props.gameData.gameType === 'Offline'){
            setDialogText(`Player ${choice} Won`);
        }else{
            if(props.gameData.gameType === 'Create Lobby'){
                setDialogText(player === 'p_two'?'You Lost':'You Won');
            }else{
                setDialogText(player === 'p_one'?'You Lost':'You Won'); 
            } 
            closeSocket(props);
        }
    };
    const showDrawDialog=()=>{
        setDialogText('This Match is a Draw');
        closeSocket(props);
    };
    const gridClick = (newState) => {
        //const row = (index / 3) + 1, col = (index % 3) + 1;
        let res = checkMatch(newState.grid, newState.moves);
        if (res) {
            callWin(res);
            showWinDialog(state.player,props.gameData[state.player].choice);
            closeSocket(props);
            dispatch({type:'emptyPlayer'})
            return;
        }
        if (newState.moves + 1 === 9) {
            showDrawDialog();
            closeSocket(props);
            dispatch({type:'emptyPlayer'});
            return;
        }
        dispatch({type:'updatePlayer'});
    }
    const checkCondition=(player)=>{
        if(props.gameData.gameType === 'Create Lobby' || props.gameData.gameType === 'Join Lobby'){
            return player === state.player;
        }
        return false;
    };
    const handleDialogClose=()=>{
        if(dialogText.includes('Won') || dialogText.includes('Lost') || dialogText.includes('Draw')){
            props.stopGame();
        }
    };
    const handleTimeOut=(player)=>{
        if(props.gameData.gameType === 'Create Lobby'){
            setDialogText(player === 'p_one'?'You Lost beacuse timer out':'You Won because oppsoite player timer out');
        }else{
            setDialogText(player === 'p_two'?'You Lost beacuse timer out':'You Won because oppsoite player timer out'); 
        } 
        closeSocket(props);
    };
    useEffect(() => {
        document.getElementById('win').style.display = 'none';
        if(props.gameData.gameType === 'Create Lobby'){
            props.gameData['p_one'].socket.onmessage=(event)=>handleMove(event,dispatch,gridClick,props);
        }else if(props.gameData.gameType === 'Join Lobby'){
            props.gameData['p_two'].socket.onmessage=(event)=>handleMove(event,dispatch,gridClick,props);
        }
        return ()=>{
            closeSocket(props);
        };
    }, []);
    useEffect(()=>{
        if(dialogText.includes('Won')){
            jsConfetti.addConfetti({
                confettiNumber:1700
            });
        }
    },[dialogText]);
    useEffect(()=>{
        if(props.gameData.gameType === 'Computer' && state.player === 'p_two'){
            for(let i=0;i<state.grid.length;++i){
                if(!state.grid[i]){
                    setTimeout(()=>{
                        dispatch({type:'updateGrid',index:i,gridClick:gridClick,props:props});
                    },1000);
                    return;
                }
            }
        }
    },[state.player]);
    return (
        <div className='appContainer
        bg-[linear-gradient(90deg,#FFDBDB_0.29%,rgba(255,251,160,0.65)_35.47%,rgba(122,255,89,0.25)_75.07%,rgba(0,194,255,0.36)_99.67%)]
        dark:bg-none
        dark:bg-black
            '>
            <div style={{visibility:state.player?'visible':'hidden'}} className='font-bold text-[blue] dark:text-[white]'>PLAYER {props.gameData[state.player]?.choice} TURN</div>
            <Timer duration={180} visibility={checkCondition('p_one')} className={'p_one_timer'} timeOut={()=>{handleTimeOut('p_one')}}/>
            <div className='gridContainer'>
                {state.grid.map((eachValue, index) => {
                    return <div key={index} onClick={() =>{
                        if(eachValue || (state.player === 'p_two' && props.gameData.gameType === 'Computer')){
                            return;
                        }
                        if(props.gameData.gameType === 'Create Lobby' && state.player === 'p_two'){
                            return;
                        }
                        if(props.gameData.gameType === 'Join Lobby' && state.player === 'p_one'){
                            return;
                        }
                        if(props.gameData.gameType === 'Create Lobby'){
                            props.gameData['p_one'].socket.send(JSON.stringify({event:10,index:index,token:props.gameData['p_one'].socket.token}));
                        }else if(props.gameData.gameType === 'Join Lobby'){
                            props.gameData['p_two'].socket.send(JSON.stringify({event:10,index:index,token:props.gameData['p_two'].socket.token}));
                        }
                        dispatch({type:'updateGrid',index:index,gridClick:gridClick,props:props})
                    } } className='eachGrid'>{eachValue}
                    </div>
                })}
                <hr id='win'></hr>
            </div>
            <Timer duration={180} visibility={checkCondition('p_two')} className={'p_two_timer'} timeOut={()=>{handleTimeOut('p_two')}}/>
            <Dialog
            show={dialogText} 
            onDismiss={()=>{jsConfetti.addConfetti()}}>
                <div className='relative bg-[aliceblue] p-[51px] rounded-[9px] text-[blue] text-[30px] flex flex-col'>
                {dialogText}
                <span className="absolute top-[3px] right-[13px] font-bold text-[crimson] hover:text-[33px] cursor-pointer"
                    onClick={handleDialogClose}
                >X</span>
                <span 
                    className="self-center bg-[darksalmon] p-[0px_9px] rounded-[9px] font-bold hover:text-[darksalmon] hover:bg-[blue] cursor-pointer"
                    onClick={handleDialogClose}
                >OK</span>
                </div>
            </Dialog>
        </div>
    );
};