import { Enemy } from "./Enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export class HeavyEnemy extends Enemy {
    //重型坦克
    onLoad(){
        this.speed = 1;
        this.blood = 10;
        this.bulletOffset = 25;
        this.bulletTotalTime = 8;
        this.elastic = 4;
        this.bulletSpeed = 3;
        super.onLoad();
    }
    
}
