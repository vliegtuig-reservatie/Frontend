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
    <div class="grid grid-cols-small sm:grid-cols gap-3 sm:gap-6 items-center">
      <img
        :src="'/img/' + props.data.flight.plane.agency + '.png'"
        class="flex self-center w-16"
      />
      <div class="flex flex-col">
        <p class="font-bold">
          {{
            props.data.flight.departureLocation.IATACode +
            '-' +
            props.data.flight.arrivalLocation.IATACode
          }}
        </p>
        <p class="font-bold text-sm text-neutral-xlight">
          {{ props.data.flight.plane.agency }}
        </p>
      </div>
      <p class="flex items-center font-bold">
        {{
          new Date(props.data.flight.departureTime).toLocaleString('en-US', {
            day: 'numeric',
            weekday: 'long',
            month: 'long',
            year: 'numeric',
          })
        }}
      </p>
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
      <RouterLink
        :to="'/account/bookings/' + props.data.flight.id"
        class="
          bg-blue
          text-white
          px-4
          py-3.5
          rounded-xl
          font-bold
          focus:outline-none
          focus-visible:ring
          flex
          relative
          h-14
          w-32
          mx-auto
          col-span-2
          my-8
          sm:col-span-1 sm:my-0
          items-center
          hover:bg-blue-dark
          transition-all
        "
      >
        DETAILS
        <svg
          class="
            absolute
            right-0
            p-1
            bg-blue-dark
            hover:bg-blue
            rounded
            mr-4
            w-6
            fill-current
            text-white
            transition-all
          "
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path
            d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
          />
        </svg>
      </RouterLink>
    </div>
  </div>
</template>
