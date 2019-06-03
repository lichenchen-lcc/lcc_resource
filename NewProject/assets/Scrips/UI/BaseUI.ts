import { constants } from "../constants";
import { ListenerManager  } from "../Manager/ListenerManager";
import { UIManager } from "../Manager/UIManager";

export interface UIClass<T extends BaseUI> {
    //这是一个泛型接口，里边的是必须可以用类名直接访问的static类型
    new(): T;
    // getUrl(): string;
}

const { ccclass, property } = cc._decorator;
@ccclass
export abstract class BaseUI extends cc.Component {
    protected className = "BaseUI";

    protected mTag: string;

    public test:string="fffff";
    public get tag(): string {
        return this.mTag;
    }
    public set tag(value: string) {
        this.mTag = value;
    }

    public getUrl(): string {
        cc.log(this.className);
        return constants.PREFAB_UI_DIR + this.className;
    }

    onDestroy(): void {
        ListenerManager.getInstance().removeAll();
    }

    onShow() {
        cc.log("BaseUI onShow");
    }

    public load(listener: Function, callerName: string, caller: any) {
        cc.log("[BaseUI]call back:" + callerName);
        UIManager.getInstance().openUI(callerName,1);
    }
}
