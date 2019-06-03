import { UIManager } from "./UIManager";

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
        UIManager.getInstance().registerAllListener();
    }
}
