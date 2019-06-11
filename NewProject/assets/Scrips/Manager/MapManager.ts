import { DataManager } from "./DataManager";

export class MapManager extends DataManager {

    private static _MapManager: MapManager = null;

    protected keys: string[];

    public static getInstance(): MapManager {
        if (this._MapManager == null) {
            this._MapManager = new MapManager();
        }
        return this._MapManager;
    }

    constructor() {
        super();
        this.keys = [];
    }

}