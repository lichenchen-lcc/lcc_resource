cc.Class({
    extends: cc.Component,

    properties: {
        nnn: {
            default: null,
            type: cc.Node
        },
        
    },

    // use this for initialization
    onLoad: function () {
        // this.label.string = this.text;
    },

    // called every frame
    update: function (dt) {
        this.nnn.position.x += 10;
    },
});
