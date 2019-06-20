import { constants } from "../constants";
import { AsyncLoadPrefabManager } from "../Manager/AsyncLoadPrefabManager";
import { Bullet } from "./Bullet";

const { ccclass, property } = cc._decorator;
@ccclass
export class Tank extends cc.Component {
    private bornPos = new cc.Vec2(-30, -360);
    private _parent: cc.Node;
    //̹tank's speed
    private speed: number = 5;
    private direction: number = 1;
    private isMove = false;
    private isCollision = false;//是否碰撞
    private elastic = 2.5;//弹性
    //bullet
    private bulletPrefab: cc.Prefab = null;
    private bulletTotalTime: number = 0.5;
    private bulletTime: number = this.bulletTotalTime;
    private bullets: Array<Bullet> = new Array<Bullet>();
    private bulletIndex: number = 0;

    public static init(caller: any, callback: Function, parent: cc.Node, bornPos?: cc.Vec2) {
        cc.loader.loadRes(constants.PREFAB_UI_DIR + "Tank", cc.Prefab, (err, prefab) => {
            if (!err) {
                let tankPlayer = cc.instantiate(prefab);

                tankPlayer.parent = parent;
                if (bornPos) {
                    tankPlayer.position = bornPos;
                }
                if (callback) {
                    callback.call(caller, callback, tankPlayer.getComponent("Tank") as Tank);
                }
            } else {
                cc.log("load tank error");
            }
        });
    }

    createBullet() {
        if (this.bulletTime < this.bulletTotalTime) {
            return;
        }
        //子弹
        if (this.bulletPrefab) {
            let bullet: cc.Node = cc.instantiate(this.bulletPrefab);
            bullet.setAnchorPoint(0.5, 0.5);
            bullet.parent = this.node;
            let bulletScript = bullet.getComponent("Bullet") as Bullet;
            bulletScript.tag = "tank_bullet_" + this.bulletIndex;
            this.bulletIndex += 1;
            if (this.bulletIndex >= 10000) {
                this.bulletIndex = 0;
            }
            cc.log("create:" + bulletScript.tag);
            this.bullets.push(bulletScript);
            bulletScript.shot(this.direction, this, this.bulletDestroyCallback);
            //启动子弹倒计时
            this.bulletTime = 0;
            this.unschedule(this.bulletSchedule);
            this.schedule(this.bulletSchedule, 0.1);
        } else {
            cc.log("bulletpr is null");
        }
    }

    bulletSchedule() {
        this.bulletTime += 0.1;
        if (this.bulletTime >= this.bulletTotalTime) {
            this.bulletTime = this.bulletTotalTime;
            this.unschedule(this.bulletSchedule);
        }
    }

    public bulletDestroyCallback(callback: Function, tag: string) {
        for (let i = 0; i < this.bullets.length; ++i) {
            if (this.bullets[i].tag == tag) {
                cc.log("delete:%s", tag);
                this.bullets[i].node.destroy();
                this.bullets.splice(i, 1);
            }
        }
    }

    async onLoad() {
        this.bulletPrefab = await AsyncLoadPrefabManager.getInstance().loadRes(constants.PREFAB_UI_DIR + "bullet_prefab");
    }
    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact, selfCollider, otherCollider) {
        // cc.log("1");
    }

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact(contact, selfCollider, otherCollider) {
        // cc.log("2");
    }

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve(contact, selfCollider, otherCollider) {
        // cc.log("3");
    }

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve(contact, selfCollider, otherCollider) {
        // cc.log("4");
    }

    onCollisionEnter(other, self) {
        cc.log("tank is collision" + other.node.name);
        let otherName = other.node.name;
        if (otherName == "haiyang" || otherName == "qiang" || otherName == "shitou") {
            this.isMove = false;
            this.isCollision = true;
            //回弹
            let mapSize = this.parent.getContentSize();
            let tankSize = this.node.getContentSize();
            if (this.direction == 1) {
                this.node.position = cc.v2(this.node.position.x, Math.min((this.node.position.y - this.elastic), mapSize.height - tankSize.height / 2));
            } else if (this.direction == 2) {
                this.node.position = cc.v2(this.node.position.x, Math.max((this.node.position.y + this.elastic), tankSize.height / 2));
            } else if (this.direction == 3) {
                this.node.position = cc.v2(Math.max((this.node.position.x + this.elastic), tankSize.width / 2), this.node.position.y);
            } else if (this.direction == 4) {
                this.node.position = cc.v2(Math.min((this.node.position.x - this.elastic), mapSize.width - tankSize.width / 2), this.node.position.y);
            }
        }
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
    */
    onCollisionStay(other, self) {
        
    }

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit(other, self) {
        
    }

    private changeAnimation() {
        let animation = this.node.getComponent(cc.Animation);
        animation.play("tank" + this.direction);
    }

    /**
     * shot
     */
    public shot() {
        this.createBullet();
    }

    update() {
        if (this.isMove) {
            let mapSize = this.parent.getContentSize();
            let tankSize = this.node.getContentSize();
            if (this.direction == 1) {
                this.node.position = cc.v2(this.node.position.x, Math.min((this.node.position.y + this.speed), mapSize.height - tankSize.height / 2));
            } else if (this.direction == 2) {
                this.node.position = cc.v2(this.node.position.x, Math.max((this.node.position.y - this.speed), tankSize.height / 2));
            } else if (this.direction == 3) {
                this.node.position = cc.v2(Math.max((this.node.position.x - this.speed), tankSize.width / 2), this.node.position.y);
            } else if (this.direction == 4) {
                this.node.position = cc.v2(Math.min((this.node.position.x + this.speed), mapSize.width - tankSize.width / 2), this.node.position.y);
            }
            // cc.log(" move ... " + this.node.position.x + "," + this.node.position.y);
        }
    }
    /**
     * move
     */
    public move(direction) {
        if (this.isCollision && direction == this.direction) {
            //已经撞击了，方向还是相同，不移动
            return;
        } else if (this.isCollision && direction != this.direction) {
            this.isCollision = false;
            this.direction = direction;
            this.changeAnimation();
            this.isMove = true;
            cc.log("start move");
        } else {
            this.direction = direction;
            this.changeAnimation();
            this.isMove = true;
            cc.log("start move");
        }
    }
    /**
     * stopMove
     */
    public stopMove() {
        this.isMove = false;
        cc.log("end move");
    }

    /**
     * dead
     */
    public dead() {
        this.node.destroy();
    }

    public get parent(): cc.Node {
        return this._parent;
    }
    public set parent(value: cc.Node) {
        this._parent = value;
    }
}