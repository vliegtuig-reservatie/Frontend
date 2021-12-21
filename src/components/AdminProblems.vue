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
  <div>
    <div class="grid grid-cols-xsmall sm:grid-cols gap-3 sm:gap-6 items-center">
      <img
        :src="'/img/' + props.data.plane.agency + '.png'"
        class="flex self-center w-16"
      />
      <div class="flex flex-col">
        <p class="font-bold">
          {{ props.data.departureLocation.IATACode }}-{{
            props.data.arrivalLocation.IATACode
          }}
        </p>
        <p class="font-bold text-sm text-neutral-xlight">
          {{ props.data.plane.agency }}
        </p>
      </div>

      <p class="flex items-center font-bold">
        {{
          new Date(props.data.departureTime).toLocaleString('en-US', {
            day: 'numeric',
            weekday: 'long',
            month: 'long',
            year: 'numeric',
          })
        }}
      </p>
      <div
        class="bg-red-500 w-full max-w-sm py-3 col-span-2 px-4 rounded-lg text-white flex items-center"
      >
        <div class="mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="text-white fill-current bg-neutral-xlight rounded-full w-6 h-6 p-1 hover:bg-neutral-light"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <circle cx="12" cy="19" r="2" />
            <path d="M10 3h4v12h-4z" />
          </svg>
        </div>
        <p class="font-bold">This flight has been fully booked! <br /></p>
      </div>
    </div>
  </div>
</template>
