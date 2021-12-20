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
    const passengerCount = ref<number>(1)

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
            plane {
                rowCount
                columncount
                businessRowCount
                businessColumncount
                firstclassRowCount
                firstclassColumncount
                economyRowCount
                economyColumncount
            }
            bookedSeats {
                id
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
      passengerCount,
    }
  },
})
</script>

<template>
  <div v-if="flight">
    <AppHeader />
    <div class="mx-4">
      <div
        v-if="
          flight.bookedSeats.length <
          flight.plane.firstclassRowCount * flight.plane.firstclassColumncount +
            flight.plane.economyRowCount * flight.plane.economyColumncount +
            flight.plane.businessRowCount * flight.plane.businessColumncount
        "
        class="relative mx-auto max-w-7xl p-6 sm:p-8 -mt-20 rounded-3xl bg-white shadow z-10"
      >
        <div class="flex flex-col md:justify-between md:flex-row">
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
            <div
              class="flex flex-col gap-0 sm:gap-6 sm:flex-row lg:gap-20 border-t-2 border-blue-light mr-8"
            >
              <div class="w-full max-w-xs mx-auto sm:mx-0">
                <h2 class="text-lg font-bold py-4">Your flight</h2>
                <div
                  class="px-4 py-3.5 mb-4 rounded-xl bg-blue-xlight border-2 border-blue-light text-neutral placeholder-neutral-xlight w-full min-w-max max-w-xs"
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
                  class="px-4 py-3.5 mb-4 rounded-xl bg-blue-xlight border-2 border-blue-light text-neutral placeholder-neutral-xlight w-full min-w-max max-w-xs"
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
              <div
                class="mx-auto max-w-xs w-full sm:mx-0 sm:max-w-none sm:w-auto"
              >
                <h2 class="text-lg font-bold py-4">Passengers</h2>
                <div class="flex mb-12">
                  <input
                    type="number"
                    id="passengers"
                    class="px-4 py-1 rounded-xl bg-blue-xlight border-2 border-blue-light text-neutral placeholder-neutral-xlight w-16 hover:border-blue focus:outline-none focus-visible:ring text-center"
                    v-model="passengerCount"
                    min="1"
                    required
                    :max="
                      flight.plane.firstclassRowCount *
                        flight.plane.firstclassColumncount +
                      flight.plane.economyRowCount *
                        flight.plane.economyColumncount +
                      flight.plane.businessRowCount *
                        flight.plane.businessColumncount -
                      flight.bookedSeats.length
                    "
                    @input="
                      passengerCount < 0 ? (passengerCount = 1) : passengerCount
                    "
                  />
                  <button
                    @click="
                      passengerCount =
                        passengerCount === 1 ? 1 : passengerCount - 1
                    "
                    class="bg-blue text-white px-2 py-2 mx-3 rounded-full font-bold focus:outline-none focus-visible:ring flex relative col-span-2 sm:col-span-1 sm:my-0 items-center justify-center hover:bg-blue-dark transition-all"
                  >
                    <svg
                      class="p-0.5 bg-blue-dark hover:bg-blue rounded w-6 fill-current text-white transition-all"
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
                    class="bg-blue text-white px-2 py-2 rounded-full font-bold focus:outline-none focus-visible:ring flex relative items-center justify-center hover:bg-blue-dark transition-all"
                  >
                    <svg
                      class="p-0.5 bg-blue-dark hover:bg-blue rounded w-6 fill-current text-white transition-all"
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
            class="relative w-full max-w-sm bg-blue-xlight border-2 border-blue-light rounded-2xl px-5 py-3 flex flex-col justify-between mx-auto sm:mx-0"
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
                <p>21% tax</p>
                <p class="font-bold">
                  €{{ Math.floor((priceTax = pricePassengers * 0.21)) }}
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
                €{{ Math.floor((totalPrice = pricePassengers + priceTax + 2)) }}
              </p>
            </div>
          </div>
        </div>
        <div
          v-if="
            passengerCount >
            flight.plane.firstclassRowCount *
              flight.plane.firstclassColumncount +
              flight.plane.economyRowCount * flight.plane.economyColumncount +
              flight.plane.businessRowCount * flight.plane.businessColumncount -
              flight.bookedSeats.length
          "
          class="bg-red-500 w-full max-w-sm py-3 px-4 rounded-lg text-white flex mx-auto mt-4 items-center"
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
          <p
            v-if="
              flight.plane.firstclassRowCount *
                flight.plane.firstclassColumncount +
                flight.plane.economyRowCount * flight.plane.economyColumncount +
                flight.plane.businessRowCount *
                  flight.plane.businessColumncount -
                flight.bookedSeats.length ==
              1
            "
          >
            There is only
            {{
              flight.plane.firstclassRowCount *
                flight.plane.firstclassColumncount +
              flight.plane.economyRowCount * flight.plane.economyColumncount +
              flight.plane.businessRowCount * flight.plane.businessColumncount -
              flight.bookedSeats.length
            }}
            seat left on this flight!
          </p>
          <p v-else>
            There are only
            {{
              flight.plane.firstclassRowCount *
                flight.plane.firstclassColumncount +
              flight.plane.economyRowCount * flight.plane.economyColumncount +
              flight.plane.businessRowCount * flight.plane.businessColumncount -
              flight.bookedSeats.length
            }}
            seats left on this flight!
          </p>
        </div>
        <RouterLink
          v-if="
            passengerCount > 0 &&
            passengerCount <=
              flight.plane.firstclassRowCount *
                flight.plane.firstclassColumncount +
                flight.plane.economyRowCount * flight.plane.economyColumncount +
                flight.plane.businessRowCount *
                  flight.plane.businessColumncount -
                flight.bookedSeats.length
          "
          :to="{
            name: 'Seats',
            query: {
              passengers: passengerCount,
            },
          }"
          class="bg-blue text-white px-4 py-3.5 rounded-xl font-bold focus:outline-none focus-visible:ring flex relative w-28 mx-auto mt-12 items-center hover:bg-blue-dark transition-all"
        >
          NEXT
          <svg
            class="absolute right-0 p-1 bg-blue-dark hover:bg-blue rounded mr-4 w-6 fill-current text-white transition-all"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
            />
          </svg>
        </RouterLink>
        <button
          v-else
          class="bg-neutral-xlight text-white px-4 py-3.5 rounded-xl font-bold flex relative w-28 mx-auto mt-12 items-center transition-all cursor-not-allowed"
        >
          NEXT
          <svg
            class="absolute right-0 p-1 bg-neutral-xlight rounded mr-4 w-6 fill-current text-white transition-all"
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
      <div
        v-else
        class="relative mx-auto max-w-7xl p-6 sm:p-8 -mt-20 rounded-3xl bg-white shadow z-10"
      >
        <div class="flex">
          <div class="w-full">
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
            <div class="flex border-t-2 border-blue-light">
              <div
                v-if="
                  passengerCount >
                  flight.plane.firstclassRowCount *
                    flight.plane.firstclassColumncount +
                    flight.plane.economyRowCount *
                      flight.plane.economyColumncount +
                    flight.plane.businessRowCount *
                      flight.plane.businessColumncount -
                    flight.bookedSeats.length
                "
                class="bg-red-500 w-full max-w-md py-3 px-4 rounded-lg text-white flex mt-4 items-center"
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
                <p class="font-bold">
                  There are no seats left on this flight! <br />
                  <span class="font-normal"
                    >Flight control has been alerted to make a second flight
                    available if possible.</span
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
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
