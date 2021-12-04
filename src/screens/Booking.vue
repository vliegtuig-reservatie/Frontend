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
            price
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

  data() {
    return {
      passengerCount: 1,
    }
  },
})
</script>

<template>
  <div v-if="flight">
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
        <div class="flex justify-between">
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
            <div class="flex gap-20 border-t-2 border-blue-light mr-8">
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
                  <p class="text-sm font-bold text-neutral-light">Departing</p>
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
                  <p>
                    {{
                      flight.departureLocation.name +
                      ' (' +
                      flight.departureLocation.IATACode +
                      ')'
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
                  <p class="text-sm font-bold text-neutral-light">Arrival</p>
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
                  <p>
                    {{
                      flight.arrivalLocation.name +
                      ' (' +
                      flight.arrivalLocation.IATACode +
                      ')'
                    }}
                  </p>
                </div>
              </div>
              <div>
                <h2 class="text-lg font-bold py-4">Passengers</h2>
                <div class="flex">
                  <input
                    type="number"
                    id="passengers"
                    class="
                      px-4
                      py-1
                      rounded-xl
                      bg-blue-xlight
                      border-2 border-blue-light
                      text-neutral
                      placeholder-neutral-xlight
                      w-16
                      hover:border-blue
                      focus:outline-none
                      focus-visible:ring
                      text-center
                    "
                    :value="passengerCount"
                    min="1"
                    oninput="validity.valid||(value='');"
                  />
                  <button
                    @click="
                      passengerCount =
                        passengerCount === 1 ? 1 : passengerCount - 1
                    "
                    class="
                      bg-blue
                      text-white
                      px-2
                      py-2
                      mx-3
                      rounded-full
                      font-bold
                      focus:outline-none
                      focus-visible:ring
                      flex
                      relative
                      col-span-2
                      sm:col-span-1 sm:my-0
                      items-center
                      justify-center
                      hover:bg-blue-dark
                      transition-all
                    "
                  >
                    <svg
                      class="
                        p-0.5
                        bg-blue-dark
                        hover:bg-blue
                        rounded
                        w-6
                        fill-current
                        text-white
                        transition-all
                      "
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M19 13H5v-2h14v2z" />
                    </svg>
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path
                      d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
                    />
                  </button>
                  <button
                    @click="passengerCount++"
                    class="
                      bg-blue
                      text-white
                      px-2
                      py-2
                      rounded-full
                      font-bold
                      focus:outline-none
                      focus-visible:ring
                      flex
                      relative
                      mx-auto
                      col-span-2
                      sm:col-span-1 sm:my-0
                      items-center
                      justify-center
                      hover:bg-blue-dark
                      transition-all
                    "
                  >
                    <svg
                      class="
                        p-0.5
                        bg-blue-dark
                        hover:bg-blue
                        rounded
                        w-6
                        fill-current
                        text-white
                        transition-all
                      "
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path
                      d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="
              relative
              w-full
              max-w-sm
              bg-blue-xlight
              border-2 border-blue-light
              rounded-2xl
              px-5
              py-3
              flex flex-col
              justify-between
            "
          >
            <div class="leading-8">
              <h1 class="text-2xl mb-4 font-bold">Summary</h1>
              <div class="flex justify-between">
                <p>{{ passengerCount }}x Passenger(s)</p>
                <p class="font-bold">
                  €{{ (pricePassengers = flight.price * passengerCount) }}
                </p>
              </div>
              <div class="flex justify-between">
                <p>31% tax</p>
                <p class="font-bold">
                  €{{ (priceTax = pricePassengers * 0.31) }}
                </p>
              </div>
              <div class="flex justify-between">
                <p>Service fee</p>
                <p class="font-bold">€2</p>
              </div>
            </div>
            <div
              class="flex justify-between bg-blue-light px-3 py-2 rounded-lg"
            >
              <p>Total</p>
              <p class="font-bold">
                €{{ (totalPrice = pricePassengers + priceTax + 2) }}
              </p>
            </div>
          </div>
        </div>
        <RouterLink
          :to="{
            name: 'Seats',
            query: {
              passengers: passengerCount,
            },
          }"
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
          NEXT
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
  </div>
</template>

<style>
/* hide number input arrows */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
