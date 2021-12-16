<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import useFirebase from '../composables/useFirebase'
import useGraphQL from '../composables/useGraphQL'
import Flight from '../interfaces/Flight'

export default defineComponent({
  components: {
    AppHeader,
  },

  setup() {
    const route = useRoute()
    const { push } = useRouter()
    const { query } = useGraphQL()
    const { user } = useFirebase()

    const flightId = ref<string | undefined>(
      route.params.id ? (route.params.id as string) : undefined,
    )

    const passengerCount = ref<string | undefined>(
      route.query.passengers ? (route.query.passengers as string) : undefined,
    )

    const seats = ref<Flight>()
    const generatedSeats = ref<any[]>([])
    const selectedSeat = ref()
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
              bookedSeats {
                row
                column
              }
            }
          }`,
        { id: flightId.value },
      )

      seats.value = data
    }

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

    const onSeatSelected = (r: any, c: any) => {
      if (selectedSeat.value == getSeat(r, c)) {
        selectedSeat.value = null
      } else {
        selectedSeat.value = getSeat(r, c)
      }

      if (selectedSeat.value != null) {
        for (let i = 0; i < generatedSeats.value.length; ++i) {
          if (
            generatedSeats.value[i].position.r ==
              selectedSeat.value.position.r &&
            generatedSeats.value[i].position.c == selectedSeat.value.position.c
          ) {
            if (generatedSeats.value[i].status == 'FREE') {
              if (
                selectedSeats.value.length < parseInt(passengerCount.value!)
              ) {
                generatedSeats.value[i].status = 'SELECTED'
                selectedSeat.value = null
              }
            } else if (generatedSeats.value[i].status == 'SELECTED') {
              generatedSeats.value[i].status = 'FREE'
              selectedSeat.value = null
            } else {
              selectedSeat.value = null
            }
            break
          }
        }
      }
      selectedSeats.value = generatedSeats.value.filter(
        e => e.status == 'SELECTED',
      )
    }

    const classifier = (r: any, c: any) => {
      let seat = getSeat(r, c)
      if (seat != null) {
        if (selectedSeat.value != seat) {
          switch (seat.status) {
            case 'FREE':
              return 'bg-blue-light'
            case 'TAKEN':
              return 'bg-neutral-xlight pointer-events-none border-0'
            case 'SELECTED':
              return 'bg-blue'
          }
        } else {
          return 'bg-blue-light'
        }
      }
    }

    const addBookedSeats = async () => {
      selectedSeats.value = generatedSeats.value.filter(
        e => e.status == 'SELECTED',
      )
      if (selectedSeats.value.length == parseInt(passengerCount.value!)) {
        for (let seat of selectedSeats.value) {
          const response = await query(
            `addBookedSeat`,
            `mutation addBookedSeat($data: SeatQueryInput!, $userId: String!, $flightId: String!) {
              addBookedSeat(data: $data, userId: $userId, flightId: $flightId) {
                id
                column
                row
                passager {
                  id
                }
                flight {
                  id
                }
              }
            }`,
            {
              data: {
                row: seat.position.r,
                column: seat.position.c,
              },
              userId: user.value?.uid,
              flightId: flightId.value,
            },
          )
        }
      }
      push('/account/bookings/' + flightId.value)
    }

    const generateSeats = () => {
      if (seats.value != null) {
        for (let y = 1; y <= seats.value?.plane.rowCount; ++y) {
          for (let x = 1; x <= seats.value?.plane.columncount; ++x) {
            generatedSeats.value.push({
              position: { r: y, c: x },
              status: 'FREE',
            })
          }
        }
        for (let bookedSeat of seats.value.bookedSeats) {
          let seat = getSeat(bookedSeat.row, bookedSeat.column)
          if (seat != null) {
            seat.status = 'TAKEN'
          }
        }
      }
    }

    const data = async () => {
      await getSeatCount()
      generateSeats()
    }

    data()

    return {
      flightId,
      passengerCount,
      seats,
      generatedSeats,
      selectedSeats,
      getSeat,
      onSeatSelected,
      classifier,
      addBookedSeats,
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
          <RouterLink :to="'/booking/' + flightId">Booking</RouterLink>
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
          <p class="text-neutral-xlight pointer-events-none">Seats</p>
        </div>
        <h1 class="text-2xl mb-4 font-bold">
          Choose seats for {{ passengerCount }} passenger(s)
        </h1>
        <table v-if="seats" class="mx-auto w-full max-w-lg whitespace-nowrap">
          <tr v-for="(row, i) in seats.plane.rowCount" :key="i">
            <td
              v-for="(column, i) in seats.plane.columncount"
              :key="i"
              class="px-0 lg:px-1"
            >
              <button
                @click="onSeatSelected(row, column)"
                :class="classifier(row, column)"
                class="
                  w-3/4
                  border-2 border-blue-light
                  rounded-t-3xl rounded-b-lg
                  hover:border-2 hover:border-blue
                "
                style="padding-bottom: 75%"
              ></button>
            </td>
          </tr>
        </table>
        <table
          v-else
          class="mx-auto w-full max-w-lg whitespace-nowrap animate-pulse"
        >
          <tr v-for="(row, i) in 4" :key="i">
            <td v-for="(column, i) in 6" :key="i" class="px-0 lg:px-1">
              <button
                class="
                  w-3/4
                  bg-blue-light
                  border-2 border-blue-light
                  rounded-t-3xl rounded-b-lg
                  pointer-events-none
                "
                style="padding-bottom: 75%"
              ></button>
            </td>
          </tr>
        </table>
        <button
          v-if="selectedSeats.length == passengerCount"
          @click="addBookedSeats()"
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
            w-32
            mx-auto
            mt-12
            items-center
            hover:bg-blue-dark
            transition-all
          "
        >
          FINISH
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
        <button
          v-else
          class="
            bg-neutral-xlight
            text-white
            px-4
            py-3.5
            rounded-xl
            font-bold
            flex
            relative
            w-32
            mx-auto
            mt-12
            items-center
            transition-all
            cursor-not-allowed
          "
        >
          FINISH
          <svg
            class="
              absolute
              right-0
              p-1
              bg-neutral-xlight
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
