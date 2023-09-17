export const callWin = (res) => {
    let hrTag = document.getElementById('win');
    hrTag.style.display = 'block';
    hrTag.classList.add(res);
    /* if(res === 'two_diagonal'){
      hrTag.style.marginTop='0px';
      hrTag.style.marginLeft='0px';
    } */
};
export const checkMatch = (grid, moves) => {
    if (moves < 5) {
        return;
    }
    //check for 1st row
    if (grid[0] ? (grid[1] ? (grid[0] === grid[1] && grid[2] && grid[2] === grid[1]) : false) : false) {
        return 'one_row'
    }
    //check for 2nd row
    if (grid[3] ? (grid[4] ? (grid[3] === grid[4] && grid[5] && grid[5] === grid[4]) : false) : false) {
        return 'two_row'
    }
    //check for 3rd row
    if (grid[6] ? (grid[7] ? (grid[6] === grid[7] && grid[8] && grid[8] === grid[7]) : false) : false) {
        return 'three_row'
    }
    //check for 1st column
    if (grid[0] ? (grid[3] ? (grid[3] === grid[0] && grid[6] && grid[6] === grid[3]) : false) : false) {
        return 'one_column';
    }
    //check for 2nd column
    if (grid[1] ? (grid[4] ? (grid[1] === grid[4] && grid[7] && grid[7] === grid[4]) : false) : false) {
        return 'two_column';
    }
    //check for 3rd column
    if (grid[2] ? (grid[5] ? (grid[2] === grid[5] && grid[8] && grid[8] === grid[5]) : false) : false) {
        return 'three_column';
    }
    //check for 1st diagonal
    if (grid[0] ? (grid[4] ? (grid[0] === grid[4] && grid[8] && grid[8] === grid[4]) : false) : false) {
        return 'one_diagonal';
    }
    //check for 2nd diagonal
    if (grid[2] ? (grid[4] ? (grid[4] === grid[2] && grid[6] && grid[6] === grid[4]) : false) : false) {
        return 'two_diagonal';
    }
};
export const closeSocket=(props)=>{
    if(props.gameData.gameType === 'Offline' || props.gameData.gameType === 'Computer'){
        return;
    }
    props.gameData[props.gameData.gameType === 'Create Lobby'?'p_one':'p_two'].socket?.close();
};