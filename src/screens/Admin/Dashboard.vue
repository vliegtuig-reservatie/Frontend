<script lang="ts">
import { computed, defineComponent, ref, Ref } from 'vue'
import AppHeader from '../../components/AppHeader.vue'
import AdminFlightGrid from '../../components/AdminFlightGrid.vue'
import useFirebase from '../../composables/useFirebase'
import useGraphQL from '../../composables/useGraphQL'
import FlightModel from '../../interfaces/Flight'

export default defineComponent({
  components: {
    AppHeader,
    AdminFlightGrid,
  },

  setup() {
    const { query } = useGraphQL()
    const { user } = useFirebase()

    const flights: Ref<FlightModel[]> = ref([])
    const departureInput = ref<string>('')
    const arrivalInput = ref<string>('')
    const departureDateInput = ref<string>('')
    const arrivalDateInput = ref<string>('')

    const getFlights = async () => {
      const data = await query(
        'getFlights',
        `query getFlights {
          getFlights {
            id
            arrivalTime
            departureTime
            arrivalLocation {
              name
              IATACode
            }
            departureLocation {
              name
              IATACode
            }
            plane {
              agency
            }
            reviews {
              stars
            }
          }
        }`,
      )

      var filteredData = <any>[]
      data.forEach((a: any) => {
        if (a.reviews.length > 0) {
          filteredData.push(a)
        }
      })
      filteredData.sort((a: any, b: any) => {
        return (
          new Date(b.departureTime).getTime() -
          new Date(a.departureTime).getTime()
        )
      })
      flights.value = filteredData
    }

    const filteredFlights = computed(() => {
      return flights.value.filter(
        flight =>
          (flight.departureLocation.name
            .toLowerCase()
            .includes(departureInput.value.toLowerCase()) ||
            flight.departureLocation.IATACode.toLowerCase().includes(
              departureInput.value.toLowerCase(),
            )) &&
          (flight.arrivalLocation.name
            .toLowerCase()
            .includes(arrivalInput.value.toLowerCase()) ||
            flight.arrivalLocation.IATACode.toLowerCase().includes(
              arrivalInput.value.toLowerCase(),
            )) &&
          ((flight.departureTime.includes(departureDateInput.value) &&
            flight.arrivalTime.includes(arrivalDateInput.value)) ||
            (new Date(flight.departureTime) >=
              new Date(departureDateInput.value) &&
              new Date(flight.departureTime) <=
                new Date(
                  new Date(arrivalDateInput.value).setUTCHours(23, 59, 59, 999),
                ))),
      )
    })

    getFlights()

    return {
      flights,
      departureInput,
      departureDateInput,
      arrivalInput,
      arrivalDateInput,
      filteredFlights,
    }
  },
})
</script>

<template>
  <div>
    <AppHeader />
    <div class="mx-4">
      <div
        class="relative mx-auto max-w-7xl p-6 sm:p-8 -mt-20 rounded-3xl bg-white shadow z-10"
      >
        <div class="flex flex-col lg:justify-between lg:flex-row gap-6">
          <div class="flex justify-between w-full">
            <input
              v-model="departureInput"
              type="text"
              id="departure"
              class="px-4 py-3.5 rounded-xl bg-blue-xlight border-2 border-blue-light text-neutral placeholder-neutral-xlight w-full hover:border-blue focus:outline-none focus-visible:ring"
              placeholder="Departure"
            />
            <div
              class="p-3 rounded-full bg-white -ml-3 -mr-3 border-blue-light border-2 z-10"
            >
              <svg
                class="w-8"
                xmlns="http://www.w3.org/2000/svg"
                enable-background="new 0 0 24 24"
                viewBox="0 0 24 24"
                fill="#000000"
              >
                <g><rect fill="none" height="24" width="24" x="0" /></g>
                <g>
                  <g>
                    <polygon
                      points="7.41,13.41 6,12 2,16 6,20 7.41,18.59 5.83,17 21,17 21,15 5.83,15"
                    />
                    <polygon
                      points="16.59,10.59 18,12 22,8 18,4 16.59,5.41 18.17,7 3,7 3,9 18.17,9"
                    />
                  </g>
                </g>
              </svg>
            </div>

            <input
              v-model="arrivalInput"
              type="text"
              id="arrival"
              class="px-4 py-3.5 rounded-xl bg-blue-xlight border-2 border-blue-light text-neutral placeholder-neutral-xlight w-full hover:border-blue focus:outline-none focus-visible:ring"
              placeholder="Arrival"
            />
          </div>
          <div class="flex justify-between w-full">
            <input
              v-model="departureDateInput"
              type="date"
              id="departureDate"
              class="px-4 py-3.5 rounded-xl rounded-tr-none rounded-br-none bg-blue-xlight border-2 border-blue-light -mr-px text-neutral placeholder-neutral-xlight w-full hover:border-blue hover:z-10 focus:outline-none focus:z-20 focus-visible:ring"
              placeholder="Departure Date"
            />
            <input
              v-model="arrivalDateInput"
              type="date"
              id="arrivalDate"
              class="px-4 py-3.5 rounded-xl rounded-tl-none rounded-bl-none bg-blue-xlight border-2 border-blue-light text-neutral placeholder-neutral-xlight w-full hover:border-blue hover:z-10 focus:outline-none focus:z-20 focus-visible:ring"
              placeholder="Arrival Date"
            />
          </div>
        </div>
      </div>
      <div
        v-if="
          flights &&
          Object.keys(flights).length !== 0 &&
          Object.keys(filteredFlights).length !== 0
        "
        class="mx-auto max-w-7xl p-6 sm:p-8"
      >
        <div class="flex gap-4">
          <h1 class="text-2xl mb-8 font-bold">Flights</h1>
          <RouterLink
            to="/admin/problems"
            class="bg-red-500 text-white px-4 py-1 rounded-xl font-bold focus:outline-none focus-visible:ring flex relative w-32 h-9 items-center hover:bg-red-600 transition-all"
          >
            Problems
            <svg
              class="absolute right-0 p-1 bg-neutral-xlight hover:bg-neutral-light rounded-full mr-3 w-6 fill-current text-white transition-all"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <circle cx="12" cy="19" r="2" />
              <path d="M10 3h4v12h-4z" />
            </svg>
          </RouterLink>
        </div>

        <AdminFlightGrid
          v-for="flight of filteredFlights"
          :key="flight.id"
          :data="flight"
        />
      </div>
      <div
        class="text-center p-10"
        v-else-if="
          flights &&
          Object.keys(flights).length !== 0 &&
          Object.keys(filteredFlights).length == 0
        "
      >
        <h1>There are no flights based on these search results.</h1>
      </div>
      <div v-else class="mx-auto max-w-7xl p-6 sm:p-8">
        <h1 class="text-2xl mb-8 font-bold">Flights</h1>
        <p>There are no reviews yet..</p>
        <div
          class="h-12 rounded-2xl bg-blue-light mb-6 animate-pulse-slow"
        ></div>
        <div
          class="h-12 w-10/12 rounded-2xl bg-blue-light mb-6 animate-pulse-fast"
        ></div>
        <div
          class="w-11/12 h-12 rounded-2xl bg-blue-light mb-6 animate-pulse-slow"
        ></div>
        <div
          class="w-9/12 h-12 rounded-2xl bg-blue-light mb-6 animate-pulse-fast"
        ></div>
      </div>
    </div>
  </div>
</template>
