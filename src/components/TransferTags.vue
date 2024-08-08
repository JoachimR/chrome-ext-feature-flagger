<template>
  <div class="display-flex border-bottom">
    <div
      class="flex-1 overflow-auto display-flex flex-direction-column border-right"
    >
      <h3 class="width-100 text-align-center">History</h3>
      <VueDraggableNext
        v-model="store.ffShelf"
        class="flex-1 overflow-auto hide-scrollbar padding-4px border-top"
        group="tags"
      >
        <Tag v-for="element in store.ffShelf" :key="element" :name="element" state="history" @close="onDeleteTag" />
      </VueDraggableNext>
    </div>

    <div
      class="flex-1 overflow-auto display-flex flex-direction-column border-right"
    >
      <h3 class="width-100 text-align-center">Flags OFF</h3>
      <VueDraggableNext
        v-model="store.ffOff"
        class="flex-1 overflow-auto hide-scrollbar padding-4px border-top"
        group="tags"
      >
        <Tag v-for="element in store.ffOff" :key="element" :name="element" state="off" @close="onDeleteTag" />
      </VueDraggableNext>
    </div>

    <div
      class="flex-1 overflow-auto display-flex flex-direction-column border-right"
    >
      <h3 class="width-100 text-align-center">Flags ON</h3>
      <VueDraggableNext
        v-model="store.ffOn"
        class="flex-1 overflow-auto hide-scrollbar padding-4px border-top"
        group="tags"
      >
        <Tag v-for="element in store.ffOn" :key="element" :name="element" state="on" @close="onDeleteTag" />
      </VueDraggableNext>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { VueDraggableNext } from 'vue-draggable-next'
import { useStore } from '../store.ts'
import Tag from './Tag.vue'

const store = useStore()

const onDeleteTag = (name: string) => {
	store.deleteFeatureFlag(name)
}
</script>
