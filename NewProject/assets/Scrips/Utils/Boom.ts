
const {ccclass, property} = cc._decorator;

@ccclass
export class Boom extends cc.Component {
    @property(cc.Animation)
    private animation:cc.Animation= null;

    start () {
        
    }
    onLoad(){
        if (this.animation) {
            this.animation.on('finished',this.destroyBoom,this);
            this.animation.play();
        }
    }

    destroyBoom(){
        this.node.destroy();
    }

    onCollisionEnter(other, self) {
        
    }
}
