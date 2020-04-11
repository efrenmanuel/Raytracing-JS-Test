class Character {
    constructor(x, y, fov) {
        this.pos = createVector(x, y);
        this.angle = 0;
        this.fov = fov;
        this.rays = this.calculateVision(detail);
        this.lightPower=10
    }

    show(detail, walls) {
        stroke(255, 255, 255);
        fill(255);
        push();
        ellipse(this.pos.x, this.pos.y, 10);
        pop();


        for (let ray = 0; ray < this.rays.length; ray++) {
            let result = this.isIntersecting(this.rays[ray], walls);
            let pt = result[0];
            let colorWall = result[1];
            //console.log(pt);
            if (pt) {
                stroke(150, 150, 150);
                push();
                line(this.pos.x + this.rays[ray].x * 10, this.pos.y + this.rays[ray].y * 10, pt.x, pt.y);
                pop()

                let distance = pt.z ;
                let maxDistance = sqrt(height*height+width*width);

                let maxAttenuation=100;
                let attenuation=(distance*10/this.lightPower)*maxAttenuation/maxDistance;
                //console.log(attenuation);
                let colorDistanced=color(red(colorWall)-attenuation, green(colorWall)-attenuation, blue(colorWall)-attenuation);
                stroke(colorDistanced);
                fill(colorDistanced);
                push();
                
                // let size=(maxDistance-distance)*height/maxDistance; overcomplicated and bad
                let size=height/(distance/20);
                rect(ray * (width / detail),height+(height-size)/2, width / detail,size);

                
                //line(ray, height + ((height - distance) / 2), ray, height + ((height - distance) / 2) + distance);
                pop();
            }


        }
        stroke(100, 255, 100);
        push();
        line(this.pos.x + p5.Vector.fromAngle(radians(this.angle)).x * 5, this.pos.y + p5.Vector.fromAngle(radians(this.angle)).y * 5, this.pos.x + p5.Vector.fromAngle(radians(this.angle)).x * 15, this.pos.y + p5.Vector.fromAngle(radians(this.angle)).y * 15)
        pop();
    }

    calculateVision(detail) {
        detail = detail;
        let rays = [];
        for (let ray = this.angle - this.fov / 2; ray < this.angle + this.fov / 2; ray += this.fov / detail) {
            //console.log(ray);
            rays.push(p5.Vector.fromAngle(radians(ray)));
        }
        return rays;
    }

    isIntersecting(ray, walls) {

        let x3 = this.pos.x;
        let x4 = this.pos.x + ray.x;


        let y3 = this.pos.y;
        let y4 = this.pos.y + ray.y;

        let lowest = Infinity;
        let point;

        if (ray.x == 1) {
            //console.log(ray);
        }
        let colorWall = color(0);
        for (let wall of walls) {

            let x1 = wall.p1.x;
            let x2 = wall.p2.x;
            let y1 = wall.p1.y;
            let y2 = wall.p2.y;


            let denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
            if (denominator == 0) {
                continue;
            }

            let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
            let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;



            if (0 < t && t < 1 && 0 < u && u < lowest) {
                lowest = u;
                //console.log(u, t,lowest);
                //calculate Distance from camera plane:
                let cameraPlaneAngle = this.angle - 90;
                let camera = new Wall(this.pos.x-p5.Vector.fromAngle(radians(cameraPlaneAngle)).x * 10, this.pos.y- p5.Vector.fromAngle(radians(cameraPlaneAngle)).y * 10, this.pos.x + p5.Vector.fromAngle(radians(cameraPlaneAngle)).x * 10, this.pos.y + p5.Vector.fromAngle(radians(cameraPlaneAngle)).y * 10, 255);
                camera.show();
                point = createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
                point.z = this.calculateDistance(camera, point);
                colorWall = wall.wallColor;
                //colorWall=this.calculateDistance(camera, point);
            }

        }
        if (point == null) {
            console.log(ray);
        }

        return [point, colorWall];
    }

    calculateDistance(camera, collision) {
        let y1 = camera.p1.y;
        let y2 = camera.p2.y;
        let x1 = camera.p1.x;
        let x2 = camera.p2.x;

        let x0 = collision.x;
        let y0 = collision.y;

        let distance=abs((y2-y1)*x0-(x2-x1)*y0+x2*y1-y2*x1)/sqrt(pow(y2-y1,2)+pow(x2-x1,2))
        return distance;
    }

    move(walk, strafe) {
        this.pos.x += sin(radians(-this.angle + 90)) * 2 * walk;

        this.pos.y += cos(radians(-this.angle + 90)) * 2 * walk;

        this.pos.x += sin(radians(-this.angle )) * 2 * strafe;

        this.pos.y += cos(radians(-this.angle )) * 2 * strafe;
    }
}