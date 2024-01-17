<script setup>
import { onMounted, reactive } from 'vue'
import * as Cesium from 'cesium'

let view3D = reactive({});

onMounted(() => {
    view3D = new Cesium.Viewer('view3D', {
        //这里是配置项
    })
    // 设置相机初始位置
    view3D.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114.26783201317139, 30.569111093990355, 20000000),
        orientation: {
            heading: 6.283185307179586,
            // 视角
            pitch: -1.5686521559334161,
            roll: 0,
        }
    });

    view3D.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
            url: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
            minimumLevel: 3,
            maximumLevel: 18
        })
    );

    let view2D = new Cesium.Viewer("view2D", {
        sceneMode: Cesium.SceneMode.SCENE2D
    });

    let active3D = false;
    let active2D = false;
    const leftHandler = new Cesium.ScreenSpaceEventHandler(view3D.canvas)
    leftHandler.setInputAction(() => {
        active3D = true;
        active2D = false;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    const rightHandler = new Cesium.ScreenSpaceEventHandler(view2D.canvas)
    rightHandler.setInputAction(() => {
        active3D = false;
        active2D = true;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    view3D.scene.postRender.addEventListener(() => {
        if (active2D) return
        const destination = Cesium.Cartographic.toCartesian(view3D.camera.positionCartographic)
        view2D.camera.setView({
            destination: new Cesium.Cartesian3(destination.x, destination.y, destination.z),
        })
    })

    view2D.scene.postRender.addEventListener(() => {
        if (active3D) return

        const destination = Cesium.Cartographic.toCartesian(view2D.camera.positionCartographic)

        view3D.camera.setView({
            destination: new Cesium.Cartesian3(destination.x, destination.y, destination.z),
            orientation: {
                heading: view3D.camera.heading,
                pitch: view3D.camera.pitch,
                roll: view3D.camera.roll
            }
        })

    })
})






</script>

<template>
    <div class="cesium-contanier" id="cesium-contanier">
        <div id="view3D"></div>
        <div id="view2D"></div>
    </div>
</template>

<style>
.cesium-contanier {
    width: 100%;
    height: 100%;
    display: flex;
}

#view3D {
    display: inline-block;
    width: 100%;
}

#view2D {
    display: inline-block;
    width: 100%;
}
</style>
