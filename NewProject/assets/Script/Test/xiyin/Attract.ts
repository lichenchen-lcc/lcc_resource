
const {ccclass, property} = cc._decorator;

@ccclass
export default class Attract extends cc.Component {

    onLoad(){
        let animation = this.getComponent(cc.Animation);
        animation.on('finished', this.onFinished, this);
        animation.play("Attract");

    }
    onEnable(){
    }
    
    onFinished(){
        this.node.destroy();
    }
}
