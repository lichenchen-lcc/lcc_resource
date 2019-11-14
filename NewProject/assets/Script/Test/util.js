
const ShaderMaterial = require("ShaderMaterial");

//工具类
var util = {};
util.useShader = function (sprite, lab) {
    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
        console.warn('Shader not surpport for canvas');
        return;
    }
    if (!sprite || !sprite.spriteFrame || sprite.lab == lab) {
        return;
    }
    if (lab) {
        if (lab.vert == null || lab.frag == null) {
            console.warn('Shader not defined', lab);
            return;
        }
        cc.dynamicAtlasManager.enabled = false;

        let material = new ShaderMaterial();
        let name = lab.name ? lab.name : "None"
        material.callfunc(name, lab.vert, lab.frag, lab.defines || []);

        let texture = sprite.spriteFrame.getTexture();
        material.setTexture(texture);
        material.updateHash();

        sprite._material = material;
        sprite._renderData.material = material;
        sprite.lab = lab;
        return material;
    } else {
        // 这个就是直接变成灰色
        sprite.setState(1);
    }
}

module.exports = util;