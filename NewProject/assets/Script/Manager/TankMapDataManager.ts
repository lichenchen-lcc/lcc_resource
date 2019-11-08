import { DataManager } from "./DataManager";

export class TankMapDataManager extends DataManager {
    
    private static _TankMapDataManager:TankMapDataManager = null;
    
    protected keys:string[];

    public static getInstance():TankMapDataManager {
        if (this._TankMapDataManager == null) {
            this._TankMapDataManager = new TankMapDataManager();
        }
        return this._TankMapDataManager;
    }

    constructor(){
        super();
        this.keys = ["id", "ceng", "entId", "num", "entId1", "num1", "name", "boss", "num1", "temp", "num2"];
    }
 
}