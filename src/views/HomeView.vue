<script setup>
import { onMounted } from 'vue'
import * as Cesium from 'cesium'
import { addGridTileCoord, getCenterPosition, getMousePosition, getTileLayerLevel, getCurrentViewRectangle } from "@/common/utils.js"

//cesium初始化必须写在mounted生命周期里面，否则会报错"Element with id "cesiumContainer" does not exist in the document."
onMounted(() => {
  let viewer = new Cesium.Viewer('cesium-contanier', {
    //这里是配置项
  })
  // 添加地形数据
  // viewer.terrainProvider = Cesium.createWorldTerrainAsync();
  // 添加网格
  addGridTileCoord(viewer)

  // 设置相机初始位置
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(114.26783201317139, 30.569111093990355, 2000),
    orientation: {
      heading: 6.283185307179586,
      // 视角
      pitch: -1.5686521559334161,
      roll: 0,
    }
  });

  // 地形夸张
  viewer.scene.globe.terrainExaggeration = 8.0;

  console.log(viewer.camera.position);

  // 显示帧率
  viewer.scene.debugShowFramesPerSecond = true;


  // 获取地图中心点坐标
  console.log(getCenterPosition(viewer));

  // 获取当前鼠标位置
  getMousePosition(viewer);

  // 获取当前地图瓦片级别
  getTileLayerLevel(viewer, zoom => {
    console.log('当前地图瓦片级别为:', zoom)
  });
  // 获取当前地图视图范围
  getCurrentViewRectangle(viewer, rectangle => {
    console.log('当前地图视图范围为:', rectangle)
  })
})

</script>

<template>
  <div class="cesium-contanier" id="cesium-contanier"></div>
</template>

<style>
.cesium-contanier {
  width: 100%;
  height: 100%;
}
</style>
