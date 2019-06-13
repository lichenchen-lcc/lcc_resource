import { constants } from "../constants";
import { AsyncLoadPrefabManager } from "../Manager/AsyncLoadPrefabManager";
import { Bullet } from "./Bullet";

const { ccclass, property } = cc._decorator;
@ccclass
export class Tank extends cc.Component {
    private bornPos = new cc.Vec2(-30, -360);
    private parent: cc.Node;
    private rigidBody: cc.RigidBody;

    //̹tank's speed
    private speed: number = 50;
    private direction: number = 1;

    //bullet
    private bulletPrefab:cc.Prefab = null;
    private bulletTime:number = 1;
    private bullets:Array<Bullet> = new Array<Bullet>();

    public static init(caller: any, callback: Function, parent: cc.Node, bornPos?: cc.Vec2) {
        cc.loader.loadRes(constants.PREFAB_UI_DIR + "tank_prefab", cc.Prefab, (err, prefab) => {
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

    createBullet(){
        //子弹
        if (this.bulletPrefab) {
            let bullet: cc.Node = cc.instantiate(this.bulletPrefab);
            bullet.setAnchorPoint(0.5, 0.5);
            bullet.parent = this.node;
            let bulletScript = bullet.getComponent("Bullet") as Bullet;
            this.bullets.push(bulletScript);
            bulletScript.shot(this.direction,this,this.bulletDestroyCallback);
        } else {
            cc.log("bulletpr is null");
        }
    }

    public bulletDestroyCallback(callback:Function,tag:string){
        for(let i = 0;i< this.bullets.length;++i){    
            if (this.bullets[i].tag == tag){
                cc.log("delete bullet name is %s", tag);
                this.bullets[i].node.destroy();
                this.bullets.splice(i,1);
            }
        }
    }

    async onLoad() {
        this.rigidBody = this.getComponent(cc.RigidBody);
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
        cc.log("tank is collision");
        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        let world = self.world;

        // 碰撞组件的 aabb 碰撞框
        let aabb = world.aabb;

        // 节点碰撞前上一帧 aabb 碰撞框的位置
        let preAabb = world.preAabb;

        // 碰撞框的世界矩阵
        let t = world.transform;

        // 以下属性为圆形碰撞组件特有属性
        let r = world.radius;
        let p = world.position;

        // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        let ps = world.points;
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
    */
    onCollisionStay(other, self) {
        cc.log('on collision stay');
    }

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit(other, self) {
        console.log('on collision exit');
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
    /**
     * move
     */
    public move(direction) {
        this.direction = direction;
        this.changeAnimation();
        let velecity = cc.v2(0, 0);
        if (direction == 1) {
            velecity.y = this.speed;
        } else if (direction == 2) {
            velecity.y = -1 * this.speed;
        } else if (direction == 3) {
            velecity.x = -1 * this.speed;
        } else if (direction == 4) {
            velecity.x = this.speed;
        }
        this.rigidBody.linearDamping = 0;
        this.rigidBody.linearVelocity = velecity;
        //不能用力，会有惯性
        // this.rigidBody.applyForceToCenter(velecity,true);
    }
    /**
     * stopMove
     */
    public stopMove() {
        this.rigidBody.linearVelocity = cc.v2(0, 0);
        // this.rigidBody.applyForceToCenter(cc.v2(0, 0), false);
    }

    /**
     * dead
     */
    public dead() {
        this.node.destroy();
    }
}