var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameover, gameoverpng;
var restart, restartpng;

var checkpoint;
var die;
var jump;

var ter, tero_img;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameoverpng = loadImage("gameOver.png");
  restartpng = loadImage("restart.png");
  checkpoint = loadSound("checkpoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  tero_img = loadAnimation("tero1.png","tero2.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-80,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  

  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;

  gameover = createSprite(width/2,height/2-50);
  restart = createSprite(width/2,height/2);
  gameover.addImage("gameover",gameoverpng);
  restart.addImage("restart",restartpng);
  restart.scale = 0.5;
  gameover.scale = 3;
  
  //crear grupos de obstáculos y nubes 
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  teroGroup = new Group();
  
  console.log("Hola" + 5);

  trex.setCollider("circle",0,0,40);
  trex.debug = true;

  score = 0;
}

function draw() {
  background(180);
  text("Puntuación: "+ score, 500,50);
  
  if(gameState === PLAY){
    //mover el suelo
   ground.velocityX = -(4 +3 *score/100);
    gameover.visible = false;
    restart.visible = false;
    score = score + Math.round(frameCount/60);
    if(score >0 && score %100 === 0){
      checkpoint.play();
    }
    if(touches.lenght>0 || keyDown("space")&& trex.y >= 100) {
      trex.velocityY = -13; 
      jump.play();
      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.8
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
    //aparecer las nubes
    spawnClouds();
    
    //aparecer los obstáculos en el suelo
    spawnObstacles();
    spawnTero();
    if(obstaclesGroup.isTouching(trex)){
      die.play();
      gameState = END
    }  
  }

  else if(gameState === END){
    //detener el suelo
    ground.velocityX = 0;
  gameover.visible = true;
  restart.visible = true;
  cloudsGroup.setVelocityXEach(0);
 obstaclesGroup.setVelocityXEach(0);
teroGroup.setVelocityXEach(0);
 obstaclesGroup.setLifetimeEach(-1);
 cloudsGroup.setLifetimeEach(-1);
teroGroup.setLifetimeEach(-1);
 trex.velocityY = 0;
 trex.changeAnimation ("collided",trex_collided);
 if (touches.lenght>0 || keyDown("space")){
  reset();
  touches = [];
}
 if (mousePressedOver(restart)){
  reset ();
    }
  }
  
  


  
  trex.collide(invisibleGround);
  
  drawSprites();
}
function reset (){
gameState = PLAY;
restart.visible = false;
gameover.visible = false;
obstaclesGroup.destroyEach();
cloudsGroup.destroyEach();
teroGroup.destroyEach();
trex.changeAnimation("running",trex_running);
score = 0;
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,height-95,10,40);
   obstacle.velocityX = -(6 + score/100);

   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //escribir aquí el código para aparecer las nubes 
  if (frameCount % 60 === 0) {
     cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar lifetime a la variable
    cloud.lifetime = 160;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar cada nube al grupo
   cloudsGroup.add(cloud);
  }
  
}
    function spawnTero() {
if (frameCount % 60 === 0){
tero = createSprite(600,50,40,10);
tero.y = Math.round(random(10,60));
tero.addAnimation("fly",tero_img);
tero.velocityX=-3;

tero.lifetime = 160;
teroGroup.add(tero);
}
    }