import { UIManager } from "./UIManager";
import { TankMapDataManager } from "./TankMapDataManager";
import { ListenerManager } from "./ListenerManager";
import { LoadingUI } from "../UI/LoadingUI";
import { MainUI } from "../UI/MainUI";
import { MapManager } from "./MapManager";
import { ResultUI } from "../UI/ResultUI";

function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
    return class extends constructor{
        property = "new property"
    }
}

function enumerable(value:boolean) {
    return (target:any,propertyKey:string,descriptor:PropertyDescriptor)=> {
        descriptor.enumerable = value;
    };
}

function myLog(target:any) {
    cc.log("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
}

export class GameController {
    private static instance:GameController ;
    /**
     * static getInstance
     */
    public static getInstance() {
        if (this.instance == null){
            this.instance = new GameController();
        }
        return this.instance;
    }
    /**
     * initGame
     */
    public initGame() {
        //注册所有监听
        this.initListener();
        // this.initDataManager();
    }

    /**
     * initListener
     */
    
    public initListener() {
        let listenerManager = ListenerManager.getInstance();

        //注册当前ui监听--用路径  回调只返回类名
        listenerManager.register(MainUI,"UI/MainUI");
        // listenerManager.register(LoadingUI, "UI/LoadingUI");
        // listenerManager.register(ResultUI,"UI/ResultUI");
    }

    /**
     * initDataManager
     */
    public initDataManager() {
        TankMapDataManager.getInstance().load("tankMap");
        MapManager.getInstance().load("map1");
    }

}
