    
b2.Draw.prototype.DrawParticles = function (positionBuffer, radius, colorBuffer, particleCount) {
    // console.log("----------b2.Draw.prototype.DrawParticles");
    
    let temp_vec2 = cc.v2(0, 0)
    let PTM_RATIO = 32;
    let drawer = this._drawer;
    for (let i = 0; i < particleCount; i += 3) {

        b2.Transform.MulXV(this._xf, positionBuffer[i], temp_vec2);
        let x = temp_vec2.x * PTM_RATIO;
        let y = temp_vec2.y * PTM_RATIO;

        drawer.circle(x, y, 2);
    }
}

cc.Class({
    extends: cc.Component,

    properties: {
        elastic:{
            default: 0.1,
            type:[Number],
            tooltip:"弹性",
            min:0.1,
            max:1,
            step:0.1,
        },
        radius:{
            default:0.7,
            type:[Number],
            tooltip:"半径",
            min: 0.1,
            max: 1,
            step: 0.1,
        },
        gravityScale:{
            default:1,
            type:[Number],
            tooltip:"缩放应用再此物体上的重力值",
            min: 0,
            max: 5,
            step: 0.1,
        },
        isBox:{
            default:true,
            type:[Boolean],
            tooltip:"创建屏幕包围盒"
        }
    },

    ctor:function() {
        this.PTM_RATIO = 32;
        this.world = null;
        this.particleSystem = null;
    },


    onLoad() {
        let winSize = cc.winSize;
        // cc.PhysicsManager.prototype.start();
        // cc.director.getPhysicsManager().start = true;
        // this.world = new b2.World(new b2.Vec2(0, -10));
        // this.world.SetAllowSleeping(true);
        // this.world.SetContinuousPhysics(true);
        // cc.director.getPhysicsManager()._world = this.world;

        cc.director.getPhysicsManager().enabled = true;
        this.world = cc.director.getPhysicsManager()._world;
        let ass = this.world._proto_;
        this.world.SetAllowSleeping(true);
        this.world.SetContinuousPhysics(true);
        cc.director.getPhysicsManager().debugDrawFlags = 
            cc.PhysicsManager.DrawBits.e_aabbBit |
            cc.PhysicsManager.DrawBits.e_pairBit |
            cc.PhysicsManager.DrawBits.e_centerOfMassBit |
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit |
            cc.PhysicsManager.DrawBits.e_particleBit;

        // this.world.m_locked = false;
        // cc.director.getPhysicsManager()._initCallback();
        // cc.director.getPhysicsManager()._enabled = true;


        var psd = new b2.ParticleSystemDef();
        psd.radius = 0.030;//粒子的精细度
        psd.elasticStrength = this.elastic;//恢复弹性粒子群的形状较大值增加弹性粒子速度
        cc.director.getPhysicsManager()._particle = this.world.CreateParticleSystem(psd);
        this.particleSystem = cc.director.getPhysicsManager()._particle;
        this.particleSystem.SetGravityScale(this.gravityScale);



        //particle
        let shape = new b2.CircleShape();
        shape.m_p.Set(0, 0);//组内部偏移
        shape.m_radius = this.radius;
        let pd = new b2.ParticleGroupDef();
        pd.flags = b2.ParticleFlag.b2_elasticParticle ;
        pd.groupFlags = b2.ParticleGroupFlag.b2_solidParticleGroup;
        // pd.groupFlags = b2.ParticleGroupFlag.b2_rigidParticleGroup;
        pd.shape = shape;
        let pos = this.nodePosToParticle(this.node.position);
        pd.position.Set(pos.x, pos.y);
        pd.color.Set(255, 0, 0, 255);
        this.particleSystem.CreateParticleGroup(pd);

        shape = new b2.CircleShape();
        shape.m_p.Set(-1, 3);
        shape.m_radius = 0.5;
        pd = new b2.ParticleGroupDef();
        pd.flags = b2.ParticleFlag.b2_waterParticle;
        pd.groupFlags = b2.ParticleGroupFlag.b2_solidParticleGroup;
        // pd.groupFlags = b2.ParticleGroupFlag.b2_rigidParticleGroup;
        pd.shape = shape;
        pd.position.Set(winSize.width / 3/ this.PTM_RATIO, winSize.height / 2 / this.PTM_RATIO);
        pd.color.Set(0, 255, 0, 255);
        this.particleSystem.CreateParticleGroup(pd);
        
        
        let groundBodyDef = new b2.BodyDef();
        groundBodyDef.position.Set(0, 0);
        let groundBody = this.world.CreateBody(groundBodyDef);

        if(this.isBox){
            //boldy
            let groundBox = new b2.EdgeShape();

            // bottom
            groundBox.Set(new b2.Vec2(0, 0), new b2.Vec2(winSize.width / this.PTM_RATIO, 0));
            groundBody.CreateFixture(groundBox, 0);

            // top
            groundBox.Set(new b2.Vec2(0, winSize.height / this.PTM_RATIO), new b2.Vec2(winSize.width / this.PTM_RATIO, winSize.height / this.PTM_RATIO));
            groundBody.CreateFixture(groundBox, 0);

            // left
            groundBox.Set(new b2.Vec2(0, 0), new b2.Vec2(0, winSize.height / this.PTM_RATIO));
            groundBody.CreateFixture(groundBox, 0);

            // right
            groundBox.Set(new b2.Vec2(winSize.width / this.PTM_RATIO, 0), new b2.Vec2(winSize.width / this.PTM_RATIO, winSize.height / this.PTM_RATIO));
            groundBody.CreateFixture(groundBox, 0);
        }
        let a = null;
    },

    nodePosToParticle:function(pos){
        return new b2.Vec2((cc.winSize.width / 2 + pos.x) / this.PTM_RATIO, (cc.winSize.height / 2 + pos.y) / this.PTM_RATIO);
    },

    update(){
        
    },

    start() {
    },

    // update (dt) {},
});
