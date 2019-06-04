import { LoadingUI } from "./UI/LoadingUI";
import { GameController } from "./Manager/GameController";
import { ListenerManager } from "./Manager/ListenerManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FirstCanvas extends cc.Component {
    onLoad(){
        GameController.getInstance().initGame();
    }
    
    async start() {   
        ListenerManager.getInstance().dispatch("LoadingUI");

        var item = await this.loadPrefab("prefabs/item_prefab");
        // cc.log("ff" + item.name);

        var content: cc.Node = cc.find("first_canvas/scrollview/view/content");
        for (var i = 1; i <= 10; i++) {
            var widget: cc.Node = cc.instantiate(item);
            var myLable: cc.Label = widget.getChildByName("title").getComponent(cc.Label);
            myLable.string = i + "";
            widget.name = i + '';
            // var myLable:cc.Label = widget.getChildByName("title").getComponent(cc.Label);
            // if (myLable == null){
            //     cc.log("myLable is null");
            // }
            // myLable.string = i + "";
            //--button
            var buy_btn: cc.Button = widget.getChildByName("buy_btn").getComponent(cc.Button);
            buy_btn.node.on(cc.Node.EventType.TOUCH_END, this.onBuyClick).bind(this);
            content.addChild(widget);
        }  
        // content.setContentSize(cc.size(content.getContentSize().width,2000));
        // this.mycanvas = cc.find("first_canvas");
    }
    onBuyClick(event, customEventData?:any) {
        // var button:cc.Button = event.target;
        var button:cc.Button = event.target.getComponent(cc.Button);
        cc.log(button.name);
        var parent = event.target.parent;
        cc.log(parent.name);
    }

    public async loadPrefab(url): Promise<cc.Prefab> {
        var promise = new Promise<cc.Prefab>((resolve, reject) => {
            cc.log("1");
            cc.loader.loadRes(url, cc.Prefab, (err, prefab) => {
                if (!err) {
                    cc.log("2");
                    resolve(prefab);
                } else {
                    cc.log("3");
                    reject(null);
                }
            });
        });
        cc.log("4");
        return promise;
    }

    // async loadPrefab() {
    //     cc.loader.loadRes("Prefabs/item_prefab", cc.Prefab, function (err, prefab) {
    //         if (!err) {
    //             cc.log("---------------------not error");
    //             return prefab;
    //         } else {
    //             cc.log("---------------------error");
    //             return null;
    //         }
    //     });
    // }

    addTouchEventListener(){

    }
    update (dt) {}
}

