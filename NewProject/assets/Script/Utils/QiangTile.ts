import { Tile } from "./Tile";

const { ccclass, property } = cc._decorator;
@ccclass
export class QiangTile extends Tile {
    private blood:number = 2;

    private tilePool = new cc.NodePool();
    // 只在两个碰撞体开始接触时被调用一次
    onCollisionEnter(other, self) {
        if (other.node.name == "Bullet"){
            this.blood -= 1;
            if (this.blood == 1){
                this.node.color = cc.Color.RED;
            }else if(this.blood == 0){
                this.node.position = cc.v2(this.node.position.x + 1000, this.node.position.y + 1000);
                // this.tilePool.put(this.node);
                //延后消失，眼睛看不出来，因为里可以消失会让子弹卡顿一下
                
                // this.scheduleOnce(()=>{
                //     this.node.destroy();
                // },0.1);
            }
        }
    }
}
