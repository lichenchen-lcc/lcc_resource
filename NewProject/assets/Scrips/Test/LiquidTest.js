    
b2.Draw.prototype.DrawParticles = function (positionBuffer, radius, colorBuffer, particleCount) {
    console.log("----------b2.Draw.prototype.DrawParticles");
    
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

    },

    onLoad() {
        let winSize = cc.winSize;
        
        this.PTM_RATIO = 32;
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
        psd.radius = 0.035;
        psd.dampingStrength = 0.2;//沿碰撞法线降低速度较小的值减少较少
        cc.director.getPhysicsManager()._particle = this.world.CreateParticleSystem(psd);
        this.particleSystem = cc.director.getPhysicsManager()._particle;

        //boldy
        let groundBodyDef = new b2.BodyDef();
        groundBodyDef.position.Set(0, 0);

        let groundBody = this.world.CreateBody(groundBodyDef);
        let groundBox = new b2.EdgeShape

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


        //particle
        let shape = new b2.CircleShape();
        shape.m_p.Set(0, 3);
        shape.m_radius = 0.5;
        let pd = new b2.ParticleGroupDef();
        pd.flags = b2.ParticleFlag.b2_elasticParticle ;
        // pd.groupFlags = b2.ParticleGroupFlag.b2_solidParticleGroup;
        // pd.groupFlags = b2.ParticleGroupFlag.b2_rigidParticleGroup;
        pd.shape = shape;
        pd.position.Set(winSize.width / 2 / this.PTM_RATIO, winSize.height / 2 / this.PTM_RATIO);
        pd.color.Set(255, 0, 0, 255);
        this.particleSystem.CreateParticleGroup(pd);
        
        
        let a = null;
    },


    update(){
        
    },

    fromCocos:function(){

    },

    DrawParticles:function (positionBuffer, radius, colorBuffer, particleCount) {

        let temp_vec2 = cc.v2(0, 0)
        let PTM_RATIO = 32;
        let drawer = this._drawer;
        for (let i = 0; i < particleCount; i += 3) {

            b2.Transform.MulXV(this._xf, positionBuffer[i], temp_vec2);
            let x = temp_vec2.x * PTM_RATIO;
            let y = temp_vec2.y * PTM_RATIO;

            drawer.circle(x, y, 2);
        }
    },

    test: function () {
        let gravity = new b2.Vec2(0, 0); //2维坐标
        gravity.Set(0.0, -10.0);
        this.m_world = new b2World(gravity);
        let ground = new b2Body();
        {
            let bd = new b2BodyDef;
            ground = this.m_world.CreateBody(bd);
        }

        {
            let bd = new b2BodyDef();
            bd.type = b2_dynamicBody;
            bd.allowSleep = false;
            bd.position.Set(0.0, 1.0);
            let body = this.m_world.CreateBody(bd);

            let shape = new b2PolygonShape();

            shape.SetAsBoxXYCenterAngle(0.05, 1.0, new b2.Vec2(2.0, 0.0), 0.0);
            body.CreateFixtureFromShape(shape, 5.0);
            shape.SetAsBoxXYCenterAngle(0.05, 1.0, new b2.Vec2(-2.0, 0.0), 0.0);
            body.CreateFixtureFromShape(shape, 5.0);
            shape.SetAsBoxXYCenterAngle(2.0, 0.05, new b2.Vec2(0.0, 1.0), 0.0);
            body.CreateFixtureFromShape(shape, 5.0);
            shape.SetAsBoxXYCenterAngle(2.0, 0.05, new b2.Vec2(0.0, -1.0), 0.0);
            body.CreateFixtureFromShape(shape, 5.0);

            let jd = new b2RevoluteJointDef();
            jd.bodyA = ground;
            jd.bodyB = body;
            jd.localAnchorA.Set(0.0, 1.0);
            jd.localAnchorB.Set(0.0, 0.0);
            jd.referenceAngle = 0.0;
            jd.motorSpeed = 0.05 * b2_pi;
            jd.maxMotorTorque = 0x1e7f;
            jd.enableMotor = true;
            this.m_joint = this.m_world.CreateJoint(jd);

            cc.log("zoule");
        }
    },

    start() {
    },

    // update (dt) {},
});
