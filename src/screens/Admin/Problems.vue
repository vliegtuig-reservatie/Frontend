<script lang="ts">
import { computed, defineComponent, ref, Ref } from 'vue'
import AppHeader from '../../components/AppHeader.vue'
import AdminProblems from '../../components/AdminProblems.vue'
import useFirebase from '../../composables/useFirebase'
import useGraphQL from '../../composables/useGraphQL'
import FlightModel from '../../interfaces/Flight'

export default defineComponent({
  components: {
    AppHeader,
    AdminProblems,
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
      )

      var filteredData = <any>[]
      data.forEach((a: any) => {
        if (
          a.plane.firstclassRowCount * a.plane.firstclassColumncount +
            a.plane.economyRowCount * a.plane.economyColumncount +
            a.plane.businessRowCount * a.plane.businessColumncount ==
          a.bookedSeats.length
        ) {
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

    getFlights()

    return {
      flights,
      departureInput,
      departureDateInput,
      arrivalInput,
      arrivalDateInput,
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
          <RouterLink to="/admin/">Admin</RouterLink>
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
          <p class="text-neutral-xlight pointer-events-none">Problems</p>
        </div>
        <h1 class="text-2xl mb-4 font-bold border-b-2 pb-4 border-blue-light">
          Problems
        </h1>
        <div
          v-if="flights && Object.keys(flights).length !== 0"
          class="mx-auto max-w-7xl p-6 sm:p-8"
        >
          <AdminProblems
            v-for="flight of flights"
            :key="flight.id"
            :data="flight"
          />
        </div>
        <div v-else class="text-center">
          <p>Fortunately, there are no problems at the moment!</p>
        </div>
      </div>
    </div>
  </div>
</template>
