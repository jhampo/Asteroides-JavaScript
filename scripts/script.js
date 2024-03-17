import {Object} from './object.js'
import { Ship } from './ship.js';
import { Asteroid } from './asteroid.js';
import { Label } from './label.js';
import { Enemy } from './enemy.js';
import { Star } from './star.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const spritesheet = document.getElementById("spritesheet");
const font = window.getComputedStyle(document.body).fontFamily;
const fontWeight =  window.getComputedStyle(document.body).fontWeight;
const menu = document.querySelector(".menu");
const score = document.querySelector(".score");
const btnMenu = document.querySelector(".play-game");
canvas.width = 900;
canvas.height = 600;
let hitBox = false;
let menuStatus = true;
let play = false;
let scoreCount = 0;

const ship = new Ship(ctx,spritesheet,canvas);
const asteroids = [];
const labels = [];
const enemys = [];
const projectilesEnemys = [];
const stars = [];

btnMenu.addEventListener("click",()=>{
    init();
});
function gameOver(){
    hitBox = true;
    play = false;
    setTimeout(()=>{
        menu.style.display = "flex";
        menuStatus = true;
    },1500);
}
function init(){
    hitBox = false;
    asteroids.length = 0;
    labels.length = 0;
    enemys.length = 0;
    projectilesEnemys.length = 0;
    ship.position = {x:200,y:200};
    ship.projectiles.length = 0;
    ship.angle = 0;
    ship.speed = 0;
    menu.style.display = "none";
    menuStatus = false;
    play = true;
    scoreCount =0;
    score.innerHTML = scoreCount;
}
function createStars(){
    for(let i = 0; i<5; i++){
        let star = new Star(
            ctx,
            canvas,
            {
                x:Math.random() * (canvas.width),
                y:Math.random() * (canvas.height)
            },
            Math.random() * (1.5 - 1) + 1,
            1
        );
        stars.push(star);
    }
    for(let i = 0; i<45; i++){
        let star = new Star(
            ctx,
            canvas,
            {
                x:Math.random() * (canvas.width),
                y:Math.random() * (canvas.height)
            },
            Math.random() * (1.5 - 1) + 1,
            2
        );
        stars.push(star);
    }
}
function generateEnemys(){
    setInterval(()=>{
        let enemy = new Enemy(ctx,spritesheet,canvas,ship);
        enemy.generatePosition(canvas);
        enemys.push(enemy);
        setTimeout(()=>{
            enemy.death = true;
        },3000);
    },7000);
}
function collision(object1,object2){
    let v1 = object1.position;
    let v2 = object2.position;

    let v3 = {
        x:v1.x-v2.x,
        y:v1.y-v2.y
    }

    let distance = Math.sqrt(v3.x*v3.x + v3.y*v3.y);

    if(distance < object1.image.radio + object2.image.radio){
        return true;
    }
    return false;
}
function createMeteors(position){
    let count = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
    for(let i=0; i< count; i++){
        let meteor = new Asteroid(ctx,spritesheet,position,3);
        meteor.death = true;
        asteroids.push(meteor);
    }
}
function collisionObjects(){
    for(let j = 0; j < asteroids.length ; j++){
        if( collision(asteroids[j],ship)){
            gameOver();
        }
    }
    for(let i = 0; i< enemys.length;i++){
        if( collision(enemys[i],ship)){
            gameOver();
        }
    }
    for(let i = 0; i< projectilesEnemys.length; i++){
        if( collision(projectilesEnemys[i],ship) ){
            gameOver();
        }
    }
    loop1:
    for(let i = 0; i< ship.projectiles.length; i++){
        for(let j = 0; j < enemys.length; j++){
            if(collision(ship.projectiles[i],enemys[j])){
                setTimeout(()=>{
                    let text = new Label(ctx,enemys[j].position,"+20 SCORE","#36AAE9",font,fontWeight);
                    labels.push(text);
                    ship.projectiles.splice(i,1);
                    enemys.splice(j,1);
                    scoreCount += 20;
                    score.innerHTML = scoreCount;
                },0);
                break loop1;
            }
        }
    }
    loop2:
    for(let i = 0; i< ship.projectiles.length; i++){
        for(let j = 0; j < asteroids.length ; j++){
            if( collision(ship.projectiles[i],asteroids[j]) ){
                setTimeout(()=>{
                    if(asteroids[j].type === 1){
                        let text = new Label(ctx,asteroids[j].position,"+10 SCORE","#5CCB5F",font,fontWeight);
                        labels.push(text);
                        ship.projectiles.splice(i,1);
                        asteroids.splice(j,1);
                        scoreCount += 10;
                        score.innerHTML = scoreCount;
                    }
                    else if(asteroids[j].type === 2){
                        createMeteors(asteroids[j].position);
                        ship.projectiles.splice(i,1);
                        asteroids.splice(j,1);
                    }
                    else{
                        let text = new Label(ctx,asteroids[j].position,"+5 SCORE","white",font,fontWeight);
                        labels.push(text);
                        ship.projectiles.splice(i,1);
                        asteroids.splice(j,1);
                        scoreCount += 5;
                        score.innerHTML = scoreCount;
                    }
                   
                },0);
                break loop2;
            }
        }
    }
}
function generateAsteroids(){
    setInterval(()=>{
        let type = Math.floor(Math.random() * (2)) + 1;
        let asteroid = new Asteroid(ctx,spritesheet,{x:0,y:0},type);
        asteroid.generatePosition(canvas);
        asteroids.push(asteroid);
        setTimeout(()=>{
            asteroid.death = true;
        },3000);
    },500);
}
function background(){
    ctx.fillStyle = "#130000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    stars.forEach((star)=>{
        star.update();
    });
}
function updateObjects(){
    ship.update(hitBox);
    asteroids.forEach((asteroid,i)=>{
        asteroid.update(hitBox);
        if(asteroid.collision(canvas)){
            setTimeout(()=>{
                asteroids.splice(i,1);
            },0);     
        }
    });
    labels.forEach((label,i)=>{
        label.update();
        if(label.opacity<=0){
            labels.splice(i,1);
        }
    });

    projectilesEnemys.forEach((projectile)=>{
        projectile.update(hitBox);
    });
    enemys.forEach((enemy,i)=>{
        enemy.update(hitBox);
        enemy.createProjectile(projectilesEnemys);
        if( enemy.collision(canvas)){
            setTimeout(()=>{
                enemys.splice(i,1);
            },0);
        }
    });
}
function update(){
    
    if(menuStatus){
        background();
    }
    else if(play){
        background();
        collisionObjects();
        updateObjects();
    }
    requestAnimationFrame(update);
}
update();
generateAsteroids();
generateEnemys();
createStars();
