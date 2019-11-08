import { BaseUI } from "./BaseUI";
import { ScoreManager } from "../Manager/ScoreManager";

const {ccclass, property} = cc._decorator;

@ccclass
export class ResultUI extends BaseUI {
    protected className = "ResultUI";

    @property(cc.Sprite)
    private title_img: cc.Sprite = null;
    @property(cc.Button)
    private next_btn:cc.Button = null;
    @property(cc.Button)
    private again_btn:cc.Button = null;
    @property(cc.ScrollView)
    private score_panel:cc.ScrollView = null;
    @property({
        type:[cc.SpriteFrame],
        displayName:"titleFrame"
    })
    private titleSpriteFrame:Array<cc.SpriteFrame> = [];

    onload(){
        
    }

    mylog(){
        cc.log.apply(this,arguments)
        cc.log(arguments)
    }

    onDestroy(){
        ScoreManager.getInstance().clear();
    }
}
