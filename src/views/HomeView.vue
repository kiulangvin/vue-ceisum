<script setup>
import { onMounted, reactive } from 'vue'
import * as Cesium from 'cesium'
import {
  addGridTileCoord, getCenterPosition,
  getMousePosition, getTileLayerLevel, getCurrentViewRectangle,
  modifyHomeButtonPosition
} from "@/common/utils.js"

import CesiumMeasure from "@/common/measure.js"
import { HawkEye3DMap } from "@/common/eyeMap.js"

let viewer = reactive({});

//cesium初始化必须写在mounted生命周期里面，否则会报错"Element with id "cesiumContainer" does not exist in the document."
onMounted(() => {
  viewer = new Cesium.Viewer('cesium-contanier', {
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

  // // 鹰眼地图初始化
  let hawkEyeMap = new HawkEye3DMap(viewer);
  hawkEyeMap._init();

  // 修改homeButton的默认位置
  modifyHomeButtonPosition(viewer, 114.26783201317139, 30.569111093990355, 5000)
})

const measureLen = () => {
  // 测量工具
  let measure = new CesiumMeasure({ viewer })
  measure.measureLength({

  })
}



</script>

<template>
  <div class="cesium-contanier" id="cesium-contanier">
    <button @click="measureLen()">测量长度</button>
    <!-- <div class="hawkEyeMap" id="hawkEyeMap"></div> -->
  </div>
</template>

<style>
.cesium-contanier {
  width: 100%;
  height: 100%;
}

/* .hawkEyeMap {
  position: absolute;
  left: 70%;
  top: 2%;
  border-radius: 50%;
  height: 160px;
  width: 160px;
  overflow: hidden;
  border: 2px solid #002FA7;
  z-index: 999;
} */
</style>
