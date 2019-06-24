import { constants } from "../constants";
import { AsyncLoadPrefabManager } from "../Manager/AsyncLoadPrefabManager";
import { Bullet } from "./Bullet";

const { ccclass, property } = cc._decorator;
@ccclass
export class Tank extends cc.Component {
    private bornPos = new cc.Vec2(-30, -360);
    private _parent: cc.Node;
    //̹tank's speed
    private speed: number = 3;
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
    private bulletSpeed:number = 8;

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
            bulletScript.speed = this.bulletSpeed;
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
        this.bulletPrefab = await AsyncLoadPrefabManager.getInstance().loadRes(constants.PREFAB_UI_DIR + "Bullet");
        this.schedule(this.tankSchedule,0.02);
    }

    onCollisionEnter(other, self) {
        cc.log("tank is collision" + other.node.name);
        let otherName = other.node.name;
        if (otherName == "haiyang" || otherName == "qiang" || otherName == "shitou") {
            this.isMove = false;
            if (!this.isCollision){
                this.isCollision = true;
                //回弹
                this.elasticF(other);
            }
        }
    }
    //回弹
    private elasticF(other) {
        //形成回弹系数
        let otherSize: cc.Size = other.node.getContentSize();
        let otherPos: cc.Vec2 = other.node.position;
        let selfSize: cc.Size = this.node.getContentSize();
        let selfPos: cc.Vec2 = this.node.position;
        let distance = 0;
        let curDis = 0;
        if (this.direction == 1) {
            distance = otherSize.height / 2 + selfSize.height / 2;
            curDis = Math.abs(otherPos.y - selfPos.y);
            if (distance > curDis) {
                this.elastic = Math.abs(distance - curDis);
                this.node.position = cc.v2(this.node.position.x, this.node.position.y - this.elastic);
            }
        } else if (this.direction == 2) {
            distance = otherSize.height / 2 + selfSize.height / 2;
            curDis = Math.abs(otherPos.y - selfPos.y);
            if (distance > curDis) {
                this.elastic = Math.abs(distance - curDis);
                this.node.position = cc.v2(this.node.position.x, this.node.position.y + this.elastic);
            }
        } else if (this.direction == 3) {
            distance = otherSize.width / 2 + selfSize.width / 2;
            curDis = Math.abs(otherPos.x - selfPos.x);
            if (distance > curDis) {
                this.elastic = Math.abs(distance - curDis);
                this.node.position = cc.v2(this.node.position.x + this.elastic, this.node.position.y);
            }
        } else if (this.direction == 4) {
            distance = otherSize.width / 2 + selfSize.width / 2;
            curDis = Math.abs(otherPos.x - selfPos.x);
            if (distance > curDis) {
                this.elastic = Math.abs(distance - curDis);
                this.node.position = cc.v2(this.node.position.x - this.elastic, this.node.position.y);
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
        this.isCollision = false;
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

    tankSchedule() {
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

    onDestroy(){
        this.unschedule(this.tankSchedule);
    }
}