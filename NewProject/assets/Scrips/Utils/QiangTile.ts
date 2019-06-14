import { Tile } from "./Tile";

const { ccclass, property } = cc._decorator;
@ccclass
export class QiangTile extends Tile {
    private blood:number = 2;

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact, selfCollider, otherCollider:cc.PhysicsCollider) {
        if (otherCollider.node.name == "bullet_prefab"){
            this.blood -= 1;
            if (this.blood == 1){
                this.node.color = cc.Color.RED;
            }else if(this.blood == 0){
                this.node.destroy();
            }
        }
    }
}
