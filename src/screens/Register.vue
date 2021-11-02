<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from '../components/AppHeader.vue'

export default defineComponent({
  components: {
    AppHeader,
  },
})
</script>

<template>
  <AppHeader login />
  <div class="m-4 sm:m-0">
    <div
      class="
        relative
        mx-auto
        max-w-sm
        p-6
        pt-10
        sm:p-10 sm:pt-20
        -mt-10
        sm:-mt-12
        rounded-3xl
        bg-white
        shadow
        z-10
      "
    >
      <form action="">
        <div class="flex justify-between gap-4">
          <input
            type="text"
            id="firstname"
            class="
              px-4
              py-3.5
              mb-4
              rounded-xl
              bg-blue-xlight
              border-2 border-blue-light
              text-neutral
              placeholder-neutral-xlight
              w-full
              hover:border-blue
              focus:outline-none
              focus-visible:ring
            "
            placeholder="First name"
          />
          <input
            type="text"
            id="lastname"
            class="
              px-4
              py-3.5
              mb-4
              rounded-xl
              bg-blue-xlight
              border-2 border-blue-light
              text-neutral
              placeholder-neutral-xlight
              w-full
              hover:border-blue
              focus:outline-none
              focus-visible:ring
            "
            placeholder="Last name"
          />
        </div>
        <input
          type="text"
          id="email"
          class="
            px-4
            py-3.5
            mb-4
            rounded-xl
            bg-blue-xlight
            border-2 border-blue-light
            text-neutral
            placeholder-neutral-xlight
            w-full
            hover:border-blue
            focus:outline-none
            focus-visible:ring
          "
          placeholder="Email address"
        />
        <input
          type="password"
          id="password"
          class="
            px-4
            py-3.5
            mb-4
            rounded-xl
            bg-blue-xlight
            border-2 border-blue-light
            text-neutral
            placeholder-neutral-xlight
            w-full
            hover:border-blue
            focus:outline-none
            focus-visible:ring
          "
          placeholder="Password"
        />
        <input
          type="password"
          id="confirm_password"
          class="
            px-4
            py-3.5
            mb-4
            rounded-xl
            bg-blue-xlight
            border-2 border-blue-light
            text-neutral
            placeholder-neutral-xlight
            w-full
            hover:border-blue
            focus:outline-none
            focus-visible:ring
          "
          placeholder="Confirm password"
        />
        <button
          class="
            bg-blue
            text-white
            px-4
            py-3.5
            mt-16
            rounded-xl
            w-full
            font-bold
            focus:outline-none
            focus-visible:ring
            flex
            relative
            justify-center
            hover:bg-blue-dark
          "
        >
          SIGN UP
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
      </form>
    </div>
  </div>
</template>
