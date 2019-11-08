import { Dictionary } from "../Utils/Dictionary";
import { Enemy } from "../Enemy/Enemy";
import { constants } from "../constants";
import { AsyncLoadPrefabManager } from "./AsyncLoadPrefabManager";
import { ScoreManager } from "./ScoreManager";

export class EnemyManager {
    private static instance: EnemyManager = null;

    private bornPos: Array<cc.Vec2> = [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)];
    private mapSize: cc.Size = null;
    private offset: number = 15;
    private parent: cc.Node = null;
    private poolDic: Dictionary<cc.NodePool> = new Dictionary<cc.NodePool>();

    private EnemyType = ["HeavyEnemy", "SpeedEnemy", "JumpEnemy"];
    /**
     * static getInstance
     */
    public static getInstance() {
        if (this.instance == null) {
            this.instance = new EnemyManager();
        }
        return this.instance;
    }

    private initBornPos() {
        if (this.mapSize) {
            this.bornPos[0].x = this.offset;
            this.bornPos[0].y = this.mapSize.height - this.offset;
            this.bornPos[1].x = this.mapSize.width / 2;
            this.bornPos[1].y = this.mapSize.height - this.offset;
            this.bornPos[2].x = this.mapSize.width - this.offset;
            this.bornPos[2].y = this.mapSize.height - this.offset;
        }
    }
    private getRandEnemy(): string {
        let index = Math.floor(Math.random() * (this.EnemyType.length) + 1);
        return this.EnemyType[index - 1];
    }
    /**
     * createrEnemy
     */
    public createrEnemy(num: number, parent: cc.Node, mapSize?: cc.Size) {
        if (mapSize) {
            this.mapSize = mapSize;
            this.initBornPos();
        }
        this.parent = parent;
        for (let i = 0; i < num; ++i) {
            this.creater(this.getRandEnemy());
        }
    }

    /**
     * createrEnemyByType
     */
    public createrEnemyByType(type: string, parent: cc.Node, mapSize?: cc.Size) {
        if (mapSize) {
            this.mapSize = mapSize;
            this.initBornPos();
        }
        this.parent = parent;
        this.creater(type.toString());
    }

    private creater(url: string) {
        let enemy: cc.Node = null;
        //得到对应的对象池
        let enemyPool: cc.NodePool = this.poolDic.get(url);
        if (enemyPool == null) {
            // cc.log(url + "is empty");
            enemyPool = new cc.NodePool();
            this.poolDic.add(url, enemyPool);
        }
        if (enemyPool.size() > 0) {
            enemy = enemyPool.get();
            enemy.position = this.getRandPos();
            enemy.parent = this.parent;
            let enemyScript = enemy.getComponent(url) as Enemy;
            enemyScript.tag = url;
            cc.log("create enemy:" + enemyScript.tag);
            //添加记录
            ScoreManager.getInstance().addLiveEnemy(enemyScript.tag);
        } else {
            cc.loader.loadRes(constants.ENEMY_PREFAB + url, cc.Prefab, (err, prefab) => {
                if (!err) {
                    enemy = cc.instantiate(prefab);
                    enemy.position = this.getRandPos();
                    enemy.parent = this.parent;
                    let enemyScript = enemy.getComponent(url) as Enemy;
                    enemyScript.tag = url;
                    cc.log("create enemy:" + enemyScript.tag);
                    //添加记录
                    ScoreManager.getInstance().addLiveEnemy(enemyScript.tag);
                } else {
                    cc.log("load %s is error", url);
                }
            });
        }
    }

    public enemyDestroyCallback(tag: string, node: cc.Node) {
        let pool: cc.NodePool = this.poolDic.get(tag);
        pool.put(node);
        ScoreManager.getInstance().addDeadEnemy(tag);
    }

    private getRandPos(): cc.Vec2 {
        let index = Math.floor(Math.random() * (this.bornPos.length) + 1);
        return this.bornPos[index - 1];
    }

    /**
     * clear
     */
    public clear() {
        for (let pool of this.poolDic.values){
            if (pool != null){
                pool.clear();
            }
        } 
    }
}