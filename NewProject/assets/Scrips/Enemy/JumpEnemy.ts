import { Enemy } from "./Enemy";

const { ccclass, property } = cc._decorator;

@ccclass
export class JumpEnemy extends Enemy {
    private mapSize: cc.Size = null;
    private jumpIntervalMax = 2;
    private jumpInterval = 2;
    private jumpTime = 1.5;

    private jumpDistance = 100;
    private isTurn = false;

    private isJumping = false;
    private canCheckCollision = false;
    //重型坦克
    onLoad() {
        this.blood = 2;
        this.direction = 2;
        this.mapSize = this.node.parent.getContentSize();
        super.onLoad();
    }

    protected enemySchedule() {
        if (this.isJumping) {
            return;
        }
        if (this.jumpInterval >= this.jumpIntervalMax) {
            this.jumpInterval = 0;
            if (this.isTurn) {
                this.turnd();
                this.isTurn = false;
            }
            let pos = this.node.position;
            let curDistance: number = 0;
            let destination: cc.Vec2 = cc.v2(0, 0);
            if (this.direction == 1) {
                if ((pos.y + this.jumpDistance) >= (this.mapSize.height - this.node.getContentSize().height / 2)) {
                    this.isTurn = true;
                    curDistance = this.mapSize.height - this.node.getContentSize().height / 2 - pos.y;
                } else {
                    curDistance = this.jumpDistance;
                }
                destination = cc.v2(pos.x, pos.y + curDistance);
            } else if (this.direction == 2) {
                if ((pos.y - this.jumpDistance) <= (this.node.getContentSize().height / 2)) {
                    this.isTurn = true;
                    curDistance = pos.y - this.node.getContentSize().height / 2;
                } else {
                    curDistance = this.jumpDistance;
                }
                destination = cc.v2(pos.x, pos.y - curDistance);
            } else if (this.direction == 3) {
                if ((pos.x - this.jumpDistance) <= (this.node.getContentSize().width / 2)) {
                    this.isTurn = true;
                    curDistance = pos.x - this.node.getContentSize().width / 2;
                } else {
                    curDistance = this.jumpDistance;
                }
                destination = cc.v2(pos.x - curDistance, pos.y);
            } else if (this.direction == 4) {
                if ((pos.x + this.jumpDistance) >= (this.mapSize.width - this.node.getContentSize().width / 2)) {
                    this.isTurn = true;
                    curDistance = this.mapSize.width - this.node.getContentSize().width / 2 - pos.x;
                } else {
                    curDistance = this.jumpDistance;
                }
                destination = cc.v2(pos.x + curDistance, pos.y);
            }
            let jumpTo = cc.jumpTo(this.jumpTime, destination, 50, 1);

            this.isJumping = true;
            this.changeAnimation();
            this.node.runAction(cc.sequence(jumpTo, cc.callFunc(() => { 
                this.canCheckCollision = true;
                this.isJumping = false;
                this.stopAnimation();
                })));
        } else {
            this.jumpInterval += this.scheduleInterval;
        }
    }

    // 只在两个碰撞体开始接触时被调用一次
    protected onCollisionEnter(other, self) {
        //只要不是子弹就掉头if () {
        let otherName = other.node.name;
        if (otherName == "Bullet") {
            //是否是玩家坦克子弹
            let bulletScript = other.getComponent("Bullet") as Bullet;
            if (bulletScript.tag.split("_")[0] == "tank") {
                this.injured();
            }
        } else if (otherName == "haiyang" || otherName == "qiang" || otherName == "shitou") {
            // cc.log("ffffffffffffffffffffffffffffffffff");
            if (this.canCheckCollision) {
                cc.log("ddddddddddddddddddddddd");
                this.elasticF(other);
                this.turnd();
                this.canCheckCollision = false;
            }
        } else if (otherName == "Tank") {
            //碰撞了玩家坦克后开始爆炸

        }
    }
}
