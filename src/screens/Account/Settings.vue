<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import AppHeader from '../../components/AppHeader.vue'

export default defineComponent({
  components: {
    AppHeader,
  },

  setup() {},
})
</script>

<template>
  <div>
    <AppHeader />
    <div class="mx-4">
      <div
        class="
          relative
          mx-auto
          max-w-7xl
          p-6
          sm:p-8
          -mt-20
          rounded-3xl
          bg-white
          shadow
          z-10
        "
      ></div>
    </div>
  </div>
</template>
