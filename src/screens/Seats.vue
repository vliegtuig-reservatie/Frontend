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

    const passengerCount = ref<string | undefined>(
      route.query.passengers ? (route.query.passengers as string) : undefined,
    )

    const seats = ref<Flight>()
    const selectedSeats = ref<any[]>([])

    const getSeatCount = async () => {
      const data = await query(
        'getFlightById',
        `query getFlightById ($id: String = "") {
          getFlightById (id: $id) {
            plane {
              id
              rowCount
              columncount
            }
          }
        }`,
        { id: flightId.value },
      )

      seats.value = data
    }

    getSeatCount()

    const selectSeat = (row: number, column: number, e: any) => {
      if (selectedSeats.value.some(e => e.row === row && e.column === column)) {
        const index = selectedSeats.value.findIndex(
          e => e.row === row && e.column === column,
        )
        if (index > -1) {
          selectedSeats.value.splice(index, 1)
        }
        e.target.classList.toggle('bg-blue-light')
        e.target.classList.toggle('bg-blue')
      } else if (selectedSeats.value.length < parseInt(passengerCount.value!)) {
        selectedSeats.value.push({ row: row, column: column })
        e.target.classList.toggle('bg-blue-light')
        e.target.classList.toggle('bg-blue')
      }
    }

    return {
      flightId,
      passengerCount,
      seats,
      selectSeat,
      selectedSeats,
    }
  },
})
</script>

<template>
  <div v-if="seats">
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
          mb-10
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
          <p class="text-neutral-xlight pointer-events-none">Booking</p>
        </div>
        <h1 class="text-2xl mb-4 font-bold">
          Choose seats for {{ passengerCount }} passengers
        </h1>
        <table class="mx-auto">
          <tr v-for="(row, i) in seats.plane.rowCount" :key="i">
            <td
              v-for="(column, i) in seats.plane.columncount"
              :key="i"
              class="px-2"
            >
              <button
                @click="e => selectSeat(row, column, e)"
                class="
                  w-16
                  h-16
                  border-2 border-blue-light
                  rounded-t-3xl rounded-b-lg
                  bg-blue-light
                  hover:border-2 hover:border-blue
                "
              ></button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
