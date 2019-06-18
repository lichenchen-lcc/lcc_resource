import { Enemy } from "./Enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export class HeavyEnemy extends Enemy {
    //重型坦克
    onLoad(){
        this.blood = 10;
        this.bulletOffset = 25;
        this.bulletTotalTime = 2;
        super.onLoad();
    }
    
}
