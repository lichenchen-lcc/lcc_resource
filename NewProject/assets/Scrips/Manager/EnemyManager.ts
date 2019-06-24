import { Dictionary } from "../Utils/Dictionary";
import { Enemy } from "../Enemy/Enemy";
import { constants } from "../constants";

enum EnemyType { "HeavyEnemy", "SpeedEnemy","count" = 2 };

export class EnemyManager {
    private static instance: EnemyManager = null;
    private enemys: Array<Enemy> = new Array<Enemy>();
    private enemyIndex: number = 0;

    private bornPos: Array<cc.Vec2> = [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)];
    private mapSize: cc.Size = null;
    private offset: number = 15;
    private parent: cc.Node = null;
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
        let index = Math.floor(Math.random() * (EnemyType.count) + 1);
        return EnemyType[index - 1];
    }
    /**
     * createrEnemy
     */
    public createrEnemy(num: number, parent: cc.Node ,mapSize?: cc.Size) {
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
    public createrEnemyByType(type: EnemyType, parent: cc.Node, mapSize?: cc.Size) {
        if (mapSize) {
            this.mapSize = mapSize;
            this.initBornPos();
        }
        this.parent = parent;
        this.creater(type.toString());
    }

    private creater(url: string) {
        cc.loader.loadRes(constants.ENEMY_PREFAB + url, cc.Prefab, (err, prefab) => {
            if (!err) {
                let enemy: cc.Node = cc.instantiate(prefab);
                enemy.position = this.getRandPos();
                enemy.parent = this.parent;
                let enemyScript = enemy.getComponent(url) as Enemy;
                this.enemys.push(enemyScript);
                enemyScript.initDestroyCallback(this, this.enemyDestroyCallback);
                enemyScript.tag = url + this.enemyIndex;
                cc.log("create enemy:" + enemyScript.tag);
            } else {
                cc.log("load %s is error", url);
            }
        });
    }

    private enemyDestroyCallback(callback: Function, tag: string) {
        for (let i = 0; i <= this.enemys.length; ++i) {
            if (this.enemys[i].tag == tag) {
                cc.log("delete enemy:" + tag);
                this.enemys[i].destroy();
                this.enemys.splice(i, 1);
            }
        }
    }

    private getRandPos(): cc.Vec2 {
        let index = Math.floor(Math.random() * (this.bornPos.length) + 1);
        return this.bornPos[index - 1];
    }
}