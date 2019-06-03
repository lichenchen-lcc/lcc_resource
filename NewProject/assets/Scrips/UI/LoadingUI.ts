import { BaseUI } from "./BaseUI";
import { constants } from "../constants";

const {ccclass, property} = cc._decorator;

@ccclass
export class LoadingUI extends BaseUI {

    protected className = "LoadingUI";

    @property(cc.ProgressBar)
    private progressBar: cc.ProgressBar = null;
    @property(cc.Label)
    private progressLabel: cc.Label = null;

    onLoad() {
        
    }

}
