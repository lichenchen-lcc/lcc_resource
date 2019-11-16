
const {ccclass, property} = cc._decorator;

@ccclass
export default class ParticleTest extends cc.Component {


    start () {
        let elastic:cc.ElasticParticles = this.getComponent("ElasticParticles");
        elastic.linearVelocity = cc.v2(100,0);
        // this.node.angle

    }

    // update (dt) {}

    onDestroy(){
        
    }
}
