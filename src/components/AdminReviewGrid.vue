<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    data: {
      type: Object as any,
    },
  },
  setup(props) {
    function timeDifference(current: any, previous: any) {
      var msPerMinute = 60 * 1000
      var msPerHour = msPerMinute * 60
      var msPerDay = msPerHour * 24
      var msPerMonth = msPerDay * 30
      var msPerYear = msPerDay * 365

      var elapsed = current - previous

      if (elapsed < msPerMinute) {
        return (
          Math.round(elapsed / 1000) +
          (Math.round(elapsed / 1000) > 1 ? ' seconds ago' : ' second ago')
        )
      } else if (elapsed < msPerHour) {
        return (
          Math.round(elapsed / msPerMinute) +
          (Math.round(elapsed / msPerMinute) > 1
            ? ' minutes ago'
            : ' minute ago')
        )
      } else if (elapsed < msPerDay) {
        return (
          Math.round(elapsed / msPerHour) +
          (Math.round(elapsed / msPerHour) > 1 ? ' hours ago' : ' hour ago')
        )
      } else if (elapsed < msPerMonth) {
        return (
          Math.round(elapsed / msPerDay) +
          (Math.round(elapsed / msPerDay) > 1 ? ' days ago' : ' day ago')
        )
      } else if (elapsed < msPerYear) {
        return (
          Math.round(elapsed / msPerMonth) +
          (Math.round(elapsed / msPerMonth) > 1 ? ' months ago' : ' month ago')
        )
      } else {
        return (
          Math.round(elapsed / msPerYear) +
          (Math.round(elapsed / msPerYear) > 1 ? ' years ago' : ' year ago')
        )
      }
    }
    return {
      props,
      timeDifference,
    }
  },
})
</script>

<template>
  <div class="mb-6 mt-6">
    <div class="mx-auto max-w-md border-b-2 py-4 border-blue-xlight">
      <div class="flex flex-col sm:justify-between sm:flex-row">
        <h1 class="font-bold text-lg">
          {{ props.data.user.firstName + ' ' + props.data.user.lastName }}
        </h1>
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
      <p class="pt-3 pb-1 break-words">{{ props.data.note }}</p>
      <p class="text-neutral-xlight">
        {{
          timeDifference(
            new Date(
              new Date().toLocaleString('en-US', {
                timeZone: 'UTC',
              }),
            ),

            new Date(props.data.updatedAt),
          )
        }}
      </p>
    </div>
  </div>
</template>
