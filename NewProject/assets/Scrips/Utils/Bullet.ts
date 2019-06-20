import { constants } from "../constants";

const {ccclass, property} = cc._decorator;

@ccclass
export class Bullet extends cc.Component {
    private _offset: number = 20;
    private speed: number = 100;
    private rigidBody:cc.RigidBody = null;
    private direction:number = 1;
    private caller: any = null;
    private callback:Function = null;

    private _tag: string = null;
    public get tag(): string {
        return this._tag;
    }
    public set tag(value: string) {
        this._tag = value;
    }

    onLoad(){
        this.rigidBody = this.getComponent(cc.RigidBody);
    }

    public shot(direction:number,caller:any,callback:Function){
        this.caller = caller;
        this.callback = callback;

        let velocity = cc.v2(0,0);
        if (direction == 1 ){
            velocity.y = this.speed;
            this.node.rotation = 0;
            this.node.setPosition(cc.v2(0,this.offset));
        }else if (direction == 2 ){
            velocity.y = -this.speed;
            this.node.rotation = 180;
            this.node.setPosition(cc.v2(0, -this.offset));
        }else if (direction == 3 ){
            velocity.x = -this.speed;
            this.node.rotation = 270;
            this.node.setPosition(cc.v2(-this.offset,0));
        }else if (direction == 4){
            velocity.x = this.speed;
            this.node.rotation = 90;
            this.node.setPosition(cc.v2(this.offset, 0));
        }
        this.direction = direction;
        this.rigidBody.linearDamping = 0;
        this.rigidBody.linearVelocity = velocity;
    }

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact, selfCollider, otherCollider:cc.PhysicsCollider) {
        //除了玩家坦克和子弹外，都销毁自身
        //提醒坦克当前子弹已经销毁
        if(this.callback){
            this.callback.call(this.caller,this.callback,this.tag);
        }
    }

    public get offset(): number {
        return this._offset;
    }
    public set offset(value: number) {
        this._offset = value;
    }
}
