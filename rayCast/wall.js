class Wall{
    
    constructor(x1,y1,x2,y2, wallColor){
        this.p1=createVector(x1, y1);
        this.p2=createVector(x2, y2);
        this.wallColor=wallColor;
        
        this.texture=new Array (16);
        for (let y=0;y<this.texture.length;y++){
            this.texture[y]=new Array(16);
            for (let x=0;x<this.texture[y].length;x++){
                this.texture[y][x]=int(Math.random()*100);
            }
        }
        //console.log(this.texture);
    }


    show(){
        stroke(this.wallColor);
        push();
        line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        pop();
    }

    getColor(y, height, x){
        //console.log(y*this.texture.length/height);
        //console.log(this.texture[int(y/height*this.texture.length)])
        let attenuation=this.texture[int(y/height*this.texture.length)][int(x*this.texture[int(y/height*this.texture.length)].length)];
        return color(red(this.wallColor)-attenuation, green(this.wallColor)-attenuation, blue(this.wallColor)-attenuation);
    }
   
}