import { Enemy } from "./Enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export class HeavyEnemy extends Enemy {
    //重型坦克
    onLoad(){
        this.speed = 1;
        this.maxBlood = 10;
        this.bulletOffset = 25;
        this.bulletTotalTime = 8;
        this.bulletSpeed = 3;
        super.onLoad();
    }
    
}
