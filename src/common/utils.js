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

// 坐标转换

export const coordTransform = {
  // wgs84(角度制)转笛卡尔
  wgs84ToCartesian3: function (lng, lat, alt) {
    return Cesium.Cartesian3.fromDegrees(lng, lat, alt)
  },
  // 笛卡尔转wgs84(角度制)
  cartesian3ToWGS84: function (cartesian3) {
    let cartographic = Cesium.Cartographic.fromCartesian(cartesian3)
    return {
      lng: Cesium.Math.toDegrees(cartographic.longitude),
      lat: Cesium.Math.toDegrees(cartographic.latitude),
      alt: cartographic.height
    }
  },
  // 屏幕坐标 转 笛卡尔坐标
  pxToCartesian3: function (px, viewer) {
    if (px && viewer) {
      let isOn3dtiles = false
      let isOnTerrain = false
      var cartesian = null
      let picks = viewer.scene.drillPick(px)
      if (picks.length > 0) {
        for (let i = 0; i < picks.length; i++) {
          let pick = picks[i]
          if (pick && pick.primitive) {
            if (
              pick.primitive instanceof Cesium.Cesium3DTileFeature ||
              pick.primitive instanceof Cesium.Cesium3DTileset ||
              pick.primitive instanceof Cesium.Model
            ) {
              isOn3dtiles = true
            }
          }

          // 3dtiles、模型、场景等
          if (isOn3dtiles) {
            // 屏幕转场景坐标，包含地形和模型等的场景坐标
            cartesian = viewer.scene.pickPosition(px)
            if (cartesian) {
              cartesian.height = cartesian.height > 0 ? cartesian.height : 0
            }
          }
        }
      }
      // 地表
      let boolTerrain = viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider
      if (!isOn3dtiles && !boolTerrain) {
        // 屏幕转地表坐标
        let ray = viewer.camera.getPickRay(px)
        let position = viewer.scene.globe.pick(ray, viewer.scene)
        if (position) {
          cartesian = position
          isOnTerrain = true
        }
      }
      // 椭球面
      if (!isOn3dtiles && !isOnTerrain && boolTerrain) {
        cartesian = viewer.scene.camera.pickEllipsoid(px, viewer.scene.globe.ellipsoid)
      }
      if (cartesian) {
        return cartesian
      }
    }
  }
}

// 修改homeButton的默认位置

export function modifyHomeButtonPosition(viewer, lon, lat, height) {
  viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
    e.cancel = true
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, height)
    })
  })
}
