import { Bullet } from "../Utils/Bullet";


const { ccclass, property } = cc._decorator;
@ccclass
export abstract class Enemy extends cc.Component {
    protected rigidBody: cc.RigidBody;
    protected _className: string = "enemy";
    protected _tag: string = null;
    protected _blood: number = 5;
    protected _speed: number = 50;
    protected _direction: number = 2;
    protected caller: any = null;
    protected callback:Function = null;
    //bullet
    @property(cc.Prefab)
    protected bulletPrefab: cc.Prefab = null;
    protected bulletTotalTime: number = 0.5;
    protected bulletTime: number = this.bulletTotalTime;
    protected bullets: Array<Bullet> = new Array<Bullet>();
    protected bulletIndex:number = 0;
    protected _bulletOffset: number = 15;

    protected onLoad() {
        this.rigidBody = this.getComponent(cc.RigidBody);
        this.createTag();
        this.autoMove();
        this.schedule(this.shotSchedule,0.1);
    }

    protected update(){
        if(this.rigidBody){
            //如果速度等于0后也要换方向
            if (this.rigidBody.linearVelocity.x == 0 && this.rigidBody.linearVelocity.y == 0){
                let newDirect = Math.floor(Math.random() * 4 + 1)
                if (newDirect == this.direction) {
                    this.direction = (newDirect + 2 - 1) % 4 + 1;
                } else {
                    this.direction = newDirect;
                }
                this.autoMove();
            }
        }
    }
    /**
     * initDestroyCallback    */
    public initDestroyCallback(caller:any,callback:Function) {
        this.caller = caller;
        this.callback = callback;
    }

    protected injured() {
        this.blood -= 1;
        if (this.blood <= 0){
            //敌人死亡,死亡回调
            if(this.callback){
                this.callback.call(this.caller,this.callback,this.tag);
            }
        }else{
            // this.node.runAction(cc.blink(2,4));
        }
    }

    // 只在两个碰撞体开始接触时被调用一次
    protected onBeginContact(contact, selfCollider, otherCollider:cc.PhysicsCollider) {
        //只要不是子弹就掉头
        if (otherCollider.node.name == "bullet_prefab"){
            //是否是玩家坦克子弹
            let bulletScript = otherCollider.getComponent("Bullet") as Bullet;
            if (bulletScript.tag.split("_")[0] == "tank"){
                this.injured();
            }
        }else{
            let newDirect = Math.floor(Math.random() * 4 + 1)
            if (newDirect == this.direction) {
                this.direction = (newDirect + 2 - 1) % 4 + 1;
            } else {
                this.direction = newDirect;
            }
            this.autoMove();
        }
    }

    // // 只在两个碰撞体结束接触时被调用一次
    // protected onEndContact(contact, selfCollider, otherCollider: cc.PhysicsCollider) {
    //     if (otherCollider.node.name != "bullet_prefab") {
    //         let newDirect = Math.floor(Math.random() * 4 + 1)
    //         if (newDirect == this.direction) {
    //             this.direction = (newDirect + 1) % 4;
    //         } else {
    //             this.direction = newDirect;
    //         }
    //         this.autoMove();
    //     }
    // }

    // 每次将要处理碰撞体接触逻辑时被调用
    protected onPreSolve(contact, selfCollider, otherCollider) {
        // cc.log("3");
    }

    // 每次处理完碰撞体接触逻辑时被调用
    protected onPostSolve(contact, selfCollider, otherCollider) {
        // cc.log("4");
    }

    protected changeAnimation() {
        let animation = this.node.getComponent(cc.Animation);
        animation.play("heavy_enemy_" + this.direction);
    }
    /**
     * autoMove
     */
    public autoMove() {
        this.changeAnimation();
        let velecity = cc.v2(0, 0);
        if (this.direction == 1) {
            velecity.y = this.speed;
        } else if (this.direction == 2) {
            velecity.y = -1 * this.speed;
        } else if (this.direction == 3) {
            velecity.x = -1 * this.speed;
        } else if (this.direction == 4) {
            velecity.x = this.speed;
        }
        this.rigidBody.linearDamping = 0;
        this.rigidBody.linearVelocity = velecity;
    }
    /**
     * shotSchedule
     */
    public shotSchedule() {
        if (this.bulletTime >= this.bulletTotalTime) {
            this.autoShot();
        } else {
            this.bulletTime += 0.1;
        }
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
            cc.log("create:" + bulletScript.tag);
            this.bulletIndex += 1;
            if(this.bulletIndex >= 10000){
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

    /**
     * createTag用来存储管理当前敌人使用
     */
    public createTag() {
        this.tag = new Date().toString();
        cc.log("create" + this.className + this.tag);
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

    protected onDestroy(){
        this.unschedule(this.shotSchedule);
        //销毁当前的子弹
        if(this.bullets.length>0){
            for(let bullet of this.bullets){
                bullet.node.destroy();
            }
            this.bullets = null;
        }
    }
}
