
const {ccclass, property} = cc._decorator;

@ccclass
export default class ParticleTest extends cc.Component {
    @property(cc.Button)
    button:cc.Button;
    @property(cc.Node)
    jijiao:cc.Node;

    elastic:cc.ElasticParticles;
    time:number = 0;

    onLoad(){
        this.elastic = this.getComponent("ElasticParticles");
        this.elastic.linearVelocity = cc.v2(100, 0);
        this.elastic.setFillColor(cc.Color.WHITE);
        this.elastic.registerBeginContact((collider, normal) => {
            let vector = normal;
            let nodeName = collider.node.name;
        }, this);

        this.elastic.registerEndedContact(() => {
            let a = 0;
        }, this);

        this.button.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.elastic.linearVelocity = cc.v2(10, 1000);
        }, this);
    }

    start () {
        

    }

    update (dt) {
        // this.time += 1;
        // let color = new cc.Color(Math.min(255, this.time), 100, 0, 255) 
        // this.elastic.setFillColor(color);
        this.jijiao.angle = this.elastic.getAngle();
    }

    onDestroy(){
        
    }

   
}
