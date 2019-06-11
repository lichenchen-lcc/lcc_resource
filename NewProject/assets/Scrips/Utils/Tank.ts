import { constants } from "../constants";

export class Tank {
    private bornPos = new cc.Vec2(-30, -360);
    private parent: cc.Node;
    private tankPlayer: cc.Node;

    //̹tank's speed
    private speed: number = 1;
    private pos:cc.Vec2;
    private direction:number = 0;

    constructor(caller: any, callback: Function, parent: cc.Node,bornPos?:cc.Vec2) {
        this.parent = parent;

        cc.loader.loadRes(constants.PREFAB_UI_DIR + "tank_prefab", cc.Prefab, (err, prefab) => {
            if (!err) {
                this.tankPlayer = cc.instantiate(prefab);

                this.tankPlayer.parent = this.parent;
                this.tankPlayer.position = this.bornPos;
                this.pos = this.bornPos;
                if (bornPos){
                    this.pos = bornPos;
                }
                if (callback) {
                    callback.call(caller, callback);
                }
            } else {
                cc.log("load tank error");
            }
        });
    }

    private changeAnimation() {
        let animation = this.tankPlayer.getComponent(cc.Animation);
        animation.play("tank" + this.direction);
    }
    /**
     * move
     */
    public move(direction) {
        this.direction = direction;
        this.changeAnimation();
        if (direction == 1 ){
            this.pos.y += this.speed;
        }else if(direction == 2 ){
            this.pos.y -= this.speed;
        } else if (direction == 3) {
            this.pos.x -= this.speed;
        } else if (direction == 4 ){
            this.pos.x += this.speed;
        }
        this.tankPlayer.position = this.pos;
    }
}