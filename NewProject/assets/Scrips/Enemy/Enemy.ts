import { Bullet } from "../Utils/Bullet";
import { BulletManager } from "../Manager/BulletManager";


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
    private isMove = true;
    private _scheduleInterval = 0.02;
    protected caller: any = null;
    protected callback: Function = null;
    //bullet
    @property(cc.Prefab)
    protected bulletPrefab: cc.Prefab = null;
    protected bulletTotalTime: number = 0.5;
    protected bulletTime: number = this.bulletTotalTime;
    private _bulletSpeed: number = 8;
    private _bulletOffset: number = 25;

    protected onLoad() {
        this.schedule(this.enemySchedule, this.scheduleInterval);
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
        if(!this.isMove){
            return;
        }
        // cc.log("----------"+this.direction);
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
        if (otherName == "Bullet") {
            //是否是玩家坦克子弹
            let bulletScript = other.getComponent("Bullet") as Bullet;
            if (bulletScript.tag.split("_")[0] == "tank") {
                this.injured();
            }
        } else if (otherName == "haiyang" || otherName == "qiang" || otherName == "shitou" || otherName == "hinder"){
            if (this.isMove){
                this.isMove = false;
                // cc.log("peng zhuang le :" + otherName +":" + this.direction);
                this.elasticF(other);
                this.turnd();
            }
        } else if (otherName == "Tank"){
            //碰撞了玩家坦克后不会反弹、不会掉头，会直接停止
            if (this.isMove) {
                //判断 玩家坦克在哪个方向
                let selfPos = this.node.position;
                let otherPos = other.node.position;
                let selfSize = this.node.getContentSize();
                let otherSize = other.node.getContentSize();
                let direction = 0;
                if (Math.abs(otherPos.y - selfPos.y) >= Math.abs(otherPos.x - selfPos.x)){
                    if (otherPos.y - selfPos.y >= 0){
                        direction = 1;
                    }else{
                        direction = 2;
                    }
                }else{
                    if (otherPos.x - selfPos.x >= 0){
                        direction = 4;
                    }else{
                        direction = 3;
                    }
                }
                if (this.direction == direction){
                    this.isMove = false;
                    // this.elasticF(other);
                    // this.turnd();
                }
            }
        }
    }

    protected onCollisionExit(other, self){
        this.isMove = true;
    }
    //回弹
    protected elasticF(other){
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
                this.elastic = Math.abs(distance - curDis) + 1;
                this.node.position = cc.v2(this.node.position.x, this.node.position.y - this.elastic);
            }
        } else if (this.direction == 2) {
            distance = otherSize.height / 2 + selfSize.height / 2;
            curDis = Math.abs(otherPos.y - selfPos.y);
            if (distance > curDis) {
                this.elastic = Math.abs(distance - curDis) + 1;
                this.node.position = cc.v2(this.node.position.x, this.node.position.y + this.elastic);
            }
        } else if (this.direction == 3) {
            distance = otherSize.width / 2 + selfSize.width / 2;
            curDis = Math.abs(otherPos.x - selfPos.x);
            if (distance > curDis) {
                this.elastic = Math.abs(distance - curDis) + 1;
                this.node.position = cc.v2(this.node.position.x + this.elastic, this.node.position.y);
            }
        } else if (this.direction == 4) {
            distance = otherSize.width / 2 + selfSize.width / 2;
            curDis = Math.abs(otherPos.x - selfPos.x);
            if (distance > curDis) {
                this.elastic = Math.abs(distance - curDis) + 1;
                this.node.position = cc.v2(this.node.position.x - this.elastic, this.node.position.y);
            }
        }
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
        animation.play(this.node.name + "_" + this.direction);
    }

    protected stopAnimation(){
        let animation = this.node.getComponent(cc.Animation);
        animation.stop(this.node.name + "_" + this.direction);
    }
    /**
     * autoShot
     */
    public autoShot() {
        this.bulletTime = 0;
        //子弹
        if (this.bulletPrefab) {
            let bullet: cc.Node = BulletManager.getInstance().createBullet();
            if (bullet){
                bullet.setAnchorPoint(0.5, 0.5);
                bullet.parent = this.node;
                let bulletScript = bullet.getComponent("Bullet") as Bullet;
                bulletScript.tag = "enemy_bullet";
                bulletScript.offset = this.bulletOffset;
                bulletScript.speed = this.bulletSpeed;
                bulletScript.shot(this.direction);
            }else{
                cc.log("8888888888888888888888");
            }
        }
    }
    public get scheduleInterval() {
        return this._scheduleInterval;
    }
    public set scheduleInterval(value) {
        this._scheduleInterval = value;
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
    }
}
