<template>
  <div class="display-flex border-bottom">
    <VueDraggableNext
      v-model="store.ffOff"
      class="flex-1 overflow-auto hide-scrollbar border-right padding-4px"
      group="tags"
    >
      <Tag v-for="element in store.ffOff" :key="element" :name="element" :active="false" @close="onCloseTag" />
    </VueDraggableNext>
    <VueDraggableNext v-model="store.ffOn" class="flex-1 overflow-auto hide-scrollbar padding-4px" group="tags">
      <Tag v-for="element in store.ffOn" :key="element" :name="element" :active="true" @close="onCloseTag" />
    </VueDraggableNext>
  </div>
</template>

<script lang="ts" setup>
import { VueDraggableNext } from 'vue-draggable-next'
import { useStore } from '../store.ts'
import Tag from './Tag.vue'

const store = useStore()

const onCloseTag = (name: string) => {
	store.removeFeatureFlag(name)
}
</script>
