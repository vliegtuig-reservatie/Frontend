<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    login: { type: Boolean },
  },
  setup() {},
})
</script>

<template>
  <header class="flex items-center justify-center">
    <svg
      class="object-cover"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 1920 215.003"
    >
      <defs>
        <linearGradient
          id="linear-gradient"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stop-color="#67a4ff" />
          <stop offset="0.5" stop-color="#6e96ff" />
          <stop offset="1" stop-color="#748aff" />
        </linearGradient>
      </defs>
      <path
        id="Path_4"
        data-name="Path 4"
        d="M943.264,3608c-108.014-1022.979,0-1920,0-1920h167V3608"
        transform="translate(-1688 1110.26) rotate(-90)"
        fill="url(#linear-gradient)"
      />
    </svg>
    <div v-if="login" class="absolute w-24 top-12">
      <img src="../assets/logo.png" alt="" />
    </div>
    <div
      v-else
      class="
        absolute
        flex
        justify-between
        w-full
        max-w-7xl
        px-7
        text-white text-base
        top-2
        lg:text-xl lg:top-5
      "
    >
      <div class="w-20 lg:w-24">
        <img src="../assets/logo.png" alt="" />
      </div>
      <div class="flex justify-between w-auto">
        <p
          class="
            border border-white
            bg-black bg-opacity-5
            px-2
            mx-6
            rounded-full
          "
        >
          Account
        </p>
        <p>Log out</p>
      </div>
    </div>
  </header>
</template>
