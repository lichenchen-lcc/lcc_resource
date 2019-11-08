


const {ccclass, property} = cc._decorator;

@ccclass
export default class Test extends cc.Component {
    private root:cc.Node;

    start () {
        // cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        // cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().gravity = new cc.Vec2(0, 0);
        // cc.director.getPhysicsManager().debugDrawFlags = 1;
    }

    onLoad(){
        this.root = cc.find("Canvas");
        // cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        // cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        //     cc.PhysicsManager.DrawBits.e_pairBit |
        //     cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit
        //     ;

        // this.cicle.node.runAction(cc.scaleTo(2, 0.5, 2));
        // this.cicle.node.runAction(cc.skewTo(2, 10, 0));
        
        // let gravity = new b2.Vec2(0-,10);
        
        
        
    }
    update (dt) {
        // let grep: cc.Node = this.root.getChildByName("grep");
        // let rigid = grep.getComponent(cc.RigidBody);
        // let collider = grep.getComponent(cc.PhysicsPolygonCollider);
        // grep.anchorX = grep.anchorX + setdt/100;
        // rigid.node.position = grep.position;
        // grep.rotation = grep.rotation + dt;
        // cc.log("dt:" + dt + "  grep.anchorX" + grep.anchorX);
    }
}
