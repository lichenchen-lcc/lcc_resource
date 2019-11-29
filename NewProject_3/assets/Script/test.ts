
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    label: cc.Node = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    a = 0;

    start () {
        this.schedule(this.fff,0.1);
    }


    fff(){
        this.a += 1;
        this.label.position = new cc.Vec2(this.label.position.x + 1,this.label.position.y);
        console.log(this.a);
        
    }
    
    // update (dt) {}
}
