import { Tile } from "./Tile";

const { ccclass, property } = cc._decorator;
@ccclass
export class QiangTile extends Tile {
    private blood:number = 2;

    // 只在两个碰撞体开始接触时被调用一次
    onCollisionEnter(other, self) {
        if (other.node.name == "Bullet"){
            this.blood -= 1;
            if (this.blood == 1){
                this.node.color = cc.Color.RED;
            }else if(this.blood == 0){
                //延后消失，眼睛看不出来，因为里可以消失会让子弹卡顿一下
                this.scheduleOnce(()=>{
                    this.node.destroy();
                },0.1);
            }
        }
    }
}
