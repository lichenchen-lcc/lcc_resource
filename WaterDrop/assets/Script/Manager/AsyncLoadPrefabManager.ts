export class AsyncLoadPrefabManager {
    private static _AsyncLoadPrefabManager:AsyncLoadPrefabManager = null;
    /**
     * static getInstance
     */
    public static getInstance() :AsyncLoadPrefabManager{
        if (this._AsyncLoadPrefabManager==null){
            this._AsyncLoadPrefabManager = new AsyncLoadPrefabManager();
        }
        return this._AsyncLoadPrefabManager;
    }

    public async loadRes(url:string):Promise<cc.Prefab> {
        let promise = new Promise<cc.Prefab>((resolve,reject)=>{
            cc.loader.loadRes(url,cc.Prefab,(err,prefab)=>{
                if(!err){
                    resolve(prefab);
                }else{
                    reject(null);
                }
            })
        });
        return promise;
    }
}