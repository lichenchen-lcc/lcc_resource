import { constants } from "../constants";

export class Tile {
    private parent: cc.Node;
    private atlas: cc.SpriteAtlas;
    private callback: Function;
    private tile: cc.Node;
    private tileType: number;
    private tilePos: cc.Vec2;
    private constract = { 573: "qiang", 339: "caodi", 548:"shitou"};

    constructor(caller: any, callback: Function, parent: cc.Node, pos: cc.Vec2, type: number) {
        this.callback = callback;
        this.parent = parent;
        this.tilePos = pos;
        this.tileType = type;
        //加载当前地块用的图片
        cc.loader.loadRes(constants.IMG_PATH + "tanks", cc.SpriteAtlas, (err, atlas) => {
            if (!err) {
                this.atlasCallback(atlas);
            }
        });
    }
    atlasCallback(atlas: cc.SpriteAtlas) {
        this.atlas = atlas;
        //加载tile预制体
        cc.loader.loadRes(constants.PREFAB_UI_DIR + "tile_prefab", cc.Prefab, (err, prefab) => {
            if (!err) {
                this.tile = cc.instantiate(prefab);
                this.tile.parent = this.parent;
                this.tile.position = this.tilePos;
                this.tile.setAnchorPoint(0.5,0.5);
                this.tile.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(this.constract[this.tileType]);
                //cc.log("fffffasdljflasjfl;jsdf;");
                if (this.callback){
                    this.callback.call(this.callback);
                }
            }else{
                
            }
        });
    }

    /**
     * destroy
     */
    public destroy() {
        //释放加载图集
        cc.loader.release(this.atlas);
    }
}
