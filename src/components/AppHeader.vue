<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { useRouter } from 'vue-router'
import useFirebase from '../composables/useFirebase'
import useGraphQL from '../composables/useGraphQL'
import UserModel from '../interfaces/User'

export default defineComponent({
  props: {
    login: { type: Boolean },
  },
  setup() {
    const { query } = useGraphQL()
    const { user, logout } = useFirebase()
    const { push } = useRouter()

    const userData: Ref<UserModel[]> = ref([])

    const getUserData = async () => {
      const data = await query(
        'getUserById',
        `query getUserById ($id: String = "") {
          getUserById (id: $id) {
            id
            firstName
            lastName
            email
          }
        }`,
        { id: user.value?.uid },
      )

      userData.value = data
    }

    getUserData()

    const logOut = () => {
      logout()
        .then(() => {
          push('/login')
        })
        .catch((error: Error) => {
          console.error(error)
        })
    }
    return {
      user,
      userData,
      logOut,
    }
  },

  data() {
    return {
      dropdownOpen: false,
    }
  },
})
</script>

<template>
  <header class="flex items-center justify-center">
    <svg
      class="w-full h-32 sm:h-40"
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
    <div v-if="login" class="absolute w-32 top-6 sm:top-12">
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
        top-3
        sm:text-xl sm:top-6
      "
    >
      <RouterLink to="/" class="w-20 sm:w-24">
        <img src="../assets/logo.png" alt="" />
      </RouterLink>
      <div class="flex justify-between w-auto" v-if="user">
        <div class="relative">
          <button
            @click="dropdownOpen = !dropdownOpen"
            class="
              border border-white
              bg-black bg-opacity-5
              ml-3
              sm:ml-6
              rounded-full
              flex
              items-center
              hover:bg-opacity-0
              transition-all
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#ffffff"
              class="w-7 sm:w-full px-1"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
              />
            </svg>
            <p v-if="userData" class="pr-2">
              {{ userData.firstName }}
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              fill="#ffffff"
              class="w-5 sm:w-full"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          </button>
          <button
            v-if="dropdownOpen"
            @click="dropdownOpen = false"
            tabindex="-1"
            class="fixed inset-0 h-full w-full opacity-0 cursor-default z-20"
          ></button>
          <transition
            enter-active-class="transform opacity-0 duration-200"
            enter-to-class="opacity-100"
          >
            <div
              v-if="dropdownOpen"
              class="
                absolute
                mt-2
                w-48
                right-0
                bg-white
                drop-shadow
                text-neutral text-base
                font-medium
                rounded-lg
                overflow-hidden
                z-20
              "
            >
              <RouterLink
                to="/account/settings"
                class="block px-3 py-2 hover:bg-blue-xlight"
                >Account settings</RouterLink
              >
              <RouterLink
                to="/account/bookings"
                class="block px-3 py-2 hover:bg-blue-xlight"
                >My bookings</RouterLink
              >
              <RouterLink
                to="/account/reviews"
                class="block px-3 py-2 hover:bg-blue-xlight"
                >My reviews</RouterLink
              >
              <button
                @click="logOut"
                class="
                  block
                  px-3
                  py-3
                  w-full
                  font-semibold
                  border-t-2 border-blue-xlight
                  hover:bg-blue-xlight
                  text-left
                "
              >
                Sign out
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>
