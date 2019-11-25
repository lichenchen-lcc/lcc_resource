const { ccclass, property } = cc._decorator;

@ccclass
export default class Doodle extends cc.Component {

    private reactivity: number = 0.5;
    private graphics: cc.Graphics;
    private nodes: Array<TempNode> = new Array<TempNode>();
    private mouse: cc.Vec2 = new cc.Vec2(0, 0);
    private color: cc.Color = new cc.Color(255, 0, 0, 255);
    private cycle: number = 90;//周期
    private input: boolean = false;
    private collisionDis: number = 10;
    private maxRadius: number = 50;
    private bouncePoint:cc.Vec2 = null;

    onEnable() {
        cc.log("onEnable");
        this.graphics = this.getComponent(cc.Graphics);
        this.createBezierNodes();

        // let bbb: b2ChainShape = new b2ChainShape();
        // let bb:cc.PhysicsBoxCollider

    }

    private createBezierNodes() {

        for (let quantity = 0, len = 16; quantity < len; quantity++) {
            let theta = Math.PI * 2 * quantity / len;

            let x = this.node.position.x + 0 * Math.cos(theta);
            let y = this.node.position.y + 0 * Math.sin(theta);

            let node = new TempNode();
            node.x = x;
            node.y = y;
            node.vx = 0;
            node.vy = 0;
            node.lastX = x;
            node.lastY = y;
            node.min = 50;
            node.max = 55;
            node.disturb = 3;//扰乱
            node.orbit = 2;
            node.angle = Math.random() * Math.PI * 2;
            node.speed = 0.05 + Math.random() * 0.05;
            node.theta = theta;
            node.radius = this.maxRadius;
            node.isBounce = false;
            this.nodes.push(node);
        }

        this.initNodes();
    }
    update(dt) {
        // cc.log("this.rotation:" + this.node.rotation);
        // this.updateNodes();
        this.softCicle();
        // this.node.position.x += dt;
        this.render();
    }

    getIndex(point: cc.Vec2): number {
        let distance = null;
        let tempIndex = 0;
        for (let index = 0; index < this.nodes.length; index++) {
            // let worldPoint = this.node.convertToWorldSpaceAR(cc.v2(this.nodes[index].x, this.nodes[index].y));
            let temp = point.sub(cc.v2(this.nodes[index].x, this.nodes[index].y));
            if (distance) {
                if (temp.mag() < distance) {
                    tempIndex = index;
                }
            }
            distance = temp.mag();
        }
        return tempIndex;
    }

    softCicle() {
        // cc.log("this.getIndex(points) = %d ,point: x=%f,y=%f", this.getIndex(tempPoint), tempPoint.x, tempPoint.y);
        if (this.bouncePoint){
            for (let node of this.nodes) {
                if (node.isBounce) {
                    node.radius = this.maxRadius;
                    node.x = Math.cos(node.angle) * node.radius;
                    node.y = Math.sin(node.angle) * node.radius;
                }
            }

            let index = Math.floor(this.nodes.length / 4 * 3) - 1;
            index = this.getIndex(this.bouncePoint) ;
            let node = this.nodes[index];
            node.radius = this.maxRadius - this.collisionDis;
            node.x = Math.cos(node.angle) * node.radius;
            node.y = Math.sin(node.angle) * node.radius;
            node.isBounce = true;

            //上一个点
            let preIndex = index - 1 < 0 ? this.nodes.length - 1 : index - 1;
            let preNode = this.nodes[index];
            preNode.radius = this.maxRadius - this.collisionDis * 0.7;
            preNode.x = Math.cos(preNode.angle) * preNode.radius;
            preNode.y = Math.sin(preNode.angle) * preNode.radius;
            preNode.isBounce = true;

            //下一个点
            let nextIndex = index + 1 > this.nodes.length - 1 ? 0 : index + 1;
            let nextNode = this.nodes[nextIndex];
            nextNode.radius = this.maxRadius - this.collisionDis * 0.7;
            nextNode.x = Math.cos(nextNode.angle) * nextNode.radius;
            nextNode.y = Math.sin(nextNode.angle) * nextNode.radius;
            nextNode.isBounce = true;
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        let worldManifold = contact.getWorldManifold();
        let points: Array<cc.Vec2> = worldManifold.points;
        this.bouncePoint = this.node.convertToNodeSpaceAR(points[0]);
    }

    onPreSolve(contact, selfCollider, otherCollider) {
        let worldManifold = contact.getWorldManifold();
        let points: Array<cc.Vec2> = worldManifold.points;
        this.bouncePoint = this.node.convertToNodeSpaceAR(points[0]);
    }

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve(contact, selfCollider, otherCollider) {
        let worldManifold = contact.getWorldManifold();
        let points: Array<cc.Vec2> = worldManifold.points;
        this.bouncePoint = this.node.convertToNodeSpaceAR(points[0]);
    }

    onEndContact(contact, selfCollider, otherCollider) {
        
    }

    private initNodes() {

        this.nodes.forEach((node, index, nodes) => {

            node.angle = 2 * Math.PI / this.nodes.length * index;
            node.x = Math.cos(node.angle) * node.radius;
            node.y = Math.sin(node.angle) * node.radius;
            // cc.log("index= " + index + " x = " + node.x + " y = " + node.y);
        });
    }
    private updateNodes() {
        let nodes = this.nodes;

        var ease = 0.01, friction = 0.98;

        // cc.log("-------------------------------------------");
        nodes.forEach((node, index, nodes) => {
            // node.lastX += (this.node.position.x + node.disturb * Math.cos(node.theta) - node.lastX) * 0.08;
            // node.lastY += (this.node.position.y + node.disturb * Math.sin(node.theta) - node.lastY) * 0.08;
            node.lastX += (node.disturb * Math.cos(node.theta) - node.lastX) * 0.08;
            node.lastY += (node.disturb * Math.sin(node.theta) - node.lastY) * 0.08;
            // Motion
            node.x += ((node.lastX + Math.cos(node.angle) * node.orbit) - node.x) * 0.08;
            node.y += ((node.lastY + Math.sin(node.angle) * node.orbit) - node.y) * 0.08;
            // cc.log(" x = " + node.x + " y = " + node.y);
            // Ease
            node.vx += (node.min - node.disturb) * ease;
            // Friction
            node.vx *= friction;
            node.disturb += node.vx;

            if (this.input)
                node.disturb += (node.max - node.disturb) * this.reactivity;
            node.angle += node.speed;
        });
    }

    private render() {
        let nodes = this.nodes;
        let graphics = this.graphics;

        graphics.clear();

        let currentIndex, nextIndex, xc, yc;
        currentIndex = nodes[nodes.length - 1];
        nextIndex = nodes[0];

        xc = (currentIndex.x + nextIndex.x) / 2;
        yc = (currentIndex.y + nextIndex.y) / 2;

        // xc += this.node.position.x;
        // yc += this.node.position.y;

        graphics.moveTo(xc, yc);
        // graphics.lineCap = cc.Graphics.LineCap.SQUARE;
        // graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
        graphics.strokeColor = cc.Color.RED;//线段颜色
        graphics.fillColor = cc.Color.YELLOW;
        graphics.lineWidth = 5

        // Draw through N points
        for (var N = 0; N < nodes.length; N++) {
            currentIndex = nodes[N];
            nextIndex = N + 1 > nodes.length - 1 ? nodes[0] : nodes[N + 1];
            // nextIndex = N - 1 < 0 ? nodes[nodes.length - 1] : nodes[N - 1];
            //取中点
            xc = (currentIndex.x + nextIndex.x) / 2;
            yc = (currentIndex.y + nextIndex.y) / 2;

            graphics.quadraticCurveTo(currentIndex.x, currentIndex.y, xc, yc);
        }
        graphics.fill();
        // graphics.stroke();//绘制线段
    }

}

class Ripple {
    x: number = 0;
    y: number = 0;
    reactivity: number = 0;
    fade: number = 0;
}

class TempNode {
    x: number = 0;
    y: number = 0;
    vx: number = 0;
    vy: number = 0;

    lastX: number = 0;
    lastY: number = 0;

    min: number = 0;
    max: number = 0;
    disturb: number = 0;

    orbit: number = 0;
    angle: number = 0;
    speed: number = 0;

    radius: number = 0;
    theta: any;

    isBounce: boolean = false;
}
