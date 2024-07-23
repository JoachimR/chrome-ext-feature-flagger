<template>
  <div class="width-300px height-300px display-flex flex-direction-column border">
    <PopupMain class="flex-1 overflow-y-hidden" />
    <PopupFooter />
  </div>
</template>

<script lang="ts" setup>
import PopupFooter from './PopupFooter.vue'
import PopupMain from './PopupMain.vue'
</script>
<style scoped>
.width-300px {
  min-width: 300px;
  width: 300px;
  max-width: 300px;
}
.height-300px {
  height: 300px;
  min-height: 300px;
  max-height: 300px;
}
.border {
  border: 5px solid #1c3967;
}
.overflow-y-hidden {
  overflow-y: hidden;
}
</style>
