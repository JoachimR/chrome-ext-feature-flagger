<template>
  <Popup :url="url" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Popup from "@/popup/Popup.vue";
import { getCurrentTabUrl } from "@/popup/get-current-tab-url";

export default defineComponent({
  name: "App",
  components: { Popup },
  data(): { url: string } {
    return {
      url: "",
    };
  },
  mounted(): void {
    getCurrentTabUrl((url) => {
      // this.url = "https://foo.bar?abc=0&def=1&qqq=1&a=b&abc=asdf";
      this.url = url;
    });
  },
});
</script>

<style>
body {
  margin: 0;
}
.display-flex {
  display: flex;
}
.flex-direction-column {
  flex-direction: column;
}
.flex-grow {
  flex-grow: 1;
}
.flex-1 {
  flex: 1;
}
.justify-flex-end {
  justify-content: flex-end;
}
.justify-space-between {
  justify-content: space-between;
}
.align-items-center {
  align-items: center;
}
.align-content-center {
  align-content: center;
}
.overflow-auto {
  overflow: auto;
}
.border-bottom {
  border-bottom: 1px solid #e9e9eb;
}
.margin-left-4px {
  margin: 4px;
}
.margin-4px {
  margin: 4px;
}
.padding-4px {
  padding: 4px;
}
.padding-vertical-4px {
  padding-top: 4px;
  padding-bottom: 4px;
}
.padding-horizontal-4px {
  padding-left: 4px;
  padding-right: 4px;
}
.padding-horizontal-8px {
  padding-left: 8px;
  padding-right: 8px;
}
</style>
