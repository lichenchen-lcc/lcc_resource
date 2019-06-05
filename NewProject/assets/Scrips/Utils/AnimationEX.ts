const {ccclass, property} = cc._decorator;

@ccclass
export default class AnimationEX extends cc.Component {

    @property(cc.SpriteFrame)
    private spriteFrames: cc.SpriteFrame;
    @property
    private frameTime: number;
    @property
    private loop :boolean;
    @property
    private playLoad:boolean;

    private isPlaying:boolean;
    private time:number;
    private sprite:cc.Sprite;
    onLoad(){
        
    }

    start () {

    }

    // update (dt) {}
}
