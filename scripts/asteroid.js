import { Object } from "./object.js";
export class Asteroid{
    constructor(ctx,spritesheet,position={x:0,y:0},type=1){
        this.ctx = ctx;
        this.spritesheet = spritesheet;
        this.position = {...position};
        this.rotation = 0;
        this.death = false;
        this.type = type;
        this.image = new Object();
        this.scale = Math.random() * (0.6 - 0.4) + 0.4;
        this.speed = Math.random() * (4 - 3) + 3;
        if(this.type === 3){
            this.scale = Math.random() * (0.3 - 0.15) + 0.15;
            this.speed = Math.random() * (8 - 5) + 5;
        }
        this.angle = (Math.random() * (360)) * Math.PI/180;
        this.createAsteroid();
    }
    createAsteroid(){
        let num = Math.floor(Math.random() * (4)) + 1;
        switch(num){
            case 1:
                //<SubTexture name="spaceMeteors_001.png" x="0" y="621" width="215" height="211"/>
                this.image = new Object(this.spritesheet,{x:0,y:621},215,211,this.scale);
                break;
            case 2:
                //<SubTexture name="spaceMeteors_002.png" x="214" y="832" width="212" height="218"/>
                this.image = new Object(this.spritesheet,{x:214,y:832},212,218,this.scale);
                break;
            case 3:
                //<SubTexture name="spaceMeteors_003.png" x="0" y="832" width="214" height="227"/>
                this.image = new Object(this.spritesheet,{x:0,y:832},214,227,this.scale);
                break;
            case 4:
                //<SubTexture name="spaceMeteors_004.png" x="0" y="400" width="220" height="221"/>
                this.image = new Object(this.spritesheet,{x:0,y:400},220,221,this.scale);
                break;
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
    hitBox(){
        this.ctx.beginPath();
        this.ctx.arc(this.position.x,this.position.y,this.image.radio,0,2 * Math.PI);
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 2 ;
        this.ctx.stroke();
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
    draw(){
        this.ctx.save();

        this.ctx.translate(this.position.x,this.position.y);
        this.ctx.rotate(this.rotation);
        this.ctx.translate(-this.position.x,-this.position.y);
        this.image.draw(this.ctx,this.position);
        this.ctx.restore();
    }
    update(boolean){
        this.draw();
        if(boolean) this.hitBox();
        this.position.x += Math.cos(this.angle)*this.speed;
        this.position.y += Math.sin(this.angle)*this.speed;
        this.rotation += 0.015;
    }
}