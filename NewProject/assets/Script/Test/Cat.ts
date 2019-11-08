
const { ccclass, property } = cc._decorator;

@ccclass
export default class Cat extends cc.Component {
    private isTan: boolean = false;
    private tanNum:number = 10;

    // @property(cc.SpriteFrame)
    // pressStatus:cc.SpriteFrame;
    // button:cc.Button;
    // sprite:cc.Sprite;
    onLoad() {
        // this.sprite.sp
        // this.button.pressedSprite = this.pressStatus;
        // let frame:cc.SpriteFrame = new cc.SpriteFrame();


        // let tw = cc.tween(this.node);
        // let ease: cc.Ease = "linear";
        // let tweenOpts: cc.tweenOpts;
        // tweenOpts.progress = ()=>{};
        // tweenOpts.easing = ease;
        // tw.to(2, { scale: 2, position: cc.v2(100, 100) }, tweenOpts);
    }

    onCollisionEnter(other, self) {
        cc.log("cat is collision" + other.node.name);
        
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        // cc.log("cat is onBeginContact   " + otherCollider.node.name);
        let rigid = this.getComponent(cc.RigidBody);

        rigid.applyForceToCenter(cc.v2(100,0),false);

        if (!this.isTan) {
            let sprite = this.node.getChildByName("sprite");
            sprite.runAction(cc.sequence(cc.scaleTo(0.08, 1, 0.8), cc.scaleTo(0.08, 1, 1)));
            // sprite.runAction(cc.sequence(cc.skewTo(0.08, -22, 0), cc.skewTo(0.08, 0,0)));
            // sprite.runAction(cc.sequence(cc.skewTo(0.08, 0, 22), cc.skewTo(0.08, 0, 0)));
            this.isTan = true;
        }

        let worldManifold = contact.getWorldManifold();
        let points:Array<cc.Vec2> = worldManifold.points;
        let normal:cc.Vec2 = worldManifold.normal;

        // cc.log("rotation : %d",this.node.rotation);
        // cc.log("rotationx : %d", this.node.rotationX);
        // cc.log("rotationy : %d", this.node.rotationY);
        cc.log("length:%d",points.length);
        cc.log("x:%f,y:%f",normal.x,normal.y);
        // var o = points[0].x - points[1].x
        // var a = points[0].y - points[1].y
        let o = normal.x;
        let a = normal.y;
        let at = Math.atan(o / a) * 180 / Math.PI
        if (a < 0) {
            if (o < 0)
                at = 180 + Math.abs(at);
            else
                at = 180 - Math.abs(at);
        }
        cc.log("angle:%f",at);
    }

    onEndContact(contact, selfCollider, otherCollider) {
        // cc.log("cat is onEndContact   " + otherCollider.node.name);
    }

    test(a = 0,b:number){

    }
    // onPreSolve(contact, selfCollider, otherCollider) {
    //     cc.log("cat is onPreSolve   " + otherCollider.node.name);
    // }

    // onPostSolve(contact, selfCollider, otherCollider) {
    //     cc.log("cat is onPostSolve   " + otherCollider.node.name);
    // }
    
}
