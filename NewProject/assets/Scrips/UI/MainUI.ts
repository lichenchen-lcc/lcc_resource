import { BaseUI } from "./BaseUI";
import { LoadingUI } from "./LoadingUI";
import { UIManager } from "../Manager/UIManager";
import { TankMapDataManager } from "../Manager/TankMapDataManager";
import { constants } from "../constants";
import { Tank } from "../Utils/Tank";
import { MapManager } from "../Manager/MapManager";
import { Tile } from "../Utils/Tile";
import { EnemyManager } from "../Manager/EnemyManager";


const { ccclass, property } = cc._decorator;

@ccclass
export class MainUI extends BaseUI {

    protected className = "MainUI";

    @property(cc.Node)
    private hinder:cc.Node = null;
    @property(cc.Node)
    private mapLayer: cc.Node;
    @property(cc.Node)
    private menu: cc.Node = null;

    private tanks: Array<Tank> = [];
    private tiles: Array<Tile> = [];
    private isTouch: boolean = false;
    private direction: number = 0;

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = new cc.Vec2(0, 0);
        cc.director.getPhysicsManager().debugDrawFlags = 1;
        
        this.isTouch = false;
        //移除LoadingUI
        UIManager.getInstance().closeUI("LoadingUI");
        let direction_btn = this.menu.getChildByName("direction_btn").getComponent(cc.Button);
        direction_btn.node.on(cc.Node.EventType.TOUCH_START, this.directionStart, this);
        direction_btn.node.on(cc.Node.EventType.TOUCH_END, this.directionEnd, this);
        let shot_btn = this.menu.getChildByName("shot_btn").getComponent(cc.Button);
        shot_btn.node.on(cc.Node.EventType.TOUCH_END, this.shotHandler,this);
        //加载地图图块
        Tile.init(this, this.initMapCallback);
        //生成墙
        this.initHinder();
    }

    initHinder(){
        let mapSize = this.mapLayer.getContentSize();
        
    }

    initMapCallback(){
        //创建地图
        let mapSize = this.mapLayer.getContentSize();
        let tileSize = cc.size(16, 16);
        let values = MapManager.getInstance().values;
        for (let j = 0; j < values.length; j++) {
            for (let i = 0; i < values[j].length; i++) {
                //cc.log(i + "," + j);
                if (values[j][i] > 0) {
                    let pos = new cc.Vec2(i * (tileSize.width) + tileSize.width / 2, mapSize.height - (j * (tileSize.height) + tileSize.height / 2 ));
                    let constracttemp = Tile.constract[parseInt(values[j][i])];
                    // cc.log(constracttemp);
                    let prefab: cc.Prefab = Tile.prefabs.get(constracttemp);
                    if (prefab){
                        let tile:cc.Node = cc.instantiate(prefab);
                        tile.parent = this.mapLayer;
                        tile.setAnchorPoint(0.5,0.5);
                        tile.setPosition(pos);
                        let tileScript = tile.getComponent("Tile") as Tile;
                        tileScript.name = constracttemp;
                        this.tiles.push(tileScript);
                    }
                }
            }
        }
        Tank.init(this, this.initTankCallback, this.mapLayer, new cc.Vec2(mapSize.width / 2 - tileSize.width * 2, tileSize.height * 1));
    }

    initTankCallback(callback,tank:Tank) {
        this.tanks.push(tank);
        EnemyManager.getInstance().createrEnemy(1,this.mapLayer, this.mapLayer.getContentSize());
        this.isTouch = true;
    }

    // start () {
    //     let values = TankMapDataManager.getInstance().values
    //     for (let value of values){
    //         cc.log(value.get("name"));
    //     }
    // }

    update(dt) {
        
    }

    shotHandler(event){
        if (!this.isTouch) {
            return;
        }
        for (let tank of this.tanks){
            if(tank){
                tank.shot();
            }
        }
    }

    action(isMove:boolean) {
        for (let tank of this.tanks) {
            if (tank) {
                if (isMove){
                    tank.move(this.direction);
                }else{
                    tank.stopMove();
                }
            }
        }
    }

    directionStart(event) {
        if (!this.isTouch) {
            return;
        }
        this.getDirection(event);
        this.action(true);
    }

    directionEnd(event) {
        if (!this.isTouch) {
            return;
        }
        this.action(false);
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
