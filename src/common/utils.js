import * as Cesium from 'cesium'

// 获取当前地图的中心点经纬度
export function getCenterPosition(viewer) {
  // 获取场景的中心点
  const camera = viewer.camera
  const canvas = viewer.canvas
  const center = camera.pickEllipsoid(
    new Cesium.Cartesian2(canvas.clientWidth / 2, canvas.clientHeight / 2),
    viewer.scene.globe.ellipsoid
  )
  // 弧度制的wgs坐标
  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(center)
  // 弧度转角度
  let longitude = Cesium.Math.toDegrees(cartographic.longitude)
  let latitude = Cesium.Math.toDegrees(cartographic.latitude)
  return { longitude, latitude }
}

// 获取当前鼠标位置
export function getMousePosition(viewer) {
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((e) => {
    // 屏幕转椭球面笛卡尔坐标，不包含地形、模型等的坐标
    let clickPosition = viewer.scene.camera.pickEllipsoid(e.position)
    // 屏幕转笛卡尔坐标(场景)，包含地形、模型等场景的坐标
    let cartesian3 = viewer.scene.pickPosition(e.position)

    console.log('椭球面笛卡尔坐标', clickPosition)

    console.log('地形的笛卡尔', cartesian3)

    // 笛卡尔转经纬度（弧度）坐标
    let radiansPos = Cesium.Cartographic.fromCartesian(clickPosition)
    // 弧度转角度
    let longitude = Cesium.Math.toDegrees(radiansPos.longitude)
    let latitude = Cesium.Math.toDegrees(radiansPos.latitude)
    console.log('经纬度', longitude, latitude)
    // let ray = viewer.camera.getPickRay(cartesian2);
    // let cartesian3_2 = globe.pick(ray,viewer.scene);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

// 监听鼠标滚轮获取当前瓦片图层的级别
export function getTileLayerLevel(viewer, callback) {
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction(() => {
    callback(_getTileLayerLevel(viewer))
  }, Cesium.ScreenSpaceEventType.WHEEL)
}
// 获取当前瓦片图层的级别
function _getTileLayerLevel(viewer) {
  let tiles = new Set()
  let tilesToRender = viewer.scene.globe._surface._tilesToRender
  if (Cesium.defined(tilesToRender)) {
    for (let i = 0; i < tilesToRender.length; i++) {
      tiles.add(tilesToRender[i].level)
    }

    // console.log(tiles)
    return tiles
  }
}

// 添加网格图层并且置顶
export function addGridTileCoord(viewer) {
  // 添加网格
  var imageryLayers = viewer.imageryLayers
  let gridProvider = new Cesium.TileCoordinatesImageryProvider()
  let gridLayer = imageryLayers.addImageryProvider(gridProvider)
  imageryLayers.raiseToTop(gridLayer)
}

// 获取当前可视矩形范围
export function getCurrentViewRectangle(viewer, callback) {
  viewer.camera.moveEnd.addEventListener(() => {
    let rectangle = viewer.camera.computeViewRectangle()
    console.log(rectangle)
    callback(rectangle)
  })
}

// 绘制圆形
