import { constants } from "../constants";
import { Dictionary } from "./Dictionary";

const { ccclass, property } = cc._decorator;
@ccclass
export class Tile extends cc.Component{
    private parent: cc.Node;
    private callback: Function;
    private tile: cc.Node;
    private tileType: number;
    private tilePos: cc.Vec2;
    public static constract = { 573: "qiang", 339: "caodi", 548: "shitou" };
    public static prefabs: Dictionary<cc.Prefab> = new Dictionary<cc.Prefab>();

    public static init(caller: any, callback: Function) {
        //加载tile预制体
        cc.loader.loadResDir(constants.PREFAB_UI_DIR + "tile_prefabs", cc.Prefab, (err, prefabs, urls) => {
            if (!err) {
                for (let i = 0; i < urls.length; ++i) {
                    let urlArr = urls[i].split("/");
                    let name = urlArr[urlArr.length - 1];
                    // cc.log(name);
                    // cc.log(typeof (prefabs[i]));
                    this.prefabs.add(name, prefabs[i]);
                }
                if(callback){
                    callback.call(caller,callback);
                }
            }
        });
    }
}