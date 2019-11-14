
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

//node解构
var DrawNode = cc.Class({
    ctor: function (x, y, index,angle) {
        this.x = x;
        this.y = y;
        this.index = index;
        this.angle = angle;
    },
});

cc.Class({
    extends: cc.Component,

    properties: {
        elastic: {
            default: 0.1,
            type: cc.Float,
            tooltip: "弹性",
            min: 0.1,
            max: 1,
            step: 0.1,
        },
        radius: {
            default: 0.7,
            type: cc.Float,
            tooltip: "半径",
            min: 0.1,
            max: 1,
            step: 0.1,
        },
        gravityScale: {
            default: 1,
            type: cc.Float,
            tooltip: "缩放应用再此物体上的重力值",
            min: 0,
            max: 5,
            step: 0.1,
        },
        isBox: {
            default: true,
            tooltip: "创建屏幕包围盒"
        }
    },

    ctor: function () {
        this.PTM_RATIO = 32;
        this.world = null;
        this.particleSystem = null;
        this.material = null;

        this.drawNodes = new Array();
    },


    onLoad() {
        this.graphics = this.getComponent(cc.Graphics);
        this.createParticles();
    },

    initShaderTemp: function () {

    },

    showParticleLog: function () {
        let centerPos = new cc.Vec2(cc.winSize.width / 2 + this.node.position.x, cc.winSize.height / 2 + this.node.position.y);
        cc.log("centerPos x = %f,y = %f ,radius = %f", centerPos.x, centerPos.y, this.radius * this.PTM_RATIO);
        let vertsCount = this.particleSystem.GetParticleCount();//b2ParticleSystem函数，获取粒子数量
        cc.log("vertsCount : %d", vertsCount);
        let posVerts = this.particleSystem.GetPositionBuffer();//b2ParticleSystem函数，获取粒子位置数组
        for (let i = 0; i < vertsCount; i++) {
            let pos = new cc.Vec2(posVerts[i].x * this.PTM_RATIO, posVerts[i].y * this.PTM_RATIO);
            let dis = centerPos.sub(pos).mag();
            let dif = Math.abs(dis - this.radius * this.PTM_RATIO);
            if (dif <= 1) {
                let tempPos = new cc.Vec2(pos.x - cc.winSize.width / 2, pos.y - cc.winSize.height / 2);
                let angle = tempPos.y / (this.radius * this.PTM_RATIO) * 180 / Math.PI;
                if (tempPos.x >= 0 && tempPos.y > 0){
                    angle = angle;
                } else if (tempPos.x < 0 && tempPos.y >= 0){
                    angle = 180 - angle;
                } else if (tempPos.x <= 0 && tempPos.y < 0) {
                    angle = Math.abs(angle) + 180;
                } else if (tempPos.x > 0 && tempPos.y <= 0) {
                    angle = 360 + angle;
                }
                // cc.log("posVerts x=%f,y=%f, dis = %f,dif = %f,angel = %f", tempPos.x, tempPos.y, dis, dif, angle);
                this.drawNodes.push(new DrawNode(tempPos.x, tempPos.y, i, angle)); 
                this.drawNodes.sort(function(a,b){
                    return a.angle - b.angle;
                });
            }
        }
        this.render();
    },

    render: function() {
        if (this.drawNodes.length <= 0){
            alert("can't found nodes");
            return;
        }
        if (!this.graphics){
            alert("can't found cc.Graphics");
            return;
        }
        let graphics = this.graphics;
        let nodes = this.drawNodes;

        graphics.clear();

        let currentIndex, nextIndex, xc, yc;
        currentIndex = nodes[nodes.length - 1];
        nextIndex = nodes[0];

        xc = (currentIndex.x + nextIndex.x) / 2;
        yc = (currentIndex.y + nextIndex.y) / 2;

        // xc += this.node.position.x;
        // yc += this.node.position.y;

        graphics.moveTo(xc, yc);
        graphics.lineCap = cc.Graphics.LineCap.ROUND;
        graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
        graphics.strokeColor = cc.Color.RED;//线段颜色
        graphics.fillColor = cc.Color.YELLOW;
        graphics.lineWidth = 5

        // Draw through N points
        for (var N = 0; N < nodes.length; N++) {
            currentIndex = nodes[N];
            // cc.log("nodes x=%f,y=%f, angel = %f", currentIndex.x, currentIndex.y, currentIndex.angle);
            nextIndex = N + 1 > nodes.length - 1 ? nodes[0] : nodes[N + 1];
            // nextIndex = N - 1 < 0 ? nodes[nodes.length - 1] : nodes[N - 1];
            //取中点
            xc = (currentIndex.x + nextIndex.x) / 2;
            yc = (currentIndex.y + nextIndex.y) / 2;

            graphics.quadraticCurveTo(currentIndex.x, currentIndex.y, xc, yc);
        }
        graphics.fill();
        // graphics.stroke();//绘制线段
    },

    createParticles: function () {
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
        pd.flags = b2.ParticleFlag.b2_elasticParticle;
        pd.groupFlags = b2.ParticleGroupFlag.b2_solidParticleGroup;
        // pd.groupFlags = b2.ParticleGroupFlag.b2_rigidParticleGroup;
        pd.shape = shape;
        let pos = this.nodePosToParticle(this.node.position);
        pd.position.Set(pos.x, pos.y);
        pd.color.Set(255, 0, 0, 255);
        this.particleSystem.CreateParticleGroup(pd);

        this.showParticleLog();

        let groundBodyDef = new b2.BodyDef();
        groundBodyDef.position.Set(0, 0);
        let groundBody = this.world.CreateBody(groundBodyDef);

        if (this.isBox) {
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

    nodePosToParticle: function (pos) {
        return new b2.Vec2((cc.winSize.width / 2 + pos.x) / this.PTM_RATIO, (cc.winSize.height / 2 + pos.y) / this.PTM_RATIO);
    },

    update(dt) {
        let posVerts = this.particleSystem.GetPositionBuffer();//b2ParticleSystem函数，获取粒子位置数组
        for(let i = 0;i < this.drawNodes.length ;i++){
            let node = this.drawNodes[i];
            if (posVerts[node.index]){
                // cc.log("nodes x=%f,y=%f, angel = %f", posVerts[node.index].x * this.PTM_RATIO - cc.winSize.width / 2, posVerts[node.index].y * this.PTM_RATIO - cc.winSize.height / 2, node.angle);
            }
            let pos = new cc.Vec2(posVerts[node.index].x * this.PTM_RATIO - cc.winSize.width/2, posVerts[node.index].y * this.PTM_RATIO - cc.winSize.height/2);
            node.x = pos.x;
            node.y = pos.y
        }
        this.render();

        // let vertsCount = this.particleSystem.GetParticleCount();//b2ParticleSystem函数，获取粒子数量
        // let posVerts = this.particleSystem.GetPositionBuffer();//b2ParticleSystem函数，获取粒子位置数组
        // for (let i = 0; i < vertsCount; i++) {
        //     cc.log("posVerts x=%f,y=%f", posVerts[i].x, posVerts[i].y);
        // }

        // let sprite = this.getComponent(cc.Sprite);
        // this.material = sprite.sharedMaterials[0];
        // let spriteSize = sprite.node.getContentSize();
        // let vertsCount = this.particleSystem.GetParticleCount();//b2ParticleSystem函数，获取粒子数量
        // let posVerts = this.particleSystem.GetPositionBuffer();//b2ParticleSystem函数，获取粒子位置数组
        // for (let i = 0; i < vertsCount; i++) {
        //     this.material.setProperty("u_color", new cc.Vec4(1, 1, 1, 0.7));
        //     this.material.setProperty("u_ratio", this.PTM_RATIO);
        //     this.material.setProperty("u_pointSize", this.particleSystem.GetRadius() * this.PTM_RATIO * 2);
        //     this.material.setProperty("u_position", new cc.Vec2(posVerts[i].x * this.PTM_RATIO / spriteSize.width, posVerts[i].y * this.PTM_RATIO / spriteSize.height));
        //     this.material.setProperty("u_uv0", posVerts[i]);
        // }
    },

    start() {
    },

    // update (dt) {},
});
