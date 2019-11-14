
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {  
        this.value = 1;
        this.material = this.getComponent(cc.Sprite).sharedMaterials[0];
    },

    update (dt) {
        this.value -= 0.2 * dt;
        if (this.value < 0){
            this.value = 0;
        }
        this.material.setProperty('opa',this.value);
    },
});
