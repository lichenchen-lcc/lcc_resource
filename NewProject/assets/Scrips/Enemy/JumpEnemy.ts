import { Enemy } from "./Enemy";
import { EnemyManager } from "../Manager/EnemyManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class JumpEnemy extends Enemy {
    @property(cc.Prefab)
    private boomPrefab: cc.Prefab = null;

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
        this.initBoom();
        EnemyManager.getInstance().enemyDestroyCallback(this.tag, this.node);
    }

    initBoom(){
        if(this.boomPrefab){
            let boom = cc.instantiate(this.boomPrefab);
            boom.position = this.node.position;
            boom.parent = this.node.parent;
        }
    }
}
