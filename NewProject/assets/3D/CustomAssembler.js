const renderEngine = cc.renderer.renderEngine;
const gfx = renderEngine.gfx;

// 引擎定义的顶点数据的 buffer 格式, 参考引擎中的 vertex-format.js
// 传递位置及 UV
let vfmtPosUv = new gfx.VertexFormat([
    { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 }
]);
// 传递位置，UV 及颜色数据
let vfmtPosUvColor = new gfx.VertexFormat([
    { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_UINT8, num: 4, normalize: true },
]);

// 自定义 Assembler
let CustomAssembler = {
    // 创建渲染数据
    createData(comp) {
        let renderData = comp.requestRenderData();
        renderData.dataLength = 4;
        renderData.vertexCount = 4;
        renderData.indiceCount = 6;
        return renderData;
    },
    // 更新渲染数据
    updateRenderData(comp) {
        let renderData = comp._renderData;
        if (renderData) {
            this.updateVerts(comp);
        }
    },
    // 填充数据 buffer
    fillBuffers(comp, renderer) {
        let renderData = comp._renderData;
        let data = renderData._data;
        // 指定 buffer 的数据格式，并获取 buffer
        let buffer = renderer.getBuffer('mesh', vfmtPosUv),
            vertexOffset = buffer.byteOffset >> 2,
            vertexCount = renderData.vertexCount,
            indiceCount = renderData.indiceCount;

        let indiceOffset = buffer.indiceOffset,
            vertexId = buffer.vertexOffset;
        // 通过设定的顶点数量及顶点索引数量获取 buffer 的数据空间
        buffer.request(vertexCount, indiceCount);

        let vbuf = buffer._vData,
            ibuf = buffer._iData;
        // 填充顶点缓冲
        for (let i = 0, l = vertexCount; i < l; i++) {
            let vert = data[i];
            vbuf[vertexOffset++] = vert.x;
            vbuf[vertexOffset++] = vert.y;
            vbuf[vertexOffset++] = vert.u;
            vbuf[vertexOffset++] = vert.v;
        }
        // 填充索引缓冲
        for (let i = 0, l = indiceCount / 6; i < l; i++) {
            ibuf[indiceOffset++] = vertexId;
            ibuf[indiceOffset++] = vertexId + 1;
            ibuf[indiceOffset++] = vertexId + 2;
            ibuf[indiceOffset++] = vertexId + 1;
            ibuf[indiceOffset++] = vertexId + 3;
            ibuf[indiceOffset++] = vertexId + 2;
            vertexId += 4;
        }
    },
    // 准备顶点数据
    updateVerts(comp) {
        let renderData = comp._renderData,
            node = comp.node,
            data = renderData._data,
            cw = node.width, ch = node.height,
            appx = node.anchorX * cw, appy = node.anchorY * ch,
            vl, vb, vr, vt;

        let uv = comp.uv;

        let matrix = node._worldMatrix,
            a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;
        // 依据锚点计算四个顶点的起始值
        vl = -appx;
        vb = -appy;
        vr = cw - appx;
        vt = ch - appy;

        let al = a * vl,
            ar = a * vr,
            bl = b * vl,
            br = b * vr,
            cb = c * vb,
            ct = c * vt,
            db = d * vb,
            dt = d * vt;

        let offset = 0;

        // 左下
        data[offset].x = al + cb + tx;
        data[offset].y = bl + db + ty;
        data[offset].u = uv[0];
        data[offset].v = uv[1];
        offset++;

        // 右下
        data[offset].x = ar + cb + tx;
        data[offset].y = br + db + ty;
        data[offset].u = uv[2];
        data[offset].v = uv[3];
        offset++;

        // 左上
        data[offset].x = al + ct + tx;
        data[offset].y = bl + dt + ty;
        data[offset].u = uv[4];
        data[offset].v = uv[5];
        offset++;

        // 右上
        data[offset].x = ar + ct + tx;
        data[offset].y = br + dt + ty;
        data[offset].u = uv[6];
        data[offset].v = uv[7];
        offset++;
    }
};

module.exports = CustomAssembler;