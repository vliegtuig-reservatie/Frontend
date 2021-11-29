<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import useGraphQL from '../composables/useGraphQL'
import Flight from '../interfaces/Flight'

export default defineComponent({
  components: {
    AppHeader,
  },

  setup() {
    const route = useRoute()
    const { query } = useGraphQL()

    const flightId = ref<string | undefined>(
      route.params.id ? (route.params.id as string) : undefined,
    )

    const flight = ref<Flight>()

    const getCurrentFlight = async () => {
      const data = await query(
        'getFlightById',
        `query getFlightById ($id: String = "") {
          getFlightById (id: $id) {
            departureTime
            arrivalTime
            departureLocation {
              id
              name
              IATACode
            }
            arrivalLocation {
              id
              name
              IATACode
            }
            plane {
              id
              agency
            }
          }
        }`,
        { id: flightId.value },
      )

      flight.value = data
    }

    getCurrentFlight()

    return {
      flightId,
      flight,
    }
  },
})
</script>

<template>
  <div>
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
          flex
          justify-between
        "
      >
        <div class="w-full max-w-2xl">
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
            <p class="text-neutral-xlight pointer-events-none">Booking</p>
          </div>
          <h1 class="text-2xl mb-4 font-bold">Confirm your booking</h1>
          <div class="flex gap-20 border-t-2 border-blue-light">
            <div class="w-full max-w-xs">
              <h2 class="text-lg font-bold py-4">Your flight</h2>
              <div
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
                "
              >
                <p class="text-sm font-bold text-neutral-light">
                  Departing time
                </p>
                <p>
                  {{
                    new Date(flight.departureTime).toLocaleString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })
                  }}
                </p>
              </div>
              <div
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
                "
              >
                <p class="text-sm font-bold text-neutral-light">Arrival time</p>
                <p>
                  {{
                    new Date(flight.arrivalTime).toLocaleString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })
                  }}
                </p>
              </div>
            </div>
            <div>
              <h2 class="text-lg font-bold py-4">Passengers</h2>
            </div>
          </div>
        </div>
        <div
          class="
            w-full
            max-w-sm
            bg-blue-xlight
            border-2 border-blue-light
            rounded-2xl
            px-5
            py-3
          "
        >
          <h1 class="text-2xl mb-4 font-bold">Summary</h1>
        </div>
      </div>
    </div>
  </div>
</template>
