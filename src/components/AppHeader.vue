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
      class="w-full h-40"
      viewBox="79.544 78.258 799.002 179.793"
      height="200.793"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          x1="376.316"
          y1="-0.391"
          x2="376.316"
          y2="179.402"
          id="gradient-0"
          gradientTransform="matrix(0, 4.442996, -4.442996, 0, 903.787021, -1527.102213)"
        >
          <stop offset="0" style="stop-color: rgb(116, 138, 255)"></stop>
          <stop offset="0.47" style="stop-color: rgb(110, 150, 255)"></stop>
          <stop offset="1" style="stop-color: rgb(103, 164, 255)"></stop>
        </linearGradient>
      </defs>
      <path
        id="svg_9"
        d="M 107.101 68.685 L 906.101 68.685 L 906.101 210.685 C 907.101 210.685 495.101 297.685 107.101 207.685"
        opacity="NaN"
        stroke-width="0"
        stroke="#000"
        style="fill: url(#gradient-0); paint-order: fill markers"
        transform="matrix(1, 0, 0, 1, -27.556749, 9.573202)"
      ></path>
    </svg>
    <div v-if="login" class="absolute w-32 top-12">
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
