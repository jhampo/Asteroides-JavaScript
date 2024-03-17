export class Label{
    constructor(ctx,position,text,color,font,fontWeight) {
        this.ctx = ctx;
        this.position = position;
        this.text = text;
        this.color = color;
        this.font = font;
        this.fontWeight = fontWeight;
        this.opacity = 1;
    }
    draw(){
        this.ctx.globalAlpha = this.opacity;
        this.ctx.font = `${this.fontWeight} 15px ${this.font}`;
        this.ctx.fillStyle = this.color;
        this.ctx.fillText(this.text,this.position.x-30,this.position.y);
        this.ctx.globalAlpha = 1 ;
    }
    update(){
        this.draw();
        this.opacity -= 0.02;
        this.position.y -= 0.8;
    }
}