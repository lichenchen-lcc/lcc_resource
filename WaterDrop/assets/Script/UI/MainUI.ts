import { BaseUI } from "./BaseUI";
import { LoadingUI } from "./LoadingUI";
import { UIManager } from "../Manager/UIManager";
import { TankMapDataManager } from "../Manager/TankMapDataManager";
import { constants } from "../constants";
import { MapManager } from "../Manager/MapManager";
import { EnemyManager } from "../Manager/EnemyManager";
import { BulletManager } from "../Manager/BulletManager";
import { Player } from "../Utils/Player";


const { ccclass, property } = cc._decorator;

@ccclass
export class MainUI extends BaseUI {

    protected className = "MainUI";

    @property(cc.Node)
    private menu: cc.Node = null;

    @property(cc.Node)
    private map: cc.Node = null;
    private player: Player = null;

    private direction_btn:cc.Button = null;
    private direcBtnPos: cc.Vec2 = null;
    private directBg: cc.Node = null;

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        // cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().gravity = new cc.Vec2(0, 0);
        // cc.director.getPhysicsManager().debugDrawFlags = 1;
        // BulletManager.getInstance();

        //移除LoadingUI
        // UIManager.getInstance().closeUI("LoadingUI");

        this.direction_btn = this.menu.getChildByName("direction_btn").getComponent(cc.Button);
        this.direction_btn.node.on(cc.Node.EventType.TOUCH_START, this.directionStart, this);
        this.direction_btn.node.on(cc.Node.EventType.TOUCH_MOVE, this.directionMove, this);
        this.direction_btn.node.on(cc.Node.EventType.TOUCH_END, this.directionEnd, this);
        this.direction_btn.node.on(cc.Node.EventType.TOUCH_CANCEL, this.directionCancel, this);
        this.directBg = this.direction_btn.node.getChildByName("bg");
        this.directBg.opacity = 0;
        //加载玩家
        this.initPlayer();
    }

    initPlayer() {
        let url = constants.PREFAB_DIR + "Player";
        cc.loader.loadRes(url,cc.Prefab,(error,prefab)=>{
            if(error){
                cc.log("player prefab is error!!");
                return;
            }
            let playerNode: cc.Node = cc.instantiate(prefab);
            this.player = playerNode.getComponent("Player");
            playerNode.parent = this.map;
            this.initPlayerCallback();
        });
    }

    initPlayerCallback(){
        // cc.log("999999999999999" + this.player.node.position.x + "," + this.player.node.position.y);
    }

    update(dt) {

    }


    directionStart(event) {
        this.direcBtnPos = event.getLocation();
        //纠正位置
        let directSize: cc.Size = this.direction_btn.node.getContentSize();
        //this.direcBtnPos = cc.v2(directSize.width/2,this.direcBtnPos.y);
        this.directBg.position = this.direction_btn.node.convertToNodeSpaceAR(this.direcBtnPos);
        //显示方向键
        let anim: cc.Animation = this.directBg.getComponent(cc.Animation);
        anim.play("DirectionAnimShow");
        //玩家开始移动
        this.player.isMove = true;
    }

    directionMove(event) {
        let curPos: cc.Vec2 = event.getLocation();
        //达到一定距离再移动
        let temp = event.getDelta();

        cc.log("curPos:x=%f,y=%f", temp.x, temp.y);
        // cc.log("curPos:x=%f,y=%f", curPos.x, curPos.y);
        // cc.log("this.direcBtnPos:x=%f,y=%f", this.direcBtnPos.x, this.direcBtnPos.y);

        // let tempDis = Math.sqrt(Math.pow(curPos.x - this.direcBtnPos.x, 2) + Math.pow(curPos.y - this.direcBtnPos.y, 2));
        // if (tempDis < 20){
        //     // cc.log("7777");
        //     return;
        // }
        

        let angle: number = 0;
        if ((curPos.x - this.direcBtnPos.x) == 0) {
            if (curPos.y > this.direcBtnPos.y) {
                // cc.log("000000000000000000000000");
                angle = 90;
            } else if (curPos.y < this.direcBtnPos.y) {
                angle = 270;
            }
        } else {
            angle = Math.atan((curPos.y - this.direcBtnPos.y) / (curPos.x - this.direcBtnPos.x));
            angle = angle * (180 / Math.PI);
            if ((curPos.x - this.direcBtnPos.x) < 0){
                angle = angle + 180;
            } 
        }
        
        //arrow移动
        let arrow = this.directBg.getChildByName("arrow");
        let radius = 50;
        let radian = angle * (Math.PI/180);
        if (arrow){
            arrow.position = cc.v2(Math.cos(radian) * radius, Math.sin(radian) * radius);
        }

        this.player.move(angle);

        // this.direcBtnPos = curPos;
    }

    directionEnd(event) {
        //隐藏方向键
        let anim: cc.Animation = this.directBg.getComponent(cc.Animation);
        anim.play("DirectionAnimHide");
        this.player.isMove = false;
    }

    directionCancel(event){
        //隐藏方向键
        let anim: cc.Animation = this.directBg.getComponent(cc.Animation);
        anim.play("DirectionAnimHide");
        this.player.isMove = false;
    }


    onDestroy() {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getPhysicsManager().enabled = false;
        BulletManager.getInstance().clear();
        EnemyManager.getInstance().clear();
    }
}
