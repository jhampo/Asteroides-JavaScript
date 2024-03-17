export class Star{
    constructor(ctx,canvas,position,radio,type){
        this.ctx = ctx;
        this.canvas = canvas;
        this.position = position;
        this.radio = radio;
        this.radio2 = radio;
        this.type = type;
        this.value = 0.02;
    }
    draw(){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.position.x,this.position.y,this.radio2,0,2*Math.PI);
        this.ctx.fillStyle = "white";
        this.ctx.shadowColor = "white";
        this.ctx.shadowBlur = 2;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }
    update(){
        this.draw();
        if(this.type===2){
            this.radio2 -= this.value;
            if(this.radio2 <= 0.1){
                this.position.x = Math.random() * this.canvas.width;
                this.position.y = Math.random() * this.canvas.height;
                this.value *= -1;
            }
            if(this.radio2 >= this.radio){
                this.value *= -1;
            }
        }
    }
}