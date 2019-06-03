import { UIManager } from "../Manager/UIManager";
import { GameController } from "../Manager/GameController";
import { ListenerManager } from "../Manager/ListenerManager";
import { ListenerType } from "../Data/ListenerType";
import { LoadingUI } from "../UI/LoadingUI";
import { LogWrap } from "../Utils/LogWrap";

const {ccclass, property} = cc._decorator;

@ccclass
export class GameMain extends cc.Component 
{
    @property(cc.Node)
    private preLoadPrefabList: cc.Node = null;

    onLoad()
    {
        // cc.log.call(this, cc.js.formatStr.apply(cc, "arguments"), "b", "c", "d", "e");
        LogWrap.log("test log");
        LogWrap.info("test info");
        LogWrap.warn("test warn");
        LogWrap.err("test err");

        let frameSize = cc.view.getFrameSize();
        let bFitWidth = (frameSize.width / frameSize.height) < (750 / 1334)
        cc.Canvas.instance.fitWidth = bFitWidth;
        cc.Canvas.instance.fitHeight = !bFitWidth;
    }

    start()
    {
        if (this.preLoadPrefabList != null){
            this.preLoadPrefabList.destroy();
            cc.log("destroy this.preLoadPrefabList name = %s", this.preLoadPrefabList.name);
        }
        
        UIManager.getInstance().openUI(LoadingUI, 10, ()=>{
            GameController.getInstance().initGame();
        });
    }

    update(dt)
    {
        ListenerManager.getInstance().trigger(ListenerType.LoopUpdate, dt);
    }
}