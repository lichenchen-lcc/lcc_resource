import { Enemy } from "./Enemy";

const { ccclass, property } = cc._decorator;

@ccclass
export class HeavyEnemy extends Enemy {

    //速度坦克
    onLoad() {
        this.speed = 3;
        this.blood = 3;
        this.bulletOffset = 25;
        this.bulletTotalTime = 4;
        this.bulletSpeed = 3;
        super.onLoad();
    }
    // update (dt) {}
}
