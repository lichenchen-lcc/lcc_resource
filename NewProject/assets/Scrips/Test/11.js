cc.PhysicsManager.prototype.start = function () {
    if (CC_EDITOR) return;
    if (!this._world) {
        var world = new b2.World(new b2.Vec2(0, -10));
        world.SetAllowSleeping(true);
        this._world = world;

        //liquid ����
        var psd = new b2.ParticleSystemDef();
        psd.radius = 0.035;
        this._particle = world.CreateParticleSystem(psd);

        this._initCallback();
    }
    this._enabled = true;
}

b2.Draw.prototype.DrawParticles = function (positionBuffer, radius, colorBuffer, particleCount) {
    console.log("1111111111111b2.Draw.prototype.DrawParticles");
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

// b2.Draw.prototype.DrawParticles = function (positionBuffer, radius, colorBuffer, particleCount) {
//     //console.log('DrawParticles start');
//     let particle_size_multiplier = 8; // no falloff
//     let global_alpha = 0.35; // instead of texture
//     g_material.setU_pointSize(radius * PTM_RATIO * particle_size_multiplier);
//     let centers = new Array();
//     for (var i = 0; i < particleCount; i++) {
//         let vec2 = b2.Vec2(positionBuffer[i].x * PTM_RATIO, positionBuffer[i].y * PTM_RATIO);
//         centers[i] = vec2;
//         g_material.setA_position(centers[i]);
//     }
//     //g_material.setA_texCoord();
//     let temp_vec2 = cc.v2(0, 0)
//     let drawer = this._drawer;
//     //g_material.setU_color(0, 0, 0, global_alpha);

//     if (colorBuffer != null) {
//         g_material.setU_color(colorBuffer[0].r, colorBuffer[0].g, colorBuffer[0].b, global_alpha);
//     } else {
//         g_material.setU_color(0.1, 0.2, 0.3, global_alpha);
//     }
// };