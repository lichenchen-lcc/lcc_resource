
const { ccclass, property } = cc._decorator;

@ccclass
export class LiquidTest1 extends cc.Component {
    PTM_RATIO = 1;
    world: any;

    onLoad() {
        this.world = new b2World(new b2Vec2(0,-10));
        // this.world.SetAllowSleeping(true);
        // this.world.SetContinuousPhysics(true);

        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags =
            cc.PhysicsManager.DrawBits.e_aabbBit |
            cc.PhysicsManager.DrawBits.e_pairBit |
            cc.PhysicsManager.DrawBits.e_centerOfMassBit |
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit |
            cc.PhysicsManager.DrawBits.e_particleBit;

        let psd = new b2ParticleSystemDef();
        psd.radius = 0.035;
        psd.dampingStrength = 0.2;
        let particleSystem = this.world.CreateParticleSystem(psd);
    }

    start() {
        let winSize = cc.winSize;


    }

    // update (dt) {}
}
