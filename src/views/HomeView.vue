<script setup>
import { onMounted } from 'vue'
import * as Cesium from 'cesium'
//cesium初始化必须写在mounted生命周期里面，否则会报错"Element with id "cesiumContainer" does not exist in the document."
onMounted(() => {
  new Cesium.Viewer('cesium-contanier', {
    //这里是配置项
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
