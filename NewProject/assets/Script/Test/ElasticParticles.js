let util = require('./util');
let DrawNode = util.DrawNode;
let Contact = util.Contact;
let RenderType = util.RenderType;

var ElasticParticles = cc.Class({
    extends: cc.Component,

    properties: {
        radius: {
            default: 25.6,
            type: cc.Float,
            tooltip: "半径",
            min: 0.1,
            max: 64,
        },
        elastic: {
            default: 0.1,
            type: cc.Float,
            tooltip: "弹性",
            min: 0.1,
            max: 1,
        },
        gravityScale: {
            default: 1,
            type: cc.Float,
            tooltip: "缩放应用再此物体上的重力值",
            min: 0,
            max: 5,
        },
        density: {
            default: 1,
            tooltip: "密度",
            type: cc.Float,
            min: 0
        },
        fine: {
            default: 0.04,
            type: cc.Float,
            tooltip: "粒子的精细程度，值越小越精细，并渲染复杂度",
            step: 0.001,
            min: 0.03,
            max: 0.2,
        },
        damping: {
            default: 0,
            type: cc.Float,
            tooltip: "设置阻尼",
            min: 0,
            max: 2,
            step: 0.1,
        },
        render: {
            default: RenderType.EACHPARTICLE,
            type: cc.Enum(RenderType),
            tooltip: "修改渲染方式"
        },
        isDebug: {
            default: false,
        },
        isBox: {
            default: false,
            tooltip: "创建屏幕包围盒"
        },
    },

    ctor: function () {
        this.PTM_RATIO = 32;
        this._world = null;
        this._particleSystem = null;
        this._particleGroup = null;

        this._drawNodes = [];
        this._particleCenterPos = new cc.Vec2(0, 0);

        this._onBeginContact = null;
        this._onEndedContact = null;
        this._contactCaller = null;

        this._angleIndex = 0;
        this._initialAnglePos = new cc.Vec2(0, 0);
        this._angle = 0;

        this._fillColor = cc.Color.YELLOW;

        this._contactManager = [];

        this._splitGroups = [];
        this._splitRadius = 0;
    },


    onLoad() {
        if (!cc.director.getPhysicsManager().enabled) {
            cc.director.getPhysicsManager().enabled = true;
        }
        this.graphics = this.getComponent(cc.Graphics);
        this._particleCenterPos = new cc.Vec2(cc.winSize.width / 2 + this.node.position.x, cc.winSize.height / 2 + this.node.position.y);
        this.createParticles(true);
        this.initParticleNodes();
    },

    start() {
    },

    getNodeAngle: function (tempPos) {
        let radius = this.radius;
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
        return angle;
    },

    initParticleNodes: function () {
        let center = this._particleGroup.GetCenter();
        this._particleCenterPos = new cc.Vec2(center.x * this.PTM_RATIO, center.y * this.PTM_RATIO);
        // cc.log("this._particleCenterPos x = %f,y = %f ,radius = %f", this._particleCenterPos.x, this._particleCenterPos.y, radius);
        let vertsCount = this._particleSystem.GetParticleCount();//b2ParticleSystem函数，获取粒子数量
        let posVerts = this._particleSystem.GetPositionBuffer();//b2ParticleSystem函数，获取粒子位置数组
        // cc.log("vertsCount : %d", vertsCount);
        if (this.render == RenderType.OUTERRING) {
            this._drawNodes.length = 0;
            let radius = this.radius;
            for (let i = 0; i < vertsCount; i++) {
                //分裂时只保证第一个的数据
                if (this._particleGroup && this._particleGroup.ContainsParticle(i)) {
                    let pos = new cc.Vec2(posVerts[i].x * this.PTM_RATIO, posVerts[i].y * this.PTM_RATIO);
                    let dis = this._particleCenterPos.sub(pos).mag();
                    let difference = Math.abs(dis - radius);
                    if (difference <= 1) {
                        let tempPos = new cc.Vec2(pos.x - this._particleCenterPos.x, pos.y - this._particleCenterPos.y);
                        let angle = this.getNodeAngle(tempPos);
                        // cc.log("posVerts x=%f,y=%f, dis = %f,difference = %f,angel = %f", tempPos.x, tempPos.y, dis, difference, angle);
                        this._drawNodes.push(new DrawNode(tempPos.x, tempPos.y, i, angle));
                    }
                }
            }
            this._drawNodes.sort(function (a, b) {
                return a.angle - b.angle;
            });
        }

        let tempA = 90;
        for (let i = 0; i < vertsCount; i++) {
            let pos = new cc.Vec2(posVerts[i].x * this.PTM_RATIO - this._particleCenterPos.x, posVerts[i].y * this.PTM_RATIO - this._particleCenterPos.y);
            //分裂时只保证第一个的数据
            // cc.log("this._particleGroup.ContainsParticle(i) " + this._particleGroup.ContainsParticle(i));
            if (this._particleGroup && this._particleGroup.ContainsParticle(i)) {
                if (pos.x > 0 && pos.y > 0) {
                    let angle = this.getNodeAngle(pos);
                    if (Math.abs(90 - angle) < tempA) {
                        tempA = Math.abs(90 - angle);
                        this._angleIndex = i;
                        this._initialAnglePos = pos;
                    }
                }
            }
        }
        let a = null;
        // cc.log("l.llll %d ,%f,%f", this._angleIndex, this._initialAnglePos.x, this._initialAnglePos.y);
    },

    update(dt) {
        this.synchronizationToNode();

        if (this.render == RenderType.OUTERRING) {
            this.updateParticleNodes();
            this.renderOuterRing();
        } else if (this.render == RenderType.EACHPARTICLE) {
            this.renderEachParticle();

        }
        this.updateContacts();
    },

    /**
     * @function 用每个粒子来绘制
     */
    renderEachParticle: function () {
        if (!this.graphics) {
            alert("can't found cc.Graphics");
            return;
        }
        let graphics = this.graphics;
        graphics.clear();
        let vertsCount = this._particleSystem.GetParticleCount();
        let posVerts = this._particleSystem.GetPositionBuffer();
        for (let i = 0; i < vertsCount; i++) {
            let pos = new cc.Vec2(posVerts[i].x * this.PTM_RATIO, posVerts[i].y * this.PTM_RATIO);
            let tempPos = new cc.Vec2(pos.x - this._particleCenterPos.x, pos.y - this._particleCenterPos.y);
            graphics.fillColor = this._fillColor;
            graphics.circle(tempPos.x, tempPos.y, (this.fine + 0.02) * this.PTM_RATIO);
            graphics.lineCap = cc.Graphics.LineCap.ROUND;
            graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
        }
        graphics.fill();
    },

    /**
     * @function 用外圈节点绘制当前圆
     */
    renderOuterRing: function () {
        if (!this.graphics) {
            alert("can't found cc.Graphics");
            return;
        }
        if (this._drawNodes.length <= 0) {
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
        graphics.strokeColor = cc.Color.WHITE;//线段颜色
        graphics.fillColor = this._fillColor;
        // cc.log("this._fillColor  %d,%d,%d,%d", this._fillColor.r, this._fillColor.g, this._fillColor.b, this._fillColor.a);
        graphics.lineWidth = 2

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

    createParticleGroup: function (pos, radius) {
        //particle
        let shape = new b2.CircleShape();
        shape.m_p.Set(0, 0);//组内部偏移
        shape.m_radius = radius;
        let pd = new b2.ParticleGroupDef();
        pd.flags = b2.ParticleFlag.b2_elasticParticle;
        pd.groupFlags = b2.ParticleGroupFlag.b2_solidParticleGroup;
        // pd.groupFlags = b2.ParticleGroupFlag.b2_rigidParticleGroup;
        pd.shape = shape;
        pd.position.Set(pos.x, pos.y);
        pd.color.Set(255, 0, 0, 255);
        // pd.stride = 0.1;
        return this._particleSystem.CreateParticleGroup(pd);
    },

    createParticles: function (isGroup) {
        let winSize = cc.winSize;

        this._world = cc.director.getPhysicsManager()._world;
        this._world.SetAllowSleeping(true);
        // this._world.SetContinuousPhysics(true);
        if (this.isDebug) {
            cc.director.getPhysicsManager().debugDrawFlags =
                cc.PhysicsManager.DrawBits.e_aabbBit |
                cc.PhysicsManager.DrawBits.e_pairBit |
                cc.PhysicsManager.DrawBits.e_centerOfMassBit |
                cc.PhysicsManager.DrawBits.e_jointBit |
                cc.PhysicsManager.DrawBits.e_shapeBit |
                cc.PhysicsManager.DrawBits.e_particleBit;
        }

        var psd = new b2.ParticleSystemDef();
        psd.radius = this.fine;//粒子的精细度
        psd.elasticStrength = this.elastic;//恢复弹性粒子群的形状较大值增加弹性粒子速度
        // psd.surfaceTensionNormalStrength = 0.2;
        if (cc.director.getPhysicsManager()._particle) {
            this._world.DestroyParticleSystem(cc.director.getPhysicsManager()._particle);
        }
        cc.director.getPhysicsManager()._particle = this._world.CreateParticleSystem(psd);
        this._particleSystem = cc.director.getPhysicsManager()._particle;
        this._particleSystem.SetGravityScale(this.gravityScale);
        this._particleSystem.SetDensity(this.density);
        this._particleSystem.SetDamping(this.damping);

        if (isGroup) {
            let pos = this.nodePosToParticle(this.node.position);
            this._particleGroup = this.createParticleGroup(pos, this.radius / this.PTM_RATIO);
        }

        if (this.isBox) {
            let groundBodyDef = new b2.BodyDef();
            groundBodyDef.position.Set(0, 0);
            let groundBody = this._world.CreateBody(groundBodyDef);
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

    /**
     * @function 更新外圈节点的位置
     */
    updateParticleNodes: function () {
        if (this._drawNodes.length <= 0) {
            return;
        }
        // cc.log("this.node.position  x = %f,y=%f", this.node.position.x, this.node.position.y);
        let posVerts = this._particleSystem.GetPositionBuffer();//b2ParticleSystem函数，获取粒子位置数组
        for (let i = 0; i < this._drawNodes.length; i++) {
            let node = this._drawNodes[i];
            if (posVerts[node.index]) {
                // cc.log("nodes x=%f,y=%f, angel = %f", posVerts[node.index].x * this.PTM_RATIO - cc.winSize.width / 2, posVerts[node.index].y * this.PTM_RATIO - cc.winSize.height / 2, node.angle);
            }
            let pos = new cc.Vec2(posVerts[node.index].x * this.PTM_RATIO - this._particleCenterPos.x, posVerts[node.index].y * this.PTM_RATIO - this._particleCenterPos.y);
            node.x = pos.x;
            node.y = pos.y;
        }
    },

    findInContactMng: function (key) {
        for (let i = 0; i < this._contactManager.length; i++) {
            if (this._contactManager[i] && (key === this._contactManager[i].key)) {
                return this._contactManager[i];
            }
        }
        return false;
    },

    /**
     * @function 同步坐标和角度到当前的node节点
     */
    synchronizationToNode: function () {

        //更新中心点坐标
        if (this._particleGroup) {
            let center = this._particleGroup.GetCenter();
            this._particleCenterPos = new cc.Vec2(center.x * this.PTM_RATIO, center.y * this.PTM_RATIO);
        }

        //更新this.node.position
        this.node.position = new cc.Vec2(this._particleCenterPos.x - cc.winSize.width / 2, this._particleCenterPos.y - cc.winSize.height / 2);

        //同步角度
        let posVerts = this._particleSystem.GetPositionBuffer();
        let tempPos = new cc.Vec2(posVerts[this._angleIndex].x * this.PTM_RATIO - this._particleCenterPos.x, posVerts[this._angleIndex].y * this.PTM_RATIO - this._particleCenterPos.y)
        // let angle1 = this._initialAnglePos.angle(tempPos) * 180 / Math.PI;
        let angle2 = this._initialAnglePos.signAngle(tempPos) * 180 / Math.PI;
        // cc.log("angle1 angle1 %f,%f", angle1, angle2);

        this._angle = angle2 || 0;
    },

    /**
     * @function 更新当前碰撞节点
     */
    updateContacts: function () {
        //b2ParticleBodyContact
        let count = this._particleSystem.GetBodyContactCount();
        if (count > 0) {
            let contacts = this._particleSystem.GetBodyContacts();

            for (let i = 0; i < count; i++) {
                let contact = contacts[i];
                if (contact.fixture.collider) {
                    let contactTemp = this.findInContactMng(contact.fixture.collider.node.name);
                    if (!contactTemp) {
                        let normalVector = new cc.Vec2(contact.normal.x * this.PTM_RATIO, contact.normal.y * this.PTM_RATIO);
                        let collider = contact.fixture.collider;
                        if (this._onBeginContact) {
                            this._onBeginContact.call(this._contactCaller, collider, normalVector);
                        }
                        let contactTemp = new Contact(collider, normalVector);
                        contactTemp.reference = 1;
                        this._contactManager.push(contactTemp);
                    } else {
                        contactTemp.reference = 1;
                    }
                }
            }
            for (let key = this._contactManager.length - 1; key >= 0; key--) {
                if (this._contactManager[key]) {
                    if (this._contactManager[key].reference == 0) {
                        if (this._onEndedContact) {
                            this._onEndedContact.call(this._contactCaller, this._contactManager[key].collider, this._contactManager[key].normal);
                        }
                        this._contactManager.splice(key, 1);
                    }
                }
            }
        } else {
            // cc.log("null   null ")
            for (let key = this._contactManager.length - 1; key >= 0; key--) {
                if (this._contactManager[key]) {
                    if (this._onEndedContact) {
                        this._onEndedContact.call(this._contactCaller, this._contactManager[key].collider, this._contactManager[key].normal);
                    }
                    this._contactManager.splice(key, 1);
                }
            }
        }
        //清空引用计数
        for (let key in this._contactManager) {
            if (this._contactManager[key]) {
                this._contactManager[key].reference = 0;
            }
        }
    },

    onDestroy() {
        if (this._particleGroup) {
            this._particleGroup.DestroyParticles();
            this._particleGroup = null;
        }
        if (cc.director.getPhysicsManager()._particle) {
            this._world.DestroyParticleSystem(cc.director.getPhysicsManager()._particle);
        }
        this._particleSystem = null;
        this._onBeginContact = null;
        this._onEndedContact = null;
        this._contactCaller = null;
        this._contactManager = null;
        this._splitGroups = null;
        this._drawNodes = null;
    }
    // update (dt) {},
});

/**
 * @function 改变粒子的速度，这个与density(密度)有关，密度越小效果越明显
 * @param velocity 速度 type: cc.Vec2
 */
cc.js.getset(ElasticParticles.prototype, 'linearVelocity',
    function () {
        let temp = this._particleGroup.GetLinearVelocity();
        return new cc.Vec2(temp.x * this.PTM_RATIO, temp.y * this.PTM_RATIO);
    },
    function (velocity) {
        if (velocity && this._particleSystem) {
            let vertsCount = this._particleSystem.GetParticleCount();
            this._particleSystem.ApplyLinearImpulse(0, vertsCount - 1, new b2.Vec2(velocity.x / this.PTM_RATIO, velocity.y / this.PTM_RATIO));
        }
    }
);

ElasticParticles.prototype.getAngle = function () {
    return this._angle;
}
ElasticParticles.prototype.setFillColor = function (color) {
    if (color) {
        this._fillColor = color;
    }
};
/**
 * @function 对粒子添加受力，这个与density(密度)有关，密度越小效果越明显
 * @param force 受力 type: cc.Vec2
 */
ElasticParticles.prototype.applyForce = function (force) {
    if (force) {
        let vertsCount = this._particleSystem.GetParticleCount();
        this._particleSystem.ApplyForce(0, vertsCount - 1, new b2.Vec2(force.x / this.PTM_RATIO, force.y / this.PTM_RATIO));
    }
};

ElasticParticles.prototype.registerBeginContact = function (listener, caller) {
    if (listener && caller) {
        this._onBeginContact = listener;
        this._contactCaller = caller;
    }
};

ElasticParticles.prototype.registerEndedContact = function (listener, caller) {
    if (listener && caller) {
        this._onEndedContact = listener;
        this._contactCaller = caller;
    }
};

ElasticParticles.prototype.canJump = function () {
    if (this._contactManager.length > 0) {
        for (let index = 0; index < this._contactManager.length; index++) {
            const contact = this._contactManager[index];
            // cc.log("contact.normal.y" + contact.normal.y);
            if (contact.normal.y > 0) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

ElasticParticles.prototype.getPointOfElastic = function () {
    let posVerts = this._particleSystem.GetPositionBuffer();
    return new cc.Vec2(posVerts[this._angleIndex].x * this.PTM_RATIO - this._particleCenterPos.x, posVerts[this._angleIndex].y * this.PTM_RATIO - this._particleCenterPos.y)
}

ElasticParticles.prototype.changeRadius = function (radius) {
    if (this._particleGroup) {
        this._particleGroup.DestroyParticles();
    }
    this.node.position = cc.v2(this.node.position.x, this.node.position.y + (radius - this.radius));
    this.radius = radius;
    this.createParticles(true);
    this.initParticleNodes();
}

ElasticParticles.prototype.setProperty = function (fine, elastic, density, damping, gravityScale) {
    if (fine) {
        this.fine = fine;
    }
    if (elastic) {
        this.elastic = elastic;
    }
    if (density) {
        this.density = density;
    }
    if (damping) {
        this.damping = damping;
    }
    if (gravityScale) {
        this.gravityScale = gravityScale;
    }
}

ElasticParticles.prototype.split = function (positions, radius, offsetR) {
    if (positions == null || positions.length <= 0) {
        return;
    }
    if (this._particleGroup) {
        this._particleGroup.DestroyParticles();
    }
    this._splitRadius = radius;
    //增加分裂时主体的大小
    if (offsetR) {
        this.radius = this._splitRadius + offsetR;
    } else {
        this.radius = this._splitRadius + 3.2;//增加分裂时主体的大小
    }
    this.createParticles(true);
    this._splitGroups.length = 0;
    for (let index = 0; index < positions.length; index++) {
        let pos = this.nodePosToParticle(positions[index]);
        this._splitGroups.push(this.createParticleGroup(pos, this._splitRadius / this.PTM_RATIO));
    }
    this.initParticleNodes();
    //清空旧的碰撞信息
    this._contactManager.length = 0;
}

ElasticParticles.prototype.merge = function (forceRatio, step, animCallback, caller) {
    let count = this._splitGroups.length;
    if (count <= 0) {
        cc.log("当前不需要合并！");
        return;
    }
    let center = this._particleGroup.GetCenter();
    center = cc.v2(center.x * this.PTM_RATIO, center.y * this.PTM_RATIO);
    // cc.log("center %f,%f", center.x, center.y);
    let positions = [];
    let tempStep = 0;
    for (let index = this._splitGroups.length - 1; index >= 0; index--) {
        let pos = this._splitGroups[index].GetCenter();
        pos = cc.v2(pos.x * this.PTM_RATIO, pos.y * this.PTM_RATIO);
        let dis = pos.sub(center).mag();
        if (dis <= (this._splitRadius + this.radius)) {
            tempStep = tempStep + step + 8;
            this._splitGroups[index].DestroyParticles();
            this._splitGroups.splice(index, 1);
            if (animCallback && caller) {
                let tempPos = cc.v2(pos.x - this._particleCenterPos.x, pos.y - this._particleCenterPos.y);
                let angle = cc.v2(-10,0).signAngle(tempPos)*180/Math.PI;
                animCallback.call(caller, tempPos,angle);
            }
        } else {
            positions.push(cc.v2(pos.x / this.PTM_RATIO, pos.y / this.PTM_RATIO));
            //给子软体添加力
            let force = center.sub(pos).normalizeSelf().scale(cc.v2(forceRatio, forceRatio));
            this._splitGroups[index].ApplyForce(force);
        }
        // cc.log("pos %f,%f,%f", pos.x, pos.y,dis);
    }
    if (tempStep > 0) {
        this.radius = this.radius + tempStep;
        this.node.position = cc.v2(this.node.position.x, this.node.position.y + tempStep);
        this.createParticles(true);
        this._splitGroups.length = 0;
        for (let i = 0; i < positions.length; i++) {
            this._splitGroups.push(this.createParticleGroup(positions[i], this._splitRadius / this.PTM_RATIO));
        }
        this.initParticleNodes();
        //清空旧的碰撞信息
        this._contactManager.length = 0;
    }
    // cc.log("GetParticleGroupCount () " + this._particleSystem.GetParticleGroupCount());
}

module.exports = ElasticParticles;
