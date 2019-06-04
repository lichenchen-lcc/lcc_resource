import { BaseUI } from "./BaseUI";
import { LoadingUI } from "./LoadingUI";
import { UIManager } from "../Manager/UIManager";
import { TankMapDataManager } from "../Manager/TankMapDataManager";


const {ccclass, property} = cc._decorator;

@ccclass
export class MainUI extends BaseUI {

    protected className = "MainUI";

    @property(cc.ScrollView)
    private scrollviewMap: cc.ScrollView = null;

    onLoad(){
        //移除LoadingUI
        UIManager.getInstance().closeUI("LoadingUI");
    }

    start () {
        let values = TankMapDataManager.getInstance().values
        for (let value of values){
            cc.log(value.get("name"));
        }
    }

    // update (dt) {}
}
