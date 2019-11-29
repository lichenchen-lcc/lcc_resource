
const {ccclass, property} = cc._decorator;

@ccclass
export class Player extends cc.Component {

    private angle:number = 90;
    private speed:number = 5;
    private _isMove: boolean = false;
    
    onLoad(){
        let parentSize = this.node.parent.getContentSize();
        this.node.position = cc.v2(parentSize.width/2,100);
    }

    start () {
        this.schedule(this.moveSchedule, 0.05);
    }

    moveSchedule(){
        if (this.isMove) {
            //move
            let radian = this.angle * (Math.PI / 180);
            // cc.log(Math.cos(radian) * this.speed + "," + Math.sin(radian) * this.speed);
             this.node.position = cc.v2(Math.cos(radian) * this.speed + this.node.position.x, Math.sin(radian) * this.speed + this.node.position.y);
        }
    }

    public move(angle): void {
        this.angle = angle ;
        this.node.rotation = (-this.angle) +90;
        cc.log("......................angel:" + this.angle);
    }

    update (dt) {
        
    }

    public get isMove(): boolean {
        return this._isMove;
    }
    public set isMove(value: boolean) {
        this._isMove = value;
    }


    onDestroy(){
        this.unschedule(this.moveSchedule);
    }
}
