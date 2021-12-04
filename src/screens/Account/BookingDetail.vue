<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '../../components/AppHeader.vue'
import useFirebase from '../../composables/useFirebase'
import useGraphQL from '../../composables/useGraphQL'
import Flight from '../../interfaces/Flight'

export default defineComponent({
  components: {
    AppHeader,
  },

  setup() {
    const route = useRoute()
    const { query } = useGraphQL()
    const { user } = useFirebase()

    const flightId = ref<string | undefined>(
      route.params.id ? (route.params.id as string) : undefined,
    )

    const flight = ref<Flight>()
    const generatedSeats = ref<any[]>([])

    const getFlight = async () => {
      const data = await query(
        'getUserBookedFlightById',
        `query getUserBookedFlightById ($userId: String = "", $flightId: String = "") {
            getUserBookedFlightById (userId: $userId, flightId: $flightId) {
                bookedSeats {
                    column
                    row
                    flight {
                        id
                        plane {
                            rowCount
                            columncount
                        }
                    }
                }
            }
          }`,
        { userId: user.value?.uid, flightId: flightId.value },
      )

      var groupedData = <any>{}
      var seats = <any>[]
      data.bookedSeats.forEach(function (a: any) {
        groupedData[a.flight.id] = groupedData[a.flight.id] || []
        seats.push({ row: a.row, column: a.column })
        groupedData = {
          id: a.flight.id,
          rowCount: a.flight.plane.rowCount,
          columnCount: a.flight.plane.columncount,
          bookedSeats: seats,
        }
      })

      flight.value = groupedData
      console.log(groupedData)
    }

    getFlight()

    const getSeat = (r: any, c: any) => {
      for (let i = 0; i < generatedSeats.value.length; ++i) {
        if (
          generatedSeats.value[i].position.r == r &&
          generatedSeats.value[i].position.c == c
        ) {
          return generatedSeats.value[i]
        }
      }
      return null
    }

    const classifier = (r: any, c: any) => {
      let seat = getSeat(r, c)
      if (seat != null) {
        switch (seat.status) {
          case 'FREE':
            return 'bg-blue-light'
          case 'BOOKED':
            return 'bg-blue'
        }
      }
    }

    onMounted(() => {
      const generateSeats = () => {
        if (flight.value != null) {
          for (let y = 1; y <= flight.value?.rowCount; ++y) {
            for (let x = 1; x <= flight.value?.columnCount; ++x) {
              generatedSeats.value.push({
                position: { r: y, c: x },
                status: 'FREE',
              })
            }
          }
          for (let bookedSeat of flight.value.bookedSeats) {
            let seat = getSeat(bookedSeat.row, bookedSeat.column)
            if (seat != null) {
              seat.status = 'BOOKED'
            }
          }
        }
      }
      generateSeats()
    })

    return {
      flightId,
      flight,
      generatedSeats,
      getSeat,
      classifier,
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
          mb-10
        "
      >
        <div class="flex items-center text-sm -mt-4">
          <RouterLink to="/account/bookings">My bookings</RouterLink>
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
          <p class="text-neutral-xlight pointer-events-none">Details</p>
        </div>
        <h1 class="text-2xl mb-4 font-bold">Booking details</h1>
        <div class="w-full gap-20 flex justify-between">
          <div class="w-full border-t-2 border-blue-light max-w-lg">
            <h2 class="text-lg font-bold py-4">Add a review</h2>
          </div>
          <div>
            <h2 class="text-lg font-bold py-4 text-center">Your seats</h2>
            <table>
              <tr v-for="(row, i) in flight.rowCount" :key="i">
                <td
                  v-for="(column, i) in flight.columnCount"
                  :key="i"
                  class="px-1"
                >
                  <button
                    :class="classifier(row, column)"
                    class="w-8 h-8 rounded-t-3xl rounded-b-lg"
                  ></button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
