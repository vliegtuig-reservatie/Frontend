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
    <div class="grid grid-cols-small sm:grid-cols gap-3 sm:gap-6">
      <img src="/img/TUI.png" class="flex self-center w-16" />
      <div class="flex flex-col">
        <p class="font-bold">
          {{
            new Date(props.data.departureTime).toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
              timeZone: 'UTC',
            }) +
            ' - ' +
            new Date(props.data.arrivalTime).toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
              timeZone: 'UTC',
            })
          }}
        </p>
        <p class="font-bold text-sm text-neutral-xlight">TUI</p>
      </div>
      <div class="flex flex-col">
        <p class="font-bold">
          {{
            new Date(
              new Date(props.data.arrivalTime) -
                new Date(props.data.departureTime),
            ).getHours() +
            ' hours ' +
            new Date(
              new Date(props.data.arrivalTime) -
                new Date(props.data.departureTime),
            ).getMinutes() +
            ' minutes'
          }}
        </p>
        <p class="font-bold text-sm text-neutral-xlight">PAR-NY</p>
      </div>
      <p class="flex items-center font-bold">
        {{
          new Date(props.data.arrivalTime).toLocaleString('en-US', {
            day: 'numeric',
            weekday: 'long',
            month: 'long',
          })
        }}
      </p>
      <button
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
          w-28
          mx-auto
          col-span-2
          my-8
          sm:col-span-1 sm:my-0
          items-center
          hover:bg-blue-dark
        "
      >
        BOOK
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
          "
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path
            d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
