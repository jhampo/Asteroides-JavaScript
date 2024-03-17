import { Object } from "./object.js";
import { Projectile } from "./projectile.js"
export class Ship{
    constructor(ctx,spritesheet,canvas) {
        this.ctx = ctx;
        this.spritesheet = spritesheet;
        this.image = new Object(spritesheet,{x:442,y:193},126,107,0.4);
        this.imageEff = new Object(spritesheet,{x:1113,y:458},16,126,0.4);
        this.position = {x:200,y:200};
        this.canvas = canvas;
        this.speed = 0;
        this.projectiles = [];
        this.keys = {
            A:false,
            D:false,
            W:false,
            shoot:true
        }
        this.angle = 0;
        this.keyboard();
    }
    collisionCanvas(){
       if(this.position.x - this.image.radio > this.canvas.width){
            this.position.x = 0;
       }
       if(this.position.x + this.image.radio < 0){
            this.position.x = this.canvas.width;
       }
       if(this.position.y - this.image.radio > this.canvas.height){
            this.position.y = 0;
       }
       if(this.position.y + this.image.radio < 0){
            this.position.y = this.canvas.height;
       }
    }
    draw(){
        this.ctx.save();

        this.ctx.translate(this.position.x,this.position.y);
        this.ctx.rotate(this.angle);
        this.ctx.translate(-this.position.x,-this.position.y);
        if(this.keys.W){
            this.imageEff.draw(this.ctx,{x:this.position.x-12,y:this.position.y+40});
            this.imageEff.draw(this.ctx,{x:this.position.x+12,y:this.position.y+40});
        }
        this.image.draw(this.ctx,this.position);
        this.ctx.restore();
 
    }   
    move(){
        if(this.keys.D) this.angle+=0.06;
        if(this.keys.A) this.angle-=0.06;

        if(this.keys.W){
            this.speed += 0.9;
            if(this.speed>=4.5) this.speed = 4.5;
        }
        if(!this.keys.W){
            this.speed -= 0.09;
            if(this.speed<=0) this.speed = 0;
        }
        this.position.x += Math.cos(this.angle-Math.PI/2) * this.speed;
        this.position.y += Math.sin(this.angle-Math.PI/2) * this.speed;
    }
    updateProjectiles(boolean){
        this.projectiles.forEach((projectile,i)=>{
            projectile.update(boolean);
            if(projectile.collision(this.canvas)){
                setTimeout(()=>{
                    this.projectiles.splice(i,1);
                },0);
            }
        });
    }
    hitBox(){
        this.ctx.beginPath();
        this.ctx.arc(this.position.x,this.position.y,this.image.radio,0,2 * Math.PI);
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 2 ;
        this.ctx.stroke();
    }
    update(boolean){
        this.updateProjectiles(boolean);
        this.draw();
        if(boolean) this.hitBox();
        this.move();
        this.collisionCanvas();
    }
    keyboard(){
        document.addEventListener("keydown",(e)=>{
            if(e.key==="a" || e.key === "A"){
                this.keys.A = true;
            }
            if(e.key==="d" || e.key === "D"){
                this.keys.D = true;
            }
            if(e.key==="w" || e.key === "W"){
                this.keys.W = true;
            }
            if(e.key === "ArrowUp" && this.keys.shoot){
                this.projectiles.push(
                    new Projectile(
                        this.ctx,
                        this.spritesheet,
                        { 
                            x:this.position.x+Math.cos(this.angle)*14,
                            y:this.position.y+Math.sin(this.angle)*14
                        },
                        this.angle
                        ),
                    new Projectile(
                        this.ctx,
                        this.spritesheet,
                        { 
                            x:this.position.x-Math.cos(this.angle)*14,
                            y:this.position.y-Math.sin(this.angle)*14
                        },
                        this.angle
                        )
                );
                this.keys.shoot = false;
            }
        });
        document.addEventListener("keyup",(e)=>{
            if(e.key==="a" || e.key === "A"){
                this.keys.A = false;
            }
            if(e.key==="d" || e.key === "D"){
                this.keys.D = false;
            }
            if(e.key==="w" || e.key === "W"){
                this.keys.W = false;
            }
            if(e.key === "ArrowUp"){
                this.keys.shoot = true;
            }
        });
    }
}