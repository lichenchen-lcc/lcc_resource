
const util = require("util");


cc.Class({
    extends: cc.Component,

    properties: {

    },
    start() {
        this.node.script = this;

        let mVert = `
uniform mat4 viewProj;
attribute vec3 a_position;
attribute vec2 a_uv0;
varying vec2 uv0;
void main () {
    vec4 pos = viewProj * vec4(a_position, 1);
    gl_Position = pos;
    uv0 = a_uv0;
}`;
        let mFrag = `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    float clrbright = (c.r + c.g + c.b) * (1. / 3.);
    float gray = (0.6) * clrbright;
    gl_FragColor = vec4(gray, gray, gray, c.a);
}
`
        var lab = {
            vert: mVert,
            frag: mFrag,
            name: "stone"
        }
        let sprite = this.getComponent(cc.Sprite);
        let material = util.useShader(sprite, lab);
    },
});