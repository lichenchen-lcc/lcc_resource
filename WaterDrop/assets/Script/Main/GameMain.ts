import { UIManager } from "../Manager/UIManager";
import { LoadingUI } from "../UI/LoadingUI";
import { GameController } from "../Manager/GameController";
import { ListenerManager } from "../Manager/ListenerManager";

const {ccclass, property} = cc._decorator;

@ccclass
export class GameMain extends cc.Component {

    @property(cc.Node)
    private preLoadPrefab: cc.Node = null; 
    
    onLoad(){
        let frameSize = cc.view.getFrameSize();
        let bFitHeight = (frameSize.width / frameSize.height) >= 640/960;
        cc.Canvas.instance.fitHeight = bFitHeight;
        cc.Canvas.instance.fitWidth = !bFitHeight;

        GameController.getInstance().initGame();
    }
    

    start () {
        if (this.preLoadPrefab != null){
            this.preLoadPrefab.destroy();
        }
        ListenerManager.getInstance().dispatch("UI/MainUI");
        // UIManager.getInstance().openUI(LoadingUI,1,() =>{
        //     cc.log("loadingui is successful")
        //     GameController.getInstance().initGame();
        // });
    }

    // update (dt) {}
}
