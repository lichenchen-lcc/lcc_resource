import { UIManager } from "./UIManager";
import { TankMapDataManager } from "./TankMapDataManager";
import { ListenerManager } from "./ListenerManager";
import { LoadingUI } from "../UI/LoadingUI";
import { MainUI } from "../UI/MainUI";
import { MapManager } from "./MapManager";

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
        this.initDataManager();
    }

    /**
     * initListener
     */
    public initListener() {
        let listenerManager = ListenerManager.getInstance();

        //注册当前ui监听--用路径  回调只返回类名
        listenerManager.register(LoadingUI, "UI/LoadingUI");
        listenerManager.register(MainUI,"UI/MainUI");
    }

    /**
     * initDataManager
     */
    public initDataManager() {
        TankMapDataManager.getInstance().load("tankMap");
        MapManager.getInstance().load("map1");
    }
}
