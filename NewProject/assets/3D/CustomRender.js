const renderEngine = cc.renderer.renderEngine;
const SpriteMaterial = renderEngine.SpriteMaterial;
const CustomAssembler = require('./CustomAssembler');
// 自定义渲染组件
let CustomRender = cc.Class({
    // 所有渲染组件需要继承自 cc.RenderComponent
    extends: cc.RenderComponent,

    ctor() {
        // 顶点数据装配器
        this._assembler = null;
        // 材质
        this._spriteMaterial = null;
        // 纹理 UV
        this.uv = [];
    },

    properties: {
        // 渲染组件使用的 Texture
        _texture: {
            default: null,
            type: cc.Texture2D
        },

        texture: {
            get: function () {
                return this._texture;
            },
            set: function (value) {
                this._texture = value;
                this._activateMaterial();
            },
            type: cc.Texture2D,
        },
    },
    // 组件激活时链接组件的 Assembler，处理UV数据及事件监听。
    onEnable() {
        this._super();
        this._updateAssembler();
        this._activateMaterial();
        this._calculateUV();

        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onNodeSizeDirty, this);
        this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this._onNodeSizeDirty, this);
    },
    // 组件禁用时，取消事件监听
    onDisable() {
        this._super();

        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onNodeSizeDirty, this);
        this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this._onNodeSizeDirty, this);
    },
    // 节点数据变化时需要标记更新组件的渲染状态
    _onNodeSizeDirty() {
        if (!this._renderData) return;
        this.markForUpdateRenderData(true);
    },
    // 设置组件的 Assembler
    _updateAssembler() {
        let assembler = CustomAssembler;

        if (this._assembler !== assembler) {
            this._assembler = assembler;
            this._renderData = null;
        }

        if (!this._renderData) {
            this._renderData = this._assembler.createData(this);
            this._renderData.material = this._material;
            this.markForUpdateRenderData(true);
        }
    },
    // 创建用于渲染图片的材质
    _activateMaterial() {
        let material = this._material;
        if (!material) {
            material = this._material = new SpriteMaterial();
        }
        // 是否使用 Uniform 变量传递节点颜色
        material.useColor = true;
        if (this._texture) {
            material.texture = this._texture;
            // 标记渲染组件的渲染状态
            this.markForUpdateRenderData(true);
            this.markForRender(true);
        } else {
            this.disableRender();
        }

        this._updateMaterial(material);
    },
    // 设置纹理的 UV 数据
    _calculateUV() {
        let uv = this.uv;
        // 设置纹理 UV 起始值
        let l = 0, r = 1, b = 1, t = 0;

        uv[0] = l;
        uv[1] = b;
        uv[2] = r;
        uv[3] = b;
        uv[4] = l;
        uv[5] = t;
        uv[6] = r;
        uv[7] = t;
    }
});