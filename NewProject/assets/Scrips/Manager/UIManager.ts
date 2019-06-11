import { ListenerManager, Delegate } from "../Manager/ListenerManager";
import { BaseUI, UIClass } from "../UI/BaseUI";
import { constants } from "../constants";
import { Dictionary } from "../Utils/Dictionary";

import { LoadingUI } from "../UI/LoadingUI";
import { MainUI } from "../UI/MainUI";

export class UIManager {
    private static instance: UIManager = null;
    private uiRoot: cc.Node = null;
    private mUIList: Dictionary<BaseUI> = new Dictionary<BaseUI>();
    /**
     * static getInstance
     */
    public static getInstance(): UIManager {
        if (this.instance == null) {
            this.instance = new UIManager
        }
        return this.instance;
    }

    constructor() {
        //cc.find是获取当前场景的根节点
        this.uiRoot = cc.find("Canvas");
    }

    public openUI(className:string,zOrder?:number,callback?:Function,onProgress?:Function,...args:any[]){
        if (this.getUI(className)){
            return;
        }
        let url: string = constants.PREFAB_UI_DIR + className;
        cc.loader.loadRes(url,(completedCount:number,totalCount:number,item:any)=>{
            if (onProgress){
                onProgress(completedCount,totalCount,item);
            }
        },(error,prefab)=>{
            if (error){
                cc.log("[UIManager] openUI :%s is error", className);
                return;
            }
            let uiNode:cc.Node = cc.instantiate(prefab);
            uiNode.parent = this.uiRoot;
            if (zOrder){
                uiNode.zIndex = zOrder;
            }
            let uiScript = uiNode.getComponent(className) as BaseUI;
            if (uiScript == null){
                cc.log("[UIManager]  :%s script component is miss！！", url);
                return;
            }
            uiScript.tag = className;
            this.mUIList.add(className, uiScript);
            if (callback){
                callback(args);
            }
        });
    }
    public getUI(className: string): BaseUI {
        return this.mUIList.get(className)
        // for (let i = 0; i < this.mUIList.length; ++i) {
        //     if (this.mUIList[i].tag === className) {
        //         return this.mUIList[i];
        //     }
        // }
        // return null;
    }

    public closeUI(className:string) {
        let uiScript = this.mUIList.get(className);
        if (uiScript){
            uiScript.node.destroy();
            this.mUIList.remove(className);
        }
    }
}