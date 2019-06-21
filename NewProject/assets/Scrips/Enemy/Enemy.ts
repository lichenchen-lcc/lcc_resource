import { Bullet } from "../Utils/Bullet";


const { ccclass, property } = cc._decorator;
@ccclass
export abstract class Enemy extends cc.Component {
    private _className: string = "Enemy";
    private _tag: string = "";
    private _blood: number = 5;
    private _speed: number = 3;
    private _direction: number = 2;
    private _preDirection: number = this.direction;
    private _elastic = 4;
    protected caller: any = null;
    protected callback: Function = null;
    //bullet
    @property(cc.Prefab)
    protected bulletPrefab: cc.Prefab = null;
    protected bulletTotalTime: number = 0.5;
    protected bulletTime: number = this.bulletTotalTime;
    protected bullets: Array<Bullet> = new Array<Bullet>();
    protected bulletIndex: number = 0;
    private _bulletSpeed: number = 8;
    private _bulletOffset: number = 15;

    protected onLoad() {
        this.schedule(this.enemySchedule, 0.02);
    }
    /**
     * enemySchedule
     */
    protected enemySchedule() {
        //移动
        if (this.direction != this.preDirection) {
            this.preDirection = this.direction;
            this.changeAnimation();
        }
        this.move();
        //射击
        if (this.bulletTime >= this.bulletTotalTime) {
            this.autoShot();
        } else {
            this.bulletTime += 0.1;
        }
    }
    protected move() {
        cc.log("----------"+this.direction);
        if (this.direction == 1) {
            this.node.position = cc.v2(this.node.position.x, this.node.position.y + this.speed);
        } else if (this.direction == 2) {
            this.node.position = cc.v2(this.node.position.x, this.node.position.y - this.speed);
        } else if (this.direction == 3) {
            this.node.position = cc.v2(this.node.position.x - this.speed, this.node.position.y);
        } else if (this.direction == 4) {
            this.node.position = cc.v2(this.node.position.x + this.speed, this.node.position.y);
        }
    }
    //再移动的过程中更换方向
    protected randDirection(){
        if (Math.random() * 10 == 7){
            this.turnd();
        }
    }
    /**
     * initDestroyCallback    */
    public initDestroyCallback(caller: any, callback: Function) {
        this.caller = caller;
        this.callback = callback;
    }

    protected injured() {
        this.blood -= 1;
        if (this.blood <= 0) {
            //敌人死亡,死亡回调
            if (this.callback) {
                this.callback.call(this.caller, this.callback, this.tag);
            }
        } else {
            this.node.runAction(cc.blink(2,4));
        }
    }

    // 只在两个碰撞体开始接触时被调用一次
    protected onCollisionEnter(other, self) {
        //只要不是子弹就掉头if () {
        let otherName = other.node.name;
        if (otherName == "bullet_prefab") {
            //是否是玩家坦克子弹
            let bulletScript = other.getComponent("Bullet") as Bullet;
            if (bulletScript.tag.split("_")[0] == "tank") {
                this.injured();
            }
        } else if (otherName == "haiyang" || otherName == "qiang" || otherName == "shitou" || otherName == "hinder"){
            cc.log("peng zhuang le "  + this.direction);
            this.elasticF();
            this.turnd();
        }
    }
    //回弹
    protected elasticF(){
        if (this.direction == 1) {
            this.node.position = cc.v2(this.node.position.x, this.node.position.y - this.elastic);
        } else if (this.direction == 2) {
            this.node.position = cc.v2(this.node.position.x, this.node.position.y + this.elastic);
        } else if (this.direction == 3) {
            this.node.position = cc.v2(this.node.position.x + this.elastic, this.node.position.y);
        } else if (this.direction == 4) {
            this.node.position = cc.v2(this.node.position.x - this.elastic, this.node.position.y);
        }
        // //形成回弹系数
        // let otherSize: cc.Size = other.node.getContentSize();
        // let otherPos: cc.Vec2 = other.node.position;
        // let selfSize: cc.Size = this.node.getContentSize();
        // let selfPos: cc.Vec2 = this.node.position;
        // let distance = 0;
        // let curDis = 0;
        // cc.log("----" + this.node.position.x + "," + this.node.position.y);
        // if (this.direction == 1) {
        //     distance = otherSize.height / 2 + selfSize.height / 2;
        //     curDis = Math.abs(otherPos.y - selfPos.y);
        //     if (distance > curDis) {
        //         this.elastic = Math.abs(distance - curDis);
        //         this.node.position = cc.v2(this.node.position.x, this.node.position.y - this.elastic);
        //     }
        // } else if (this.direction == 2) {
        //     distance = otherSize.height / 2 + selfSize.height / 2;
        //     curDis = Math.abs(otherPos.y - selfPos.y);
        //     if (distance > curDis) {
        //         this.elastic = Math.abs(distance - curDis);
        //         this.node.position = cc.v2(this.node.position.x, this.node.position.y + this.elastic);
        //     }
        // } else if (this.direction == 3) {
        //     distance = otherSize.height / 2 + selfSize.height / 2;
        //     curDis = Math.abs(otherPos.y - selfPos.y);
        //     if (distance > curDis) {
        //         this.elastic = Math.abs(distance - curDis);
        //         this.node.position = cc.v2(this.node.position.x + this.elastic, this.node.position.y);
        //     }
        // } else if (this.direction == 4) {
        //     distance = otherSize.height / 2 + selfSize.height / 2;
        //     curDis = Math.abs(otherPos.y - selfPos.y);
        //     if (distance > curDis) {
        //         this.elastic = Math.abs(distance - curDis);
        //         this.node.position = cc.v2(this.node.position.x - this.elastic, this.node.position.y);
        //     }
        // }
        // cc.log("*****" + this.node.position.x + "," + this.node.position.y);
    }
    //掉头
    protected turnd(){
        //随机有一个新方向
        let newDirect = Math.floor(Math.random() * 4 + 1)
        if (newDirect == this.direction) {
            this.direction = (newDirect + 2 - 1) % 4 + 1;
        } else {
            this.direction = newDirect;
        }
    }

    protected changeAnimation() {
        let animation = this.node.getComponent(cc.Animation);
        animation.play("heavy_enemy_" + this.direction);
    }
    /**
     * autoShot
     */
    public autoShot() {
        this.bulletTime = 0;
        //子弹
        if (this.bulletPrefab) {
            let bullet: cc.Node = cc.instantiate(this.bulletPrefab);
            bullet.setAnchorPoint(0.5, 0.5);
            bullet.parent = this.node;
            let bulletScript = bullet.getComponent("Bullet") as Bullet;
            bulletScript.tag = "enemy_bullet_" + this.bulletIndex;
            bulletScript.offset = this.bulletOffset;
            bulletScript.speed = this.bulletSpeed;
            cc.log("create:" + bulletScript.tag);
            this.bulletIndex += 1;
            if (this.bulletIndex >= 10000) {
                this.bulletIndex = 0;
            }
            this.bullets.push(bulletScript);
            bulletScript.shot(this.direction, this, this.bulletDestroyCallback);
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

    public get tag(): string {
        return this._tag;
    }
    public set tag(value: string) {
        this._tag = value;
    }
    public get className(): string {
        return this._className;
    }
    public set className(value: string) {
        this._className = value;
    }
    public get blood(): number {
        return this._blood;
    }
    public set blood(value: number) {
        this._blood = value;
    }
    public get speed(): number {
        return this._speed;
    }
    public set speed(value: number) {
        this._speed = value;
    }
    public get bulletOffset(): number {
        return this._bulletOffset;
    }
    public set bulletOffset(value: number) {
        this._bulletOffset = value;
    }

    public get direction(): number {
        return this._direction;
    }
    public set direction(value: number) {
        this._direction = value;
    }
    public get preDirection(): number {
        return this._preDirection;
    }
    public set preDirection(value: number) {
        this._preDirection = value;
    }
    public get elastic() {
        return this._elastic;
    }
    public set elastic(value) {
        this._elastic = value;
    }
    public get bulletSpeed(): number {
        return this._bulletSpeed;
    }
    public set bulletSpeed(value: number) {
        this._bulletSpeed = value;
    }

    protected onDestroy() {
        this.unschedule(this.enemySchedule);
        //销毁当前的子弹
        if (this.bullets.length > 0) {
            for (let bullet of this.bullets) {
                bullet.node.destroy();
            }
            this.bullets = null;
        }
    }
}
