import { Object } from "./object.js";
import { Projectile } from "./projectile.js";
export class Enemy{
    constructor(ctx,spritesheet,canvas,ship) {
        this.ctx = ctx;
        this.spritesheet = spritesheet;
        //<SubTexture name="spaceShips_006.png" x="662" y="0" width="94" height="148"/>
        this.image = new Object(spritesheet,{x:662,y:0},94,148,0.45);
        //<SubTexture name="spaceParts_031.png" x="998" y="197" width="36" height="76"/>
        this.imagePart = new Object(spritesheet,{x:998,y:197},36,76,0.52);
        this.canvas = canvas;
        this.ship = ship;
        this.position = {x:500,y:200};
        this.angle = 0;
        this.speed = 1;
        this.death = false;
    }
    collision(canvas){
        if((this.position.x - this.image.radio > canvas.width ||
            this.position.x + this.image.radio < 0 ||
            this.position.y - this.image.radio > canvas.height||
            this.position.y + this.image.radio < 0) && this.death
            ){
            return true;
       }
       return false;
    }
    createProjectile(projectiles){
        let num = Math.floor(Math.random() * (50)) + 1;
        if(num===2){
            let projectile = new Projectile(
                this.ctx,
                this.spritesheet,
                { 
                    x:this.position.x+Math.cos(this.angle)*14,
                    y:this.position.y+Math.sin(this.angle)*14
                },
                this.angle + Math.PI/2,
                true
                );  
            projectile.speed = 7;
            projectiles.push(projectile);
        }
    }
    generatePosition(canvas){
        let num = Math.floor(Math.random() * (4)) + 1;
        let x,y;
        switch(num){
            case 1:
                //parte superior
                x =  Math.random() * canvas.width;
                y =  - this.image.height;
                break;
            case 2:
                x= canvas.width+this.image.width;
                y= Math.random() * canvas.height;
                //parte derecha
                break;
            case 3:
                x= -this.image.width;
                y= Math.random() * canvas.height;
                //parte izquierda
                break;
            case 4:
                x= Math.random() * canvas.width;
                y= canvas.height+ this.image.height;
                break;
        }
        this.position = {x:x,y:y};
    }
    draw(){
        this.ctx.save();
        this.ctx.translate(this.position.x,this.position.y);
        this.ctx.rotate(this.angle+ Math.PI/2);
        this.ctx.translate(-this.position.x,-this.position.y);
        this.image.draw(this.ctx,this.position);
        this.imagePart.draw(this.ctx,{x:this.position.x+14,y:this.position.y+16});
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(this.position.x,this.position.y);
        this.ctx.rotate(this.angle+ Math.PI/2);
        this.ctx.scale(-1,1);
        this.ctx.translate(-this.position.x,-this.position.y);
        this.imagePart.draw(this.ctx,{x:this.position.x+14,y:this.position.y+16});
        this.ctx.restore();
    }
    hitBox(){
        this.ctx.beginPath();
        this.ctx.arc(this.position.x,this.position.y,this.image.radio,0,2 * Math.PI);
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 2 ;
        this.ctx.stroke();
    }
    update(boolean){
        this.draw();
        if(boolean) this.hitBox();
        let v1 = {
            x:this.ship.position.x - this.position.x,
            y:this.ship.position.y - this.position.y
        }
        let mag = Math.sqrt(v1.x*v1.x + v1.y*v1.y);
        let vU = {
            x:v1.x/mag,
            y:v1.y/mag
        }
        this.angle = Math.atan2(vU.y,vU.x);
        this.position.x += vU.x * this.speed,
        this.position.y += vU.y * this.speed;
    }
}