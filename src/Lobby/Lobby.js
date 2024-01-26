import { useEffect, useState } from "react";
import ChoiceSelector from "../ChoiceSelector/ChoiceSelector";
import { socketURL } from "../Dashboard/data";
import Spinner from "../Spinner";
import Timer from '../App/Timer';
import Dialog from "../Dialog/Dialog";
const forPlayerBox='flex flex-col justify-center items-center';
const forChoice='text-[#FF00C7] text-[90px] leading-[100px] p-[0px_14px] border-[5px] border-solid border-[darkviolet] font-bold dark:border-[aliceblue] dark:text-[aquamarine]';
const forPlayerText='mb-[10px] text-[mediumblue] text-[30px] font-bold dark:text-[aliceblue]';
const forSpinner='flex items-center justify-center h-[110px] w-[103px]';
export default function Lobby(props) {
    const [choiceSelector, setChoiceSelector] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [showTimer,setShowTimer]=useState(false);
    const [dialogText,setDialogText]=useState('');
    const [buttonStatus,setButtonStatus]=useState(false);
    const handleDialogClose=()=>{
        if(dialogText.includes('Expired') || dialogText.includes('Full')){
            props.stopGame();
        }else{
            setDialogText('');
        }
    };
    const handleCreateLobby = (event, socket) => {
        let data = JSON.parse(event.data);
        if (data.event === 2) {
            setInputValue(data.token);
            socket.token = data.token;
        } else if (data.event === 9) {
            props.dispatch({ type: 'add_choice', player: 'p_two', choice: data['p_two_choice'] });
            setShowTimer(true);
            setButtonStatus(true);
        }
    };
    const handleJoinLobby = (event, socket) => {
        let data = JSON.parse(event.data);
        if (data.event === 9) {
            socket.token = inputValue;
            setShowTimer(true);
            setButtonStatus(true);
        }
        else if(data.event === 5){
            setDialogText('Sorry The Lobby is Expired');
        }
    };
    const handleJoinLobbyToken = () => {
        if(props.gameChoice === 'Create Lobby' || !inputValue)
            return;
        let socket = new WebSocket(socketURL);
        socket.onopen = () => socket.send(JSON.stringify({ event: 3, token: inputValue }));
        socket.onmessage = (event) => {
            let data = JSON.parse(event.data);
            if(data.event === 5){
                setDialogText('Sorry The Lobby is Expired');
                socket.close();
                return;
            }else if(data.event === 6){
                setDialogText('Sorry the Lobby you want to join is Full');
                socket.close();
                return;
            }else{
                setDialogText('Sorry Invalid Token');
                socket.close();
                return;
            }
        };
    };
    const handleSocketClose=()=>{
        setDialogText('Sorry the Lobby time is Expired Please create another Lobby');
    };
    const choiceHandler = (selectedChoice) => {
        props.dispatch({ type: 'add_choice', player: props.gameChoice === 'Create Lobby' ? 'p_one' : 'p_two', choice: selectedChoice });
        let socket = new WebSocket(socketURL);
        props.dispatch({ type: 'add_socket', player: props.gameChoice === 'Create Lobby' ? 'p_one' : 'p_two', socket: socket });
        if (props.gameChoice === 'Create Lobby') {
            socket.onopen = () => socket.send(JSON.stringify({ event: 1, choice: selectedChoice }));
            socket.onmessage = (event) => handleCreateLobby(event, socket);
            socket.onclose=handleSocketClose;
        } else {
            socket.onopen = () => socket.send(JSON.stringify({ event: 11, token: inputValue, choice: selectedChoice }));
            socket.onmessage = (event) => handleJoinLobby(event, socket);
        }
        setChoiceSelector(false);
    };
    useEffect(() => {
        if (props.gameChoice === 'Create Lobby') {
            setChoiceSelector(true);
        }
        return;
    }, []);
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
        <>
            {choiceSelector && <ChoiceSelector
                onClick={choiceHandler}
                player={props.gameChoice === 'Create Lobby' ? 'p_one' : 'p_two'}
                p_one_choice={props['p_one_choice']}
            />}
            {!choiceSelector && <div className="
            w-full
            h-[100vh]
            bg-[linear-gradient(90deg,#FFDBDB_0.29%,rgba(255,251,160,0.65)_35.47%,rgba(122,255,89,0.25)_75.07%,rgba(0,194,255,0.36)_99.67%)]
            flex flex-col items-center dark:bg-none dark:bg-[#000]
            ">
                <div 
                    style={{visibility:props.gameChoice === 'Create Lobby'?'visible':'hidden'}}
                    className="
                    mt-[89px] 
                    md:text-[26px]
                    sm:text-[10px]
                    lg:text-[30px]
                    text-[#A61C1C]
                    font-bold dark:text-[aliceblue]
                ">PLEASE ASK TO FRIEND TO JOIN LOBBY BY USING BELOW TOKEN</div>
                <input
                    type={'text'}
                    className="
                    mt-[19px]
                    text-[28px]
                    text-center
                    w-[166px]
                    font-[800]
                    text-[darkred]
                    bg-[azure]
                    tracking-[8px]
                    rounded-[6px]
                "
                    disabled={props.gameChoice === 'Create Lobby' ? true : false}
                    value={inputValue}
                    onChange={(event) => {
                        if(props.gameChoice === 'Create Lobby')
                            return;
                        setInputValue(event.target.value);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            handleJoinLobbyToken();
                        }
                    }}
                />
                <button disabled={buttonStatus} style={{visibility:props.gameChoice === 'Join Lobby'?'visible':'hidden'}} 
                    onClick={handleJoinLobbyToken}
                    className='mt-[16px]
                        text-[17px] text-[rgb(0,0,139)] p-[3px]
                        w-[69px] font-bold
                        bg-[linear-gradient(127deg,#EDB9F1_0%,rgba(95,150,234,0.41)_58.67%,rgba(0,240,255,0.63)_100%)]
                        hover:shadow-[0px_3px_6px_1px_rgba(177,58,180,0.26)]
                        dark:bg-[linear-gradient(127deg,#EDB9F1_0%,_#5F96EA_58.67%,#00F0FF_100%)]
                        dark:hover:shadow-[0px_0px_6px_1px_rgba(255,255,255,0.78)]
                        rounded-[11px]
                    '
                >Join</button>
                <div className="flex justify-between w-[90%] mt-[41px]">
                <div className={forPlayerBox}>
                        <div className={forPlayerText}>P ONE</div>
                        {props['p_one_choice']
                            ?<div className={forChoice}>{props['p_one_choice']}</div>
                            :<div className={forChoice+' '+forSpinner}><Spinner radius={'65px'} borderHeight={'4px'} borderColor={'currentColor'} loaderColor={'blue'}/></div>
                        }
                    </div>
                    <div className={forPlayerBox}><Timer duration={5} visibility={showTimer} className="font-bold text-[blue] text-[70px]" timeOut={()=>{props.startGame()}}/></div>
                    <div className={forPlayerBox}>
                        <div className={forPlayerText}>P TWO</div>
                        {props['p_two_choice']
                            ?<div className={forChoice}>{props['p_two_choice']}</div>
                            :<div className={forChoice+' '+forSpinner}><Spinner radius={'65px'} borderHeight={'4px'} borderColor={'currentColor'} loaderColor={'blue'}/></div>
                        }
                    </div>
                </div>
            </div>}
            <Dialog
            show={dialogText} 
            onDismiss={handleDialogClose}>
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
        </>
    );
}