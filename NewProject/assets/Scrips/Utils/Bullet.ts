import { constants } from "../constants";
import { QiangTile } from "./QiangTile";

const {ccclass, property} = cc._decorator;

@ccclass
export class Bullet extends cc.Component {
    private _offset: number = 20;
    private _speed: number = 10;
    
    private direction:number = 1;
    private caller: any = null;
    private callback:Function = null;
    private _tag: string = null;
    private isMove = false;

    onLoad(){
        
    }
    
    update(){
        if(this.isMove){
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
    }

    public shot(direction:number,caller:any,callback:Function){
        this.caller = caller;
        this.callback = callback;

        if (direction == 1 ){
            this.node.rotation = 0;
            this.node.setPosition(cc.v2(0,this.offset));
        }else if (direction == 2 ){
            this.node.rotation = 180;
            this.node.setPosition(cc.v2(0, -this.offset));
        }else if (direction == 3 ){
            this.node.rotation = 270;
            this.node.setPosition(cc.v2(-this.offset,0));
        }else if (direction == 4){
            this.node.rotation = 90;
            this.node.setPosition(cc.v2(this.offset, 0));
        }
        this.direction = direction;
        this.isMove = true;
    }

    // 只在两个碰撞体开始接触时被调用一次
    onCollisionEnter(other, self){
        if (other.node.name != "caodi"){
            if(this.callback){
                this.callback.call(this.caller,this.callback,this.tag);
            }
            //销毁墙放在这里，因为写在墙里会卡顿
            // if (other.node.name == "qiang"){
            //     let tile = other.getComponent("QiangTile") as QiangTile;
            //     tile.injured();
            // }
        }
    }

    public get offset(): number {
        return this._offset;
    }
    public set offset(value: number) {
        this._offset = value;
    }
    public get tag(): string {
        return this._tag;
    }
    public set tag(value: string) {
        this._tag = value;
    }
    public get speed(): number {
        return this._speed;
    }
    public set speed(value: number) {
        this._speed = value;
    }
}
