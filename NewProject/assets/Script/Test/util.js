b2.Draw.prototype.DrawParticles = function (positionBuffer, radius, colorBuffer, particleCount) {
    // console.log("----------b2.Draw.prototype.DrawParticles");

    let temp_vec2 = cc.v2(0, 0)
    let PTM_RATIO = 32;
    let drawer = this._drawer;
    for (let i = 0; i < particleCount; i += 3) {

        b2.Transform.MulXV(this._xf, positionBuffer[i], temp_vec2);
        let x = temp_vec2.x * PTM_RATIO;
        let y = temp_vec2.y * PTM_RATIO;

        drawer.circle(x, y, 2);
    }
}

//node解构
function DrawNode(x, y, index, angle) {
    this.x = x;
    this.y = y;
    this.index = index;
    this.angle = angle;
}
function Contact(collider, normal) {
    this.collider = collider;
    this.normal = normal; 
    this.reference = 0;
    this.key = collider.node.name;
}

var RenderType = cc.Enum({
    // OUTERRING:0,
    EACHPARTICLE:1,
});

module.exports.DrawNode = DrawNode;
module.exports.Contact = Contact;
module.exports.RenderType = RenderType;