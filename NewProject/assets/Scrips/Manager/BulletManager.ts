import { constants } from "../constants";
import { AsyncLoadPrefabManager } from "./AsyncLoadPrefabManager";

export class BulletManager {
    private bulletPrefab:cc.Prefab = null;
    private bulletPool: cc.NodePool = null;

    private static instance: BulletManager = null;
    public static getInstance() :BulletManager{
        if(this.instance == null){
            this.instance = new BulletManager();
            this.instance.initBulletPrefab();
        }
        return this.instance;
    }

    private async initBulletPrefab(){
        this.bulletPrefab = await AsyncLoadPrefabManager.getInstance().loadRes(constants.PREFAB_UI_DIR + "Bullet");
    }

    //对所有敌人的子弹进行统一管理
    /**
     *  createBullet
     */
    public createBullet(): cc.Node {
        if (this.bulletPool == null) {
            this.bulletPool = new cc.NodePool();
        }
        let bullet: cc.Node = null;
        if (this.bulletPool.size() > 0) {
            bullet = this.bulletPool.get();
        } else {
            bullet = cc.instantiate(this.bulletPrefab);
        }
        return bullet;
    }

    /**
     * destroyBullet
     */
    public destroyBullet(bullet:cc.Node) {
        this.bulletPool.put(bullet);
    }

    /**
     * clear
     */
    public clear() {
        this.bulletPool.clear();
    }
}
