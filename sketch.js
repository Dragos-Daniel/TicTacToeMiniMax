let board = [
    ['','',''],
    ['','',''],
    ['','','']
];
let ai = 'X';
let human ='O';

let currentPlayer = human;

function setup() {
    createCanvas(400,400);
    w = width/3;
    h = height/3;
    bestMove();
}

function equals3(a,b,c) {
  return (a == b && b == c && a != '');
}
function checkWinner() {
  let winType = null;
  let winner = null;
  var position = 0;
  //orizontal
  for(let i = 0; i<3 ; i++) {
    if(equals3(board[i][0],board[i][1],board[i][2])){
      winner = board[i][0];
      winType = 'horiz';
      position = i;
    }
  }
  //vertical
  for(let i = 0; i<3 ; i++) {
    if(equals3(board[0][i],board[1][i],board[2][i])){
      winner = board[0][i];
      winType = 'vert';
      position =i;
    }
  }
  
  //diagonal
  if(equals3(board[0][0],board[1][1],board[2][2])){
    winner = board[0][0];
    winType = 'primDiag';
  }
  
  if(equals3(board[2][0],board[1][1],board[0][2])){
    winner = board[2][0];
    winType = '2Diag';
  }
  let openSpots = 0;
  
  for(let i = 0; i<3 ;i++){
    for(let j = 0; j<3; j++){
      if(board[i][j] == ''){
        openSpots++;
      }
    }
  }
  if(winner==null && openSpots == 0) {
    return ['Tie','Tie',-1];
  }else {
    return [winner,winType,position];
  }
}


function mousePressed() {
  if (currentPlayer == human) {
    //Human makes turn
    let i = floor(mouseX / w );
    let j = floor(mouseY / h );
    //Valid Turn
    if(board[i][j] == ''){
      board[i][j] = human;
      currentPlayer = ai;
      bestMove();
    }
  }
}

function bestMove() {
  // AI to make its turn
  let bestScore = -Infinity;
  var move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Is the spot available?
      if (board[i][j] == '') {
        board[i][j] = ai;
        let score = minimax(board, 0, false);
        board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }
  board[move.i][move.j] = ai;
  currentPlayer = human;
}

let scores = {
  X: 10,
  O: -10,
  Tie: 0
};

function minimax(board, depth, isMaximizing) {
  let result = checkWinner()[0];
  if (result != null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = ai;
          let score = minimax(board, depth + 1, false);
          board[i][j] = '';
          bestScore = max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = human;
          let score = minimax(board, depth + 1, true);
          board[i][j] = '';
          bestScore = min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
  return 1;
}

function draw() {
    background(255);
    frameRate(5);
    let w = width / 3;
    let h = height / 3;
    //desenare tabla
    line(w, 0, w, height);
    line(w*2, 0, w*2, height);
    line(0, h, width, h );
    line(0, h*2, width, h*2 );
    
    //desenare simbol jucator  
    for ( let j =0; j<3; j++){
        for(let i=0;i<3;i++) {
            let x = w * i + w/2 ;
            let y = h * j + h/2;
            let spot = board[i][j];
            textSize(32);
            let r = w/4;
            strokeWeight(4);
            if(spot == human) {
              noFill();
              ellipse(x,y,r*2);
            }else if(spot == ai) {
              let xr = w/4;
              line(x-xr, y-r, x + r, y+r);
              line(x+r, y-r, x-r, y + r);
            }
        }
    }
  let result =checkWinner()[0];
  let type = checkWinner()[1];
  var poz = checkWinner()[2];
  for(let i = 0; i<3; i++){
    if(result=="Tie"){
      break;
    }
    if(result == board[2][0] && type == '2Diag'){
      stroke('red');
      line(width,0,0,height);
    }
    
    else if(result == board[0][0] && type == 'primDiag'){
      stroke('red');
      line(0,0,width,width);
    }
    else if(result == board[poz][0] && type == 'horiz'){
      console.log("if horiz");
      if(poz == 0){
          stroke('red');
          line(width/6,0,width/6,height);
      }
      if(poz == 1){
          stroke('red');
          line(width/2,0,width/2,height);
      }
      if(poz == 2){
          stroke('red');
          line(5*width/6,0,5*width/6,height);
      }
      break;
      
    }
    else if(result == board[0][poz] && type == 'vert'){
      console.log("if vert");
      if(poz == 0){
          stroke('red');
          line(0,height/6,width,height/6);
      }
      if(poz == 1){
          stroke('red');
          line(0,height/2,width,height/2);
      }
      if(poz == 2){
          stroke('red');
          line(0,5*height/6,width,5*height/6);
      }
      break;
      
    }
    
    
  }
  if( result != null ){
    noLoop();
    console.log(result);
    let resultP = createP('');
    resultP.style('font-size','32pt').style('color','#FF0000').style('text-align','center');
    if(result == 'Tie'){
      resultP.html('Tie!');
    
    }else {
      resultP.html(`${result} wins!`);
    }
  } 
}
