<template>
  <div class="width-500px height-500px display-flex flex-direction-column border">
    <PopupMain class="flex-1 overflow-y-hidden" />
    <PopupFooter />
  </div>
</template>

<script lang="ts" setup>
import PopupFooter from './PopupFooter.vue'
import PopupMain from './PopupMain.vue'
</script>
<style scoped>
.width-500px {
  min-width: 500px;
  width: 500px;
  max-width: 500px;
}
.height-500px {
  height: 500px;
  min-height: 500px;
  max-height: 500px;
}
.border {
  border: 5px solid #1c3967;
}
.overflow-y-hidden {
  overflow-y: hidden;
}
</style>
