<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import AppHeader from '../../components/AppHeader.vue'
import useFirebase from '../../composables/useFirebase'
import useGraphQL from '../../composables/useGraphQL'
import User from '../../interfaces/User'

export default defineComponent({
  components: {
    AppHeader,
  },

  setup() {
    const { user, resetPassword } = useFirebase()
    const { query } = useGraphQL()

    const userData = ref<User>()
    const firstNameInput = ref<string>()
    const lastNameInput = ref<string>()
    const showAlert = ref<boolean>(false)

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

      if (userData.value !== undefined && userData !== null) {
        firstNameInput.value = userData.value.firstName
        lastNameInput.value = userData.value.lastName
      }
    }

    const updateUser = async () => {
      const response = await query(
        `updateUser`,
        `mutation updateUser($data: UserInput!, $id: String!) {
          updateUser(data: $data, id: $id) {
            id
          }
        }`,
        {
          data: {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
          },
          id: user.value?.uid,
        },
      )

      if (userData.value !== undefined) {
        userData.value.firstName = firstNameInput.value
        userData.value.lastName = lastNameInput.value
      }
    }

    const passwordReset = (event: Event) => {
      event.preventDefault()

      if (user.value) {
        resetPassword(user.value?.email!).then((success: boolean) => {
          if (success) showAlert.value = true
        })
      }
    }

    getUserData()

    return {
      user,
      userData,
      firstNameInput,
      lastNameInput,
      updateUser,
      passwordReset,
      showAlert,
    }
  },
})
</script>

<template>
  <div v-if="userData">
    <AppHeader />
    <div class="mx-4">
      <div
        class="
          relative
          mx-auto
          max-w-7xl
          p-6
          sm:p-8
          -mt-20
          rounded-3xl
          bg-white
          shadow
          z-10
        "
      >
        <div class="flex items-center text-sm -mt-4">
          <RouterLink to="/">Dashboard</RouterLink>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            class="w-5"
            fill="#000000"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M10.02 6L8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z"
            />
          </svg>
          <p class="text-neutral-xlight pointer-events-none">
            Account settings
          </p>
        </div>
        <h1 class="text-2xl mb-4 font-bold border-b-2 pb-4 border-blue-light">
          Account settings
        </h1>
        <div class="mb-8 flex flex-col sm:flex-row sm:items-center">
          <h2 class="text-lg py-1 font-bold w-40">First Name</h2>
          <input
            v-model="firstNameInput"
            type="text"
            id="reviewDescription"
            class="
              px-4
              py-2
              rounded-xl
              bg-blue-xlight
              border-2 border-blue-light
              text-neutral
              placeholder-neutral-xlight
              w-full
              sm:max-w-xs
              hover:border-blue
              focus:outline-none
              focus-visible:ring
              transition-colors
            "
            placeholder="First Name"
          />
        </div>
        <div class="mb-8 flex flex-col sm:flex-row sm:items-center">
          <h2 class="text-lg py-1 font-bold w-40">Last Name</h2>
          <input
            v-model="lastNameInput"
            type="text"
            id="reviewDescription"
            class="
              px-4
              py-2
              rounded-xl
              bg-blue-xlight
              border-2 border-blue-light
              text-neutral
              placeholder-neutral-xlight
              w-full
              sm:max-w-xs
              hover:border-blue
              focus:outline-none
              focus-visible:ring
              transition-colors
            "
            placeholder="Last Name"
          />
        </div>
        <div class="mb-8 flex flex-col sm:flex-row sm:items-center">
          <h2 class="text-lg py-1 font-bold w-40">Email address</h2>
          <p>{{ user.email }}</p>
        </div>
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center">
          <h2 class="text-lg py-1 font-bold w-40">Password</h2>
          <button
            @click="passwordReset($event)"
            class="
              bg-blue
              text-white
              px-4
              py-3
              rounded-xl
              font-bold
              focus:outline-none
              focus-visible:ring
              flex
              w-52
              relative
              hover:bg-blue-dark
              transition-all
            "
          >
            <p class="text-center w-full">CHANGE PASSWORD</p>
          </button>
        </div>
        <div
          v-if="showAlert"
          class="
            bg-neutral-xlight
            w-full
            max-w-md
            py-3
            px-4
            rounded-lg
            text-white
            flex
            items-center
            justify-between
          "
        >
          <p>An email has been sent to reset your password.</p>
          <div class="ml-4">
            <svg
              @click="showAlert = false"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="
                text-white
                fill-current
                bg-neutral-xlight
                rounded-full
                w-6
                h-6
                p-1
                hover:bg-neutral-light
              "
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </div>
        </div>
        <button
          v-if="
            (userData.firstName !== firstNameInput ||
              userData.lastName !== lastNameInput) &&
            firstNameInput !== '' &&
            lastNameInput !== ''
          "
          @click="updateUser()"
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
            mt-12
            items-center
            hover:bg-blue-dark
            transition-all
          "
        >
          SAVE
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
        </button>
      </div>
    </div>
  </div>
</template>
