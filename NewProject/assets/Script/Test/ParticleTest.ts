
const {ccclass, property} = cc._decorator;

@ccclass
export default class ParticleTest extends cc.Component {


    start () {
        let elastic:cc.ElasticParticles = this.getComponent("ElasticParticles");
        elastic.linearVelocity = cc.v2(100,0);
        elastic.registerBeginContact((collider,normal)=>{
            let vector = normal;
            let nodeName = collider.node.name;
        },this);

    }

    // update (dt) {}

    onDestroy(){
        
    }

   
}
