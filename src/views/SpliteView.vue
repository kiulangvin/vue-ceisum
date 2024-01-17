<script setup>
import { onMounted, reactive } from 'vue'
import * as Cesium from 'cesium'

let viewer = reactive({});

onMounted(() => {
    viewer = new Cesium.Viewer('cesium-contanier', {
        //这里是配置项
    })
    // 设置相机初始位置
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114.26783201317139, 30.569111093990355, 20000000),
        orientation: {
            heading: 6.283185307179586,
            // 视角
            pitch: -1.5686521559334161,
            roll: 0,
        }
    });

    // 加载OSM在线地图（黑色风格）
    const layerLeft = viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
            url: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
            minimumLevel: 3,
            maximumLevel: 18
        })
    );
    // 设置分屏显示
    layerLeft.splitDirection = Cesium.SplitDirection.LEFT;

    // 设置分屏位置
    const split = document.getElementById("split");
    viewer.scene.splitPosition = split.offsetLeft / split.parentElement.offsetWidth;

})





</script>

<template>
    <div class="cesium-contanier" id="cesium-contanier">
        <div id='split'></div>
    </div>
</template>

<style>
.cesium-contanier {
    width: 100%;
    height: 100%;
}

#split {
    position: absolute;
    left: 50%;
    top: 0;
    background-color: red;
    width: 3px;
    height: 100%;
    z-index: 999;
}
</style>
