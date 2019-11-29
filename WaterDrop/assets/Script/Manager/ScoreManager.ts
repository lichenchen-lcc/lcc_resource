import { Dictionary } from "../Utils/Dictionary";
import { ListenerManager } from "./ListenerManager";

export class ScoreManager {
    private static instance:ScoreManager = null;
    /**
     * static getInstance
     */
    public static getInstance() {
        if(this.instance == null){
            this.instance = new ScoreManager();
        }
        return this.instance;
    }

    private liveEnemyDic:Dictionary<number> = new Dictionary<number>();
    private deadEnemyDic: Dictionary<number> = new Dictionary<number>();
    private _playerBlood: number = null;

    public addLiveEnemy(enemyName:string){
        let num = this.liveEnemyDic.get(enemyName); 
        if (num){
            this.liveEnemyDic.add(enemyName, num + 1);
        }{
            this.liveEnemyDic.add(enemyName,1);
        }    
    }
    public addDeadEnemy(enemyName: string) {
        let num = this.deadEnemyDic.get(enemyName);
        if (num) {
            this.deadEnemyDic.add(enemyName, num + 1);
        } {
            this.deadEnemyDic.add(enemyName, 1);
        }
        this.checkResult();
    }

    /**
     * name
     */
    public checkResult() {
        if (this.deadEnemyDic.length >= this.liveEnemyDic.length && this.playerBlood != null && this.playerBlood > 0){
            ListenerManager.getInstance().dispatch("UI/ResultUI");
        }
    }
    /**
     * clear
     */
    public clear() {
        this.liveEnemyDic.clear();
        this.deadEnemyDic.clear();
        this.playerBlood = null;
    }

    public get playerBlood(): number {
        return this._playerBlood;
    }
    public set playerBlood(value: number) {
        this._playerBlood = value;
    }
}