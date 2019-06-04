import { BaseUI } from "./BaseUI";
import { constants } from "../constants";
import { ListenerManager } from "../Manager/ListenerManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class LoadingUI extends BaseUI {

    protected className = "LoadingUI";

    @property(cc.ProgressBar)
    private progressBar: cc.ProgressBar = null;
    @property(cc.Label)
    private progressLabel: cc.Label = null;

    private curProgress: number = 0;
    
    onLoad() {
        this.curProgress = 0;
        this.progressBar.progress = 0;
        this.progressLabel.string = "0%"
    }

    start(){
        let mySchedule = () => {
            this.curProgress += 20;
            this.progressBar.progress = Math.min(this.curProgress / this.progressBar.totalLength, 1);
            this.progressLabel.string = (this.progressBar.progress * 100).toFixed(0) + "%";
            if (this.curProgress >= this.progressBar.totalLength){
                this.unschedule(mySchedule);
                ListenerManager.getInstance().dispatch("UI/MainUI");
            }
        }
        this.schedule(mySchedule, 0.1);
    }

    update(dt) {
        
    }

}
