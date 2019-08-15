import { constants } from "../constants";
import { AsyncLoadPrefabManager } from "../Manager/AsyncLoadPrefabManager";
import { Bullet } from "./Bullet";
import { BulletManager } from "../Manager/BulletManager";
import { ScoreManager } from "../Manager/ScoreManager";

const { ccclass, property } = cc._decorator;
@ccclass
export class Tank extends cc.Component {
    private bornPos = new cc.Vec2(-30, -360);
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
    private bulletSpeed:number = 8;
    private bulletPool:cc.NodePool = null;

    private maxBlood:number = 10;
    private blood:number = this.maxBlood;
    private tankBlood:cc.ScrollView = null;

    public static init(caller: any, callback: Function, parent: cc.Node, bornPos?: cc.Vec2) {
        cc.loader.loadRes(constants.PREFAB_DIR + "Tank", cc.Prefab, (err, prefab) => {
            if (!err) {
                let tank = cc.instantiate(prefab);

                tank.parent = parent;
                if (bornPos) {
                    tank.position = bornPos;
                }
                if (callback) {
                    callback.call(caller, callback, tank.getComponent("Tank"));
                }
            } else {
                cc.log("load tank error");
            }
        });
    }
    /**
     * injured
     */
    public injured() {
        this.blood -= 1;
        ScoreManager.getInstance().playerBlood = this.blood;
        this.tankBloodChange();
        if (this.blood <= 0 ){
            cc.log("you  die ");
            this.node.destroy();
            return;
        }
    }

    tankBloodChange(tankBlood?: cc.ScrollView) {
        let content: cc.Node = null;
        if (tankBlood){
            content = tankBlood.content;
            if(this.tankBlood == null){
                this.tankBlood = tankBlood;
            }
        }else{
            content = this.tankBlood.content;
        }
        let baseBlood: cc.Node = content.getChildByName("blood1");
        for (let i = 1; i <= this.maxBlood; i++) {
            let child: cc.Node = content.getChildByName("blood" + i);
            if (child == null) {
                child = cc.instantiate(baseBlood);
                content.addChild(child);
                child.name = "blood" + i;
            }
            if (i > this.blood) {
                child.color = cc.Color.BLACK;
            }
        }
    }

    createBullet() {
        if (this.bulletTime < this.bulletTotalTime) {
            return;
        }
        //子弹
        if (this.bulletPrefab) {
            let bullet: cc.Node = BulletManager.getInstance().createBullet();
            bullet.setAnchorPoint(0.5, 0.5);
            bullet.parent = this.node;
            let bulletScript = bullet.getComponent("Bullet") as Bullet;
            bulletScript.tag = "tank_bullet";
            bulletScript.speed = this.bulletSpeed;
            bulletScript.shot(this.direction);
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

    async onLoad() {
        this.bulletPrefab = await AsyncLoadPrefabManager.getInstance().loadRes(constants.PREFAB_DIR + "Bullet");
        this.bulletPool = new cc.NodePool();
        this.schedule(this.tankSchedule,0.02);
    }

    onCollisionEnter(other, self) {
        // cc.log("tank is collision" + other.node.name);
        let otherName:string = other.node.name;
        if (otherName == "haiyang" || otherName == "qiang" || otherName == "shitou") {
            this.isMove = false;
            if (!this.isCollision){
                this.isCollision = true;
                //回弹
                this.elasticF(other);
            }
        } else if (otherName.indexOf("Enemy") >= 0){
            //碰到敌人后不反弹
            this.isMove = false;
            if (!this.isCollision) {
                this.isCollision = true;
            }
        }else if(otherName == "Bullet"){
            //是否是玩家坦克子弹
            let bulletScript = other.getComponent("Bullet") as Bullet;
            if (bulletScript.tag.split("_")[0] == "enemy") {
                this.injured();
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
            let mapSize = this.node.parent.getContentSize();
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
            // cc.log("start move");
        } else {
            this.direction = direction;
            this.changeAnimation();
            this.isMove = true;
            // cc.log("start move");
        }
    }
    /**
     * stopMove
     */
    public stopMove() {
        this.isMove = false;
        // cc.log("end move");
    }

    /**
     * dead
     */
    public dead() {
        this.node.destroy();
    }

    onDestroy(){
        this.unschedule(this.tankSchedule);
        this.unschedule(this.bulletSchedule);
        this.bulletPool.clear();
    }
}