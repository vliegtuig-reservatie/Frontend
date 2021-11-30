<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import useFirebase from '../composables/useFirebase'
import User from '../interfaces/User'

export default defineComponent({
  components: {
    AppHeader,
  },

  setup() {
    const { login } = useFirebase()
    const { push } = useRouter()

    const userInput: User = reactive({ email: '', password: '' })

    const loginUser = (event: Event) => {
      event.preventDefault()

      if (userInput.email && userInput.password) {
        login(userInput.email, userInput.password).then((success: boolean) => {
          if (success) push('/')
        })
      }
    }

    return {
      loginUser,
      userInput,
    }
  },
})
</script>

<template>
  <AppHeader login />
  <div class="mx-4">
    <div
      class="
        relative
        mx-auto
        max-w-sm
        p-6
        pt-20
        sm:p-10 sm:pt-20
        -mt-12
        rounded-3xl
        bg-white
        shadow
        z-10
      "
    >
      <form @submit="loginUser($event)">
        <input
          v-model="userInput.email"
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
          v-model="userInput.password"
          type="password"
          id="password"
          class="
            px-4
            py-3.5
            mb-2
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
        <button class="float-right text-blue">Forgot password?</button>
        <button
          class="
            bg-blue
            text-white
            px-4
            py-3.5
            mt-52
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
          LOGIN
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
  <div class="relative mx-auto max-w-sm text-center py-5">
    <span
      >Don't have an account?
      <RouterLink to="/register" class="text-blue">Sign up</RouterLink></span
    >
  </div>
</template>
