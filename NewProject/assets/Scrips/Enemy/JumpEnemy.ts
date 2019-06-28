import { Enemy } from "./Enemy";
import { EnemyManager } from "../Manager/EnemyManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class JumpEnemy extends Enemy {
    //重型坦克
    onLoad() {
        this.speed = 3;
        this.maxBlood = 2;
        super.onLoad();
    }

    protected enemySchedule() {
        //移动
        if (this.direction != this.preDirection) {
            this.preDirection = this.direction;
            this.changeAnimation();
        }
        this.move();
    }
    //自爆
    protected detonate(){
        EnemyManager.getInstance().enemyDestroyCallback(this.tag, this.node);
    }
}
