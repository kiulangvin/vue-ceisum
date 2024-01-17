<script setup>
import { onMounted, reactive } from 'vue'
import * as Cesium from 'cesium'
import {
    modifyHomeButtonPosition
} from "@/common/utils.js"

// import { SnowEffect } from "@/common/snowEffect.js"
import { GlobeRotate } from "@/common/globelRotate"

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

    // 显示帧率
    viewer.scene.debugShowFramesPerSecond = true;

    // 修改homeButton的默认位置
    modifyHomeButtonPosition(viewer, 114.26783201317139, 30.569111093990355, 5000)

    // 下雪效果
    // new SnowEffect(viewer, {
    //     snowSize: 0.02, // 雪花大小
    //     snowSpeed: 60.0, // 雪速
    // })

    // 地球球体自转
    let globeRotate = new GlobeRotate(viewer);
    globeRotate.start();
    setTimeout(() => {
        globeRotate.stop();
        // 设置相机初始位置
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(114.26783201317139, 30.569111093990355, 2000),
            duration: 4,
        });
    }, 10 * 1000);
})





</script>

<template>
    <div class="cesium-contanier" id="cesium-contanier">
    </div>
</template>

<style>
.cesium-contanier {
    width: 100%;
    height: 100%;
}
</style>
