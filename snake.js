const Food = function(){
  this.x=0;
  this.y=0;
  this.foodSwallowed = 0;
};

Food.prototype.getFoodCoords = function() {
  return {x:this.x,y:this.y};
};

Food.prototype.setFoodCoords = function(x,y){
  this.x = x;
  this.y = y;
}

Food.prototype.generateFoodCoordinate = function(lowerLimit,upperLimit){
  lowerLimit = Math.ceil(lowerLimit);
  upperLimit = Math.floor(upperLimit);
  return Math.floor(Math.random() * (upperLimit - lowerLimit)) + lowerLimit;
};

const Snake = function () {
  this.snakeBodyCoords = [];
  this.snakeLength = 0;
  this.snakePartIds = [];
  this.currentMove = "right";
  this.initial = "snakeHead";
}


let snake = new Snake();
let food = new Food();

const assignFoodCoords = function () {
  let xCoordinate = food.generateFoodCoordinate(165,1282);
  let yCoordinate = food.generateFoodCoordinate(100,565);
  food.setFoodCoords(xCoordinate,yCoordinate);
};

const moveSnakeUp = function(){
  snake.currentMove = "up";
  let snakeBodyStyle=document.getElementById("snakeHead").style;
  let topPosition = snakeBodyStyle.top||"100px";
  let position = +topPosition.slice(0,topPosition.length-2) - 1;
  snakeBodyStyle.top=position.toString()+"px";
  swallowFoodIfReady();
  if(snake.snakeLength>0){
    followHead();
  }
  alertIfGameOver(97,570,position);
};

const moveSnakeRight = function(){
  snake.currentMove = "right";
  let snakeBodyStyle=document.getElementById("snakeHead").style;
  let leftPosition = snakeBodyStyle.left||"163px";
  let position = +leftPosition.slice(0,leftPosition.length-2) + 1;
  snakeBodyStyle.left=position.toString()+"px";
  swallowFoodIfReady();
  alertIfGameOver(163,1285,position);
  if(snake.snakeLength>0){
    followHead();
  }
};

const moveSnakeLeft = function(){
  snake.currentMove = "left";
  let snakeBodyStyle=document.getElementById("snakeHead").style;
  let leftPosition = snakeBodyStyle.left;//||"1241px";
  let position = +leftPosition.slice(0,leftPosition.length-2) - 1;
  snakeBodyStyle.left=position.toString()+"px";
  swallowFoodIfReady();
  if(snake.snakeLength>0){
    followHead();
  }
  alertIfGameOver(163,1285,position);
};

const moveSnakeDown = function(){
  snake.currentMove = "down";
  let snakeBodyStyle=document.getElementById("snakeHead").style;
  let topPosition = snakeBodyStyle.top||"100px";
  let position = +topPosition.slice(0,topPosition.length-2) + 1;
  snakeBodyStyle.top=position+"px";
  swallowFoodIfReady();
  if(snake.snakeLength>0){
    followHead();
  }
  alertIfGameOver(98,570,position);
};

const getSnakeHeadCoords = function(id){
  let snakeHead = document.getElementById(id).style;
  let leftPosition = snakeHead.left;
  let topPosition = snakeHead.top;
  return {
    x : +leftPosition.slice(0,leftPosition.length-2),
    y: +topPosition.slice(0,topPosition.length-2)
  }
}

const alertIfGameOver = function(lowerLimit,upperLimit,position){
  if(!isInRange(lowerLimit,upperLimit,position)){
    gameOver();
  }
};

const gameOver = function() {
  let over = document.getElementById('_scoreBoard');
  over.innerText=`Game Over! Your score is ${food.foodSwallowed}`
  clearInterval(currentMove);
  let restart = document.getElementById('restart');
  restart.style.visibility="visible";
  restart.onclick=function(){location.reload();};
}

const isInRange = function(lowerLimit,upperLimit,number){
  return number>lowerLimit&&number<upperLimit;
};

let currentMove = 0;

const moveSnake = function(event){
  let actions={
    "ArrowRight":moveSnakeRight,
    "ArrowUp":moveSnakeUp,
    "ArrowDown":moveSnakeDown,
    "ArrowLeft":moveSnakeLeft
  }
  clearInterval(currentMove);
  let move = actions[event.key];
  return currentMove=setInterval(move,1);
};

const swallowFoodIfReady = function () {
  if(isSnakeReadyToEat()){
    swallowFood();
  }
}

const isSnakeReadyToEat = function(){
  let snakeCoords = getSnakeHeadCoords("snakeHead");
  let foodCoords = food.getFoodCoords();
  let condition1 = isInRange(snakeCoords.x-3,snakeCoords.x+30,foodCoords.x);
  let condition2 = isInRange(snakeCoords.y-3,snakeCoords.y+30,foodCoords.y);
  return condition1 && condition2;
}

const swallowFood = function(){
  food.foodSwallowed+=1;
  document.getElementById("_scoreBoard").innerText = `Score: ${food.foodSwallowed}`;
  placeFood();
  for (var i = 0; i < 10; i++) {
    growSnake();
  }
};

const growSnake = function(){
  let snakeBody = document.getElementById("snakeBody");
  let cell = snakeBody.insertCell(snake.snakeLength);

  cell.id =`${snake.snakeLength}`;
  let snakeHeadCoords = getSnakeHeadCoords(snake.initial);
  cell.style= `left:"${snakeHeadCoords.x}px";
               top:"${snakeHeadCoords.y}px";
               position:absolute`;
  cell.background=`black`;
  snake.snakePartIds.push(snake.snakeLength);
  snake.snakeLength+=1;
  snake.initial = snake.snakeLength-1;
};

const followHead = function(){
  snake.snakeBodyCoords = [];
  let snakeHead = document.getElementById("snakeHead").style;
  let headCoords = getSnakeHeadCoords("snakeHead");
  snake.snakeBodyCoords.push(headCoords);
  snake.snakePartIds.forEach(function(element){
    let snakeBodyPartCoords = getSnakeHeadCoords(`${element}`);
    snake.snakeBodyCoords.push(snakeBodyPartCoords);
  });
  snake.snakeBodyCoords.pop();
  snake.snakePartIds.forEach(function(element){
    let snakeBodyPart = document.getElementById(`${element}`).style;
    let snakeBodyPartCoords = snake.snakeBodyCoords[element];
    snakeBodyPart.left = `${snakeBodyPartCoords.x}px`;
    snakeBodyPart.top = `${snakeBodyPartCoords.y}px`;
  });
  handleSnakeBitten();
}

const beginGame = function(){
  let restart = document.getElementById('restart');
  restart.style.visibility="hidden";
  placeFood();
  let screen = document.getElementById("screen");
  screen.onkeydown=moveSnake;
};

const placeFood = function(){
  assignFoodCoords();
  let coords = food.getFoodCoords();
  document.getElementById("food").style.left = `${coords.x}px`;
  document.getElementById("food").style.top = `${coords.y}px`;
}
const hasSnakeBittenItself = function(){
  let headCoords = getSnakeHeadCoords("snakeHead");
  let headCoordsValue = {
    up: {
      x1 : headCoords.x,
      y1 : headCoords.y,
      x2 : headCoords.x+30,
      y2 : headCoords.y
    },
    down:{
      x1 : headCoords.x,
      y1 : headCoords.y+30,
      x2 : headCoords.x+30,
      y2 : headCoords.y+30
    },
    right:{
      x1 : headCoords.x+30,
      y1 : headCoords.y,
      x2 : headCoords.x+30,
      y2 : headCoords.y+30
    },
    left:{
      x1 : headCoords.x,
      y1 : headCoords.y,
      x2 : headCoords.x,
      y2 : headCoords.y+30
    }
  };
  headCoords = headCoordsValue[snake.currentMove];
  let snakePartIds = snake.snakePartIds;
  return snakePartIds.some(function(element,index){
    if(index > 150){
    let partArea = getSnakeHeadCoords(`${element}`);
    let condition1 = isInRange(partArea.x,partArea.x+30,headCoords.x1);
    let condition2 = isInRange(partArea.y,partArea.y+30,headCoords.y1);
    let result1 = condition1 && condition2;
    condition1 = isInRange(partArea.x,partArea.x+30,headCoords.x2);
    condition2 = isInRange(partArea.y,partArea.y+30,headCoords.y2);
    let result2 = condition1 && condition2;
    return result1 || result2;
  }else{
    return false;
  }
});
}

const handleSnakeBitten = function () {
  if(hasSnakeBittenItself()){
    gameOver();
  }
}
window.onload=beginGame;
