<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    data: {
      type: Object as any,
    },
  },
  setup(props) {
    return {
      props,
    }
  },
})
</script>

<template>
  <div class="mb-6">
    <div class="flex justify-between max-w-md">
      <h1 class="font-bold">{{ props.data.user.firstName }}</h1>
      <div class="flex">
        <div v-for="i in 5" :class="{ 'pr-1': i < 5 }" :key="i">
          <svg
            class="block h-6 w-6 transition-colors"
            :class="[
              props.data.stars >= i
                ? 'text-blue'
                : 'text-blue-xlight stroke-1 stroke-blue',
            ]"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
