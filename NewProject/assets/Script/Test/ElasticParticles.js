
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
    ctor: function (x, y, index, angle) {
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
        density: {
            default: 1,
            tooltip: "密度",
            type: cc.Float,
            step: 0.1,
            min: 0
        },
        // damping :{
        //     default: 0,
        //     type: cc.Float,
        //     tooltip:"设置阻尼"
        // },
        isBox: {
            default: false,
            tooltip: "创建屏幕包围盒"
        },
    },

    ctor: function () {
        this.PTM_RATIO = 32;
        this._world = null;
        this._particleSystem = null;

        this._drawNodes = new Array();
        this._particleCenterPos = new cc.Vec2(0,0);
        this._particleIndex = 0;
    },


    onLoad() {
        this.graphics = this.getComponent(cc.Graphics);
        this._particleCenterPos = new cc.Vec2(cc.winSize.width / 2 + this.node.position.x, cc.winSize.height / 2 + this.node.position.y);
        this.createParticles();
        this.initParticleNodes();
    },

    initParticleNodes: function () {
        let radius = this.radius * this.PTM_RATIO;
        this._particleCenterPos = new cc.Vec2(cc.winSize.width / 2 + this.node.position.x, cc.winSize.height / 2 + this.node.position.y);
        cc.log("this._particleCenterPos x = %f,y = %f ,radius = %f", this._particleCenterPos.x, this._particleCenterPos.y, radius);
        let vertsCount = this._particleSystem.GetParticleCount();//b2ParticleSystem函数，获取粒子数量
        let posVerts = this._particleSystem.GetPositionBuffer();//b2ParticleSystem函数，获取粒子位置数组
        cc.log("vertsCount : %d", vertsCount);
        let centerDis = radius;
        for (let i = 0; i < vertsCount; i++) {
            let pos = new cc.Vec2(posVerts[i].x * this.PTM_RATIO, posVerts[i].y * this.PTM_RATIO);
            let dis = this._particleCenterPos.sub(pos).mag();
            if (dis < centerDis){
                this._particleIndex = i;
                centerDis = dis;
            }
            let difference = Math.abs(dis - radius);
            if (difference <= 1) {
                let tempPos = new cc.Vec2(pos.x - this._particleCenterPos.x, pos.y - this._particleCenterPos.y);
                let angle = tempPos.y / (radius) * 180 / Math.PI;
                if (tempPos.x >= 0 && tempPos.y > 0) {
                    angle = angle;
                } else if (tempPos.x < 0 && tempPos.y >= 0) {
                    angle = 180 - angle;
                } else if (tempPos.x <= 0 && tempPos.y < 0) {
                    angle = Math.abs(angle) + 180;
                } else if (tempPos.x > 0 && tempPos.y <= 0) {
                    angle = 360 + angle;
                }
                // cc.log("posVerts x=%f,y=%f, dis = %f,difference = %f,angel = %f", pos.x, pos.y, dis, difference, angle);
                this._drawNodes.push(new DrawNode(tempPos.x, tempPos.y, i, angle));
            }
        }
        this._drawNodes.sort(function (a, b) {
            return a.angle - b.angle;
        });
        cc.log("this._particleIndex = %d x=%f,y=%f, ", this._particleIndex, posVerts[this._particleIndex].x * this.PTM_RATIO, posVerts[this._particleIndex].y * this.PTM_RATIO);
        this.render();
    },

    render: function () {
        if (this._drawNodes.length <= 0) {
            alert("can't found nodes");
            return;
        }
        if (!this.graphics) {
            alert("can't found cc.Graphics");
            return;
        }
        let graphics = this.graphics;
        let nodes = this._drawNodes;

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
        // this._world = new b2.World(new b2.Vec2(0, -10));
        // this._world.SetAllowSleeping(true);
        // this._world.SetContinuousPhysics(true);
        // cc.director.getPhysicsManager()._world = this._world;

        cc.director.getPhysicsManager().enabled = true;
        this._world = cc.director.getPhysicsManager()._world;
        this._world.SetAllowSleeping(true);
        this._world.SetContinuousPhysics(true);
        // cc.director.getPhysicsManager().debugDrawFlags =
        //     cc.PhysicsManager.DrawBits.e_aabbBit |
        //     cc.PhysicsManager.DrawBits.e_pairBit |
        //     cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit |
        //     cc.PhysicsManager.DrawBits.e_particleBit;

        // this._world.m_locked = false;
        // cc.director.getPhysicsManager()._initCallback();
        // cc.director.getPhysicsManager()._enabled = true;


        var psd = new b2.ParticleSystemDef();
        psd.radius = 0.04;//粒子的精细度
        psd.elasticStrength = this.elastic;//恢复弹性粒子群的形状较大值增加弹性粒子速度
        cc.director.getPhysicsManager()._particle = this._world.CreateParticleSystem(psd);
        this._particleSystem = cc.director.getPhysicsManager()._particle;
        this._particleSystem.SetGravityScale(this.gravityScale);
        this._particleSystem.SetDensity(this.density);
        // this._particleSystem.SetDamping(this.damping);

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
        this._particleSystem.CreateParticleGroup(pd);

        let groundBodyDef = new b2.BodyDef();
        groundBodyDef.position.Set(0, 0);
        let groundBody = this._world.CreateBody(groundBodyDef);

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
    },

    nodePosToParticle: function (pos) {
        return new b2.Vec2((cc.winSize.width / 2 + pos.x) / this.PTM_RATIO, (cc.winSize.height / 2 + pos.y) / this.PTM_RATIO);
    },

    updateParticleNodes: function(){
        let posVerts = this._particleSystem.GetPositionBuffer();//b2ParticleSystem函数，获取粒子位置数组
        //更新中心点坐标
        this._particleCenterPos.x = posVerts[this._particleIndex].x * this.PTM_RATIO;
        this._particleCenterPos.y = posVerts[this._particleIndex].y * this.PTM_RATIO;
        //更新this.node.position
        this.node.position = new cc.Vec2(this._particleCenterPos.x - cc.winSize.width / 2, this._particleCenterPos.y - cc.winSize.height / 2); 

        // cc.log("this.node.position  x = %f,y=%f", this.node.position.x, this.node.position.y);
        for (let i = 0; i < this._drawNodes.length; i++) {
            let node = this._drawNodes[i];
            if (posVerts[node.index]) {
                // cc.log("nodes x=%f,y=%f, angel = %f", posVerts[node.index].x * this.PTM_RATIO - cc.winSize.width / 2, posVerts[node.index].y * this.PTM_RATIO - cc.winSize.height / 2, node.angle);
            }
            let pos = new cc.Vec2(posVerts[node.index].x * this.PTM_RATIO - this._particleCenterPos.x, posVerts[node.index].y * this.PTM_RATIO - this._particleCenterPos.y);
            node.x = pos.x;
            node.y = pos.y;

            // let angle = node.y / (pos.mag()) * 180 / Math.PI;
            // if (node.x >= 0 && node.y > 0) {
            //     angle = angle;
            // } else if (node.x < 0 && node.y >= 0) {
            //     angle = 180 - angle;
            // } else if (node.x <= 0 && node.y < 0) {
            //     angle = Math.abs(angle) + 180;
            // } else if (node.x > 0 && node.y <= 0) {
            //     angle = 360 + angle;
            // }
            // node.angle = angle;
            // cc.log("i = %d  index = %d  x=%f,y=%f, ", i, node.index, pos.x, pos.y);
        }
        // this._drawNodes.sort(function (a, b) {
        //     return a.angle - b.angle;
        // });
        
        this.render();
    },

    update(dt) {
        if (this._drawNodes.length > 0 ){
            this.updateParticleNodes();
        }
    },

    start() {
    },

    // update (dt) {},
});
