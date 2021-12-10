<script lang="ts">
import { computed, defineComponent, ref, Ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import FlightGrid from '../components/FlightGrid.vue'
import useGraphQL from '../composables/useGraphQL'
import FlightModel from '../interfaces/Flight'

export default defineComponent({
  components: {
    AppHeader,
    FlightGrid,
  },

  setup() {
    const { query } = useGraphQL()

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
          }
        }`,
      )

      var filteredData = <any>[]
      await data.forEach(a => {
        if (new Date(a.departureTime) > new Date()) {
          filteredData.push(a)
        }
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
          flight.departureTime.includes(departureDateInput.value) &&
          flight.arrivalTime.includes(arrivalDateInput.value),
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
        <div class="flex flex-col lg:justify-between lg:flex-row gap-6">
          <div class="flex justify-between w-full">
            <input
              v-model="departureInput"
              type="text"
              id="departure"
              class="
                px-4
                py-3.5
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
              placeholder="Departure"
            />
            <div
              class="
                p-3
                rounded-full
                bg-white
                -ml-3
                -mr-3
                border-blue-light border-2
                z-10
              "
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
              class="
                px-4
                py-3.5
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
              placeholder="Arrival"
            />
          </div>
          <div class="flex justify-between w-full">
            <input
              v-model="departureDateInput"
              type="date"
              id="departureDate"
              :min="new Date(Date.now()).toISOString().split('T')[0]"
              class="
                px-4
                py-3.5
                rounded-xl rounded-tr-none rounded-br-none
                bg-blue-xlight
                border-2 border-blue-light
                -mr-px
                text-neutral
                placeholder-neutral-xlight
                w-full
                hover:border-blue hover:z-10
                focus:outline-none focus:z-20
                focus-visible:ring
              "
              placeholder="Departure Date"
            />
            <input
              v-model="arrivalDateInput"
              type="date"
              id="arrivalDate"
              :min="new Date(Date.now()).toISOString().split('T')[0]"
              class="
                px-4
                py-3.5
                rounded-xl rounded-tl-none rounded-bl-none
                bg-blue-xlight
                border-2 border-blue-light
                text-neutral
                placeholder-neutral-xlight
                w-full
                hover:border-blue hover:z-10
                focus:outline-none focus:z-20
                focus-visible:ring
              "
              placeholder="Arrival Date"
            />
          </div>
        </div>
      </div>
      <div
        v-if="flights && Object.keys(flights).length !== 0"
        class="mx-auto max-w-7xl p-6 sm:p-8"
      >
        <h1 class="text-2xl mb-8 font-bold">Flights</h1>
        <FlightGrid
          v-for="flight of filteredFlights"
          :key="flight.id"
          :data="flight"
        />
      </div>
      <div v-else class="mx-auto max-w-7xl p-6 sm:p-8">
        <h1 class="text-2xl mb-8 font-bold">Flights</h1>
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
