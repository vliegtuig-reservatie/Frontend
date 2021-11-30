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
    const { createUser } = useFirebase()
    const { push } = useRouter()

    const userInput: User = reactive({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    })

    const registerAccount = (event: Event) => {
      event.preventDefault()

      if (
        userInput.firstName &&
        userInput.lastName &&
        userInput.email &&
        userInput.password &&
        userInput.confirmPassword
      ) {
        if (userInput.password === userInput.confirmPassword) {
          createUser(
            userInput.firstName,
            userInput.lastName,
            userInput.email as string,
            userInput.password as string,
          ).then((success: boolean) => {
            if (success) push('/')
          })
        } else {
          console.log('Passwords do not match')
        }
      } else {
        console.log('Invalid input', userInput)
      }
    }

    return {
      registerAccount,
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
      <form @submit="registerAccount($event)">
        <div class="flex justify-between gap-4">
          <input
            v-model="userInput.firstName"
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
            v-model="userInput.lastName"
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
          v-model="userInput.confirmPassword"
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
            mt-14
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
  <div class="relative mx-auto max-w-sm text-center py-5">
    <span
      >Already have an account?
      <RouterLink to="/login" class="text-blue">Log in</RouterLink></span
    >
  </div>
</template>
