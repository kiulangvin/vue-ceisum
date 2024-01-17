import * as Cesium from 'cesium'
import { coordTransform } from './utils'
class CesiumMeasure {
  constructor(opts) {
    this.viewer = opts.viewer
    this._drawLayer = new Cesium.CustomDataSource('measureLayer')
    this.viewer && this.viewer.dataSources.add(this._drawLayer)
  }
  // 空间长度测量
  measureLength(opts) {
    let positions = []
    let lineEntity = new Cesium.Entity()
    let line = null
    let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)

    handler.setInputAction((e) => {
      let cartesian = coordTransform.pxToCartesian3(e.position, this.viewer)
      if (cartesian && cartesian.x) {
        if (positions.length == 0) {
          positions.push(cartesian.clone())
        }
        // 添加量测信息点
        _addInfoPoint(cartesian)
        positions.push(cartesian)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    handler.setInputAction((e) => {
      let cartesian = coordTransform.pxToCartesian3(e.endPosition, this.viewer)
      if (positions.length >= 2) {
        if (cartesian && cartesian.x) {
          positions.pop()
          positions.push(cartesian)
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    handler.setInputAction((e) => {
      handler.destroy()
      handler = null

      let cartesian = coordTransform.pxToCartesian3(e.position, this.viewer)
      _addInfoPoint(cartesian)

      if (opts.callback && typeof opts.callback === 'function') {
        opts.callback(positions, line)
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    lineEntity.polyline = {
      width: opts.width || 5,
      material: opts.material || Cesium.Color.BLUE.withAlpha(0.8),
      clampToGround: opts.clampToGround || false
    }
    lineEntity.polyline.positions = new Cesium.CallbackProperty(function () {
      return positions
    }, false)
    line = this._drawLayer.entities.add(lineEntity)
    //添加坐标点
    let _this = this
    function _addInfoPoint(position) {
      let _labelEntity = new Cesium.Entity()
      _labelEntity.position = position
      _labelEntity.point = {
        pixelSize: 10,
        outlineColor: Cesium.Color.BLUE,
        outlineWidth: 5
      }
      _labelEntity.label = {
        text: (1000).toFixed(4) + '公里',
        show: true,
        showBackground: true,
        font: '14px monospace',
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(-20, -80) //left top
      }
      _this._drawLayer.entities.add(_labelEntity)
    }
  }
  // 空间面积测量
  measureArea(opts) {
    if (opts.callback) opts.callback()
  }
  // 三角测量
  measureTriangle(opts) {
    if (opts.callback) opts.callback()
  }
  // 清除测量结果
  clearMeasureResult(opts) {
    if (opts.callback) opts.callback()
  }
}

export default CesiumMeasure
