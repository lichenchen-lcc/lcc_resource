import { BaseUI } from "./BaseUI";
import { LoadingUI } from "./LoadingUI";
import { UIManager } from "../Manager/UIManager";
import { TankMapDataManager } from "../Manager/TankMapDataManager";
import { constants } from "../constants";
import { Tank } from "../Utils/Tank";
import { MapManager } from "../Manager/MapManager";
import { Tile } from "../Utils/Tile";


const { ccclass, property } = cc._decorator;

@ccclass
export class MainUI extends BaseUI {

    protected className = "MainUI";


    @property(cc.Node)
    private mapLayer: cc.Node;
    @property(cc.Node)
    private menu: cc.Node = null;

    private tanks: Array<Tank> = [];
    private tiles: Array<Tile> = [];
    private isTouch: boolean = false;
    private isMove: boolean = false;
    private direction: number = 0;

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = new cc.Vec2(0, 0);
        this.isTouch = false;
        //移除LoadingUI
        UIManager.getInstance().closeUI("LoadingUI");
        let direction_btn = this.menu.getChildByName("direction_btn").getComponent(cc.Button);
        direction_btn.node.on(cc.Node.EventType.TOUCH_START, this.directionStart, this);
        direction_btn.node.on(cc.Node.EventType.TOUCH_END, this.directionEnd, this);
        //创建地图
        let mapSize = this.mapLayer.getContentSize();
        let tileSize = cc.size(16, 16);
        let values = MapManager.getInstance().values;
        for (let j = 0; j < values.length; j++) {
            for (let i = 0; i < values[j].length; i++) {
                    cc.log(i + "," + j);
                if (values[j][i] > 0) {
                    let pos = new cc.Vec2(i * (tileSize.width) + tileSize.width / 2 - mapSize.width / 2, -(j * (tileSize.height) + tileSize.height / 2 - mapSize.height / 2 ));
                    this.tiles.push(new Tile(this, this.initMapCallback,this.mapLayer,pos,values[j][i]));
                }
            }
        }
        this.tanks.push(new Tank(this, this.initTankCallback, this.mapLayer));
    }

    initMapCallback(){

    }

    initTankCallback() {
        this.isTouch = true;
    }

    // start () {
    //     let values = TankMapDataManager.getInstance().values
    //     for (let value of values){
    //         cc.log(value.get("name"));
    //     }
    // }

    update(dt) {
        if (this.isMove) {
            this.move();
        }
    }

    move() {
        for (let tank of this.tanks) {
            if (tank) {
                tank.move(this.direction);
            }
        }
    }

    directionStart(event) {
        if (!this.isTouch) {
            return;
        }
        this.getDirection(event);
        this.isMove = true;
    }

    directionEnd(event) {
        if (!this.isTouch) {
            return;
        }
        this.isMove = false;
    }
    /**
     * directionHandler
     */
    getDirection(event) {
        let button = event.target.getComponent(cc.Button);
        let size = event.getCurrentTarget().getContentSize();
        let position = event.getLocation();


        let centerPoint = new cc.Vec2(size.width / 2, size.height / 2);

        this.direction = 0;
        if (centerPoint.x == position.x) {
            if (position.y >= centerPoint.y) {
                this.direction = 1;
            } else {
                this.direction = 2;
            }
        } else {
            let rate = (position.y - centerPoint.y) / (position.x - centerPoint.x);
            if (rate <= 1 && rate > -1 && position.x >= centerPoint.x) {
                this.direction = 4;
            } else if (rate <= 1 && rate > -1 && position.x < centerPoint.x) {
                this.direction = 3;
            } else if ((rate > 1 || rate <= -1) && position.y >= centerPoint.y) {
                this.direction = 1;
            } else if ((rate > 1 || rate <= -1) && position.y < centerPoint.y) {
                this.direction = 2;
            }
        }
    }

    onDestroy() {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getPhysicsManager().enabled = false;
    }
}
