
const {ccclass, property} = cc._decorator;

@ccclass
export default class ParticleTest extends cc.Component {
    @property(cc.Button)
    jumpBtn:cc.Button;
    @property(cc.Button)
    changeSize:cc.Button;
    @property(cc.Button)
    splitBtn:cc.Button;
    @property(cc.Button)
    mergeBtn:cc.Button;
    @property(cc.Node)
    jijiao:cc.Node;

    // @property(dragonBones.ArmatureDisplay)
    // dragon:dragonBones.ArmatureDisplay;

    elastic:cc.ElasticParticles;
    time:number = 0;

    onLoad(){
        // this.dragon.playAnimation("totem_stand",-1)
        this.elastic = this.getComponent("ElasticParticles");
        this.elastic.linearVelocity = cc.v2(100, 0);
        this.elastic.setFillColor(cc.color(255,255,255,100));
        this.elastic.registerBeginContact((collider, normal) => {
            let vector = normal;
            let nodeName = collider.node.name;
        }, this);

        this.elastic.registerEndedContact(() => {
            let a = 0;
        }, this);

        this.jumpBtn.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (this.elastic.canJump()){
                this.elastic.linearVelocity = cc.v2(10, 1000);
            }
        }, this);
        this.changeSize.node.on(cc.Node.EventType.TOUCH_START, () => {
            if(this.elastic){
                this.elastic.changeRadius(25);
            }
        }, this);
        this.splitBtn.node.on(cc.Node.EventType.TOUCH_START, () => {
            if(this.elastic){
                let positions = new Array();
                positions.push(cc.v2(this.node.position.x + 30,this.node.position.y));
                positions.push(cc.v2(this.node.position.x - 30,this.node.position.y));
                this.elastic.split(positions,20);
                // this.elastic.split();
            }
        }, this);
        this.mergeBtn.node.on(cc.Node.EventType.TOUCH_START, () => {
            if(this.elastic){
                this.elastic.merge(500,6.4);
            }
        }, this);
    }

    start () {
        

    }

    update (dt) {
        // this.time += 1;
        // let color = new cc.Color(Math.min(255, this.time), 100, 0, 255) 
        // this.elastic.setFillColor(color);
        this.jijiao.angle = this.elastic.getAngle();
        this.jijiao.position = this.elastic.getPointOfElastic();
        // cc.log("00000000000 %f,%f",pos.x,pos.y);
    }

    onDestroy(){
        
    }

   
}
