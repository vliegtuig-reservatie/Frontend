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
    const generatedSeatsFirst = ref<any[]>([])
    const generatedSeatsBusiness = ref<any[]>([])
    const generatedSeatsEconomy = ref<any[]>([])
    const selectedSeat = ref()
    const selectedSeatsFirst = ref<any[]>([])
    const selectedSeatsBusiness = ref<any[]>([])
    const selectedSeatsEconomy = ref<any[]>([])

    const getSeatCount = async () => {
      const data = await query(
        'getFlightById',
        `query getFlightById ($id: String = "") {
            getFlightById (id: $id) {
              plane {
                id
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
                row
                column
                class
              }
            }
          }`,
        { id: flightId.value },
      )

      seats.value = data
    }

    const getSeatFirst = (r: any, c: any) => {
      for (let i = 0; i < generatedSeatsFirst.value.length; ++i) {
        if (
          generatedSeatsFirst.value[i].position.r == r &&
          generatedSeatsFirst.value[i].position.c == c
        ) {
          return generatedSeatsFirst.value[i]
        }
      }
      return null
    }

    const getSeatBusiness = (r: any, c: any) => {
      for (let i = 0; i < generatedSeatsBusiness.value.length; ++i) {
        if (
          generatedSeatsBusiness.value[i].position.r == r &&
          generatedSeatsBusiness.value[i].position.c == c
        ) {
          return generatedSeatsBusiness.value[i]
        }
      }
      return null
    }

    const getSeatEconomy = (r: any, c: any) => {
      for (let i = 0; i < generatedSeatsEconomy.value.length; ++i) {
        if (
          generatedSeatsEconomy.value[i].position.r == r &&
          generatedSeatsEconomy.value[i].position.c == c
        ) {
          return generatedSeatsEconomy.value[i]
        }
      }
      return null
    }

    const onSeatSelectedFirst = (r: any, c: any) => {
      if (selectedSeat.value == getSeatFirst(r, c)) {
        selectedSeat.value = null
      } else {
        selectedSeat.value = getSeatFirst(r, c)
      }

      if (selectedSeat.value != null) {
        for (let i = 0; i < generatedSeatsFirst.value.length; ++i) {
          if (
            generatedSeatsFirst.value[i].position.r ==
              selectedSeat.value.position.r &&
            generatedSeatsFirst.value[i].position.c ==
              selectedSeat.value.position.c
          ) {
            if (generatedSeatsFirst.value[i].status == 'FREE') {
              if (
                selectedSeatsFirst.value.length +
                  selectedSeatsBusiness.value.length +
                  selectedSeatsEconomy.value.length <
                parseInt(passengerCount.value!)
              ) {
                generatedSeatsFirst.value[i].status = 'SELECTED'
                selectedSeat.value = null
              }
            } else if (generatedSeatsFirst.value[i].status == 'SELECTED') {
              generatedSeatsFirst.value[i].status = 'FREE'
              selectedSeat.value = null
            } else {
              selectedSeat.value = null
            }
            break
          }
        }
      }
      selectedSeatsFirst.value = generatedSeatsFirst.value.filter(
        e => e.status == 'SELECTED',
      )
    }

    const onSeatSelectedBusiness = (r: any, c: any) => {
      if (selectedSeat.value == getSeatBusiness(r, c)) {
        selectedSeat.value = null
      } else {
        selectedSeat.value = getSeatBusiness(r, c)
      }

      if (selectedSeat.value != null) {
        for (let i = 0; i < generatedSeatsBusiness.value.length; ++i) {
          if (
            generatedSeatsBusiness.value[i].position.r ==
              selectedSeat.value.position.r &&
            generatedSeatsBusiness.value[i].position.c ==
              selectedSeat.value.position.c
          ) {
            if (generatedSeatsBusiness.value[i].status == 'FREE') {
              if (
                selectedSeatsFirst.value.length +
                  selectedSeatsBusiness.value.length +
                  selectedSeatsEconomy.value.length <
                parseInt(passengerCount.value!)
              ) {
                generatedSeatsBusiness.value[i].status = 'SELECTED'
                selectedSeat.value = null
              }
            } else if (generatedSeatsBusiness.value[i].status == 'SELECTED') {
              generatedSeatsBusiness.value[i].status = 'FREE'
              selectedSeat.value = null
            } else {
              selectedSeat.value = null
            }
            break
          }
        }
      }
      selectedSeatsBusiness.value = generatedSeatsBusiness.value.filter(
        e => e.status == 'SELECTED',
      )
    }

    const onSeatSelectedEconomy = (r: any, c: any) => {
      if (selectedSeat.value == getSeatEconomy(r, c)) {
        selectedSeat.value = null
      } else {
        selectedSeat.value = getSeatEconomy(r, c)
      }

      if (selectedSeat.value != null) {
        for (let i = 0; i < generatedSeatsEconomy.value.length; ++i) {
          if (
            generatedSeatsEconomy.value[i].position.r ==
              selectedSeat.value.position.r &&
            generatedSeatsEconomy.value[i].position.c ==
              selectedSeat.value.position.c
          ) {
            if (generatedSeatsEconomy.value[i].status == 'FREE') {
              if (
                selectedSeatsFirst.value.length +
                  selectedSeatsBusiness.value.length +
                  selectedSeatsEconomy.value.length <
                parseInt(passengerCount.value!)
              ) {
                generatedSeatsEconomy.value[i].status = 'SELECTED'
                selectedSeat.value = null
              }
            } else if (generatedSeatsEconomy.value[i].status == 'SELECTED') {
              generatedSeatsEconomy.value[i].status = 'FREE'
              selectedSeat.value = null
            } else {
              selectedSeat.value = null
            }
            break
          }
        }
      }
      selectedSeatsEconomy.value = generatedSeatsEconomy.value.filter(
        e => e.status == 'SELECTED',
      )
    }

    const classifierFirst = (r: any, c: any) => {
      let seat = getSeatFirst(r, c)
      if (seat != null) {
        if (selectedSeat.value != seat) {
          switch (seat.status) {
            case 'FREE':
              return 'bg-blue-light'
            case 'TAKEN':
              return 'bg-neutral-xlight pointer-events-none border-transparent'
            case 'SELECTED':
              return 'bg-blue'
          }
        } else {
          return 'bg-blue-light'
        }
      }
    }

    const classifierBusiness = (r: any, c: any) => {
      let seat = getSeatBusiness(r, c)
      if (seat != null) {
        if (selectedSeat.value != seat) {
          switch (seat.status) {
            case 'FREE':
              return 'bg-blue-light'
            case 'TAKEN':
              return 'bg-neutral-xlight pointer-events-none border-transparent'
            case 'SELECTED':
              return 'bg-blue'
          }
        } else {
          return 'bg-blue-light'
        }
      }
    }

    const classifierEconomy = (r: any, c: any) => {
      let seat = getSeatEconomy(r, c)
      if (seat != null) {
        if (selectedSeat.value != seat) {
          switch (seat.status) {
            case 'FREE':
              return 'bg-blue-light'
            case 'TAKEN':
              return 'bg-neutral-xlight pointer-events-none border-transparent'
            case 'SELECTED':
              return 'bg-blue'
          }
        } else {
          return 'bg-blue-light'
        }
      }
    }

    const addBookedSeats = async () => {
      var selectedSeats = []
      if (selectedSeatsFirst.value.length > 0) {
        selectedSeats.push(selectedSeatsFirst)
      }
      if (selectedSeatsBusiness.value.length > 0) {
        selectedSeats.push(selectedSeatsBusiness)
      }
      if (selectedSeatsEconomy.value.length > 0) {
        selectedSeats.push(selectedSeatsEconomy)
      }

      console.log(selectedSeats)
      for (let seats of selectedSeats) {
        for (let seat of seats.value) {
          const response = await query(
            `addBookedSeat`,
            `mutation addBookedSeat($data: SeatQueryInput!, $userId: String!, $flightId: String!) {
                addBookedSeat(data: $data, userId: $userId, flightId: $flightId) {
                  id
                  column
                  row
                  class
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
                class: seat.class,
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
        for (let y = 1; y <= seats.value?.plane.firstclassRowCount; ++y) {
          for (let x = 1; x <= seats.value?.plane.firstclassColumncount; ++x) {
            generatedSeatsFirst.value.push({
              position: { r: y, c: x },
              status: 'FREE',
              class: 'F',
            })
          }
        }
        for (let y = 1; y <= seats.value?.plane.businessRowCount; ++y) {
          for (let x = 1; x <= seats.value?.plane.businessColumncount; ++x) {
            generatedSeatsBusiness.value.push({
              position: { r: y, c: x },
              status: 'FREE',
              class: 'B',
            })
          }
        }
        for (let y = 1; y <= seats.value?.plane.economyRowCount; ++y) {
          for (let x = 1; x <= seats.value?.plane.economyColumncount; ++x) {
            generatedSeatsEconomy.value.push({
              position: { r: y, c: x },
              status: 'FREE',
              class: 'E',
            })
          }
        }
        for (let bookedSeat of seats.value.bookedSeats) {
          let seat = getSeatFirst(bookedSeat.row, bookedSeat.column)
          let seatBusiness = getSeatBusiness(bookedSeat.row, bookedSeat.column)
          let seatEconomy = getSeatEconomy(bookedSeat.row, bookedSeat.column)
          console.log(bookedSeat.class)
          if (seat != null && seat.class == bookedSeat.class) {
            seat.status = 'TAKEN'
          }
          if (seatBusiness != null && seatBusiness.class == bookedSeat.class) {
            seatBusiness.status = 'TAKEN'
          }
          if (seatEconomy != null && seatEconomy.class == bookedSeat.class) {
            seatEconomy.status = 'TAKEN'
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
      generatedSeatsFirst,
      generatedSeatsBusiness,
      generatedSeatsEconomy,
      selectedSeatsFirst,
      selectedSeatsBusiness,
      selectedSeatsEconomy,
      getSeatFirst,
      getSeatBusiness,
      getSeatEconomy,
      onSeatSelectedFirst,
      onSeatSelectedBusiness,
      onSeatSelectedEconomy,
      classifierFirst,
      classifierBusiness,
      classifierEconomy,
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
        class="relative mx-auto max-w-7xl p-6 sm:p-8 -mt-20 rounded-3xl bg-white shadow z-10 mb-10"
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
        <h1 class="text-2xl mb-4 font-bold border-b-2 border-blue-light pb-4">
          Choose seats for {{ passengerCount }} passenger(s)
        </h1>
        <h1 class="w-full max-w-md mx-auto text-center mb-4 mt-8">
          First Class
        </h1>
        <table v-if="seats" class="mx-auto w-full max-w-lg whitespace-nowrap">
          <tr v-for="(row, i) in seats.plane.firstclassRowCount" :key="i">
            <td
              v-for="(column, i) in seats.plane.firstclassColumncount"
              :key="i"
              class="px-0 lg:px-1 text-center"
            >
              <button
                @click="onSeatSelectedFirst(row, column)"
                :class="classifierFirst(row, column)"
                class="w-3/4 border-2 border-blue-light rounded-t-3xl rounded-b-lg hover:border-blue"
                style="padding-bottom: 75%"
              ></button>
            </td>
          </tr>
        </table>
        <h1
          class="w-full max-w-md mx-auto text-center mb-4 mt-8 border-t-2 border-blue-light"
        >
          Business
        </h1>
        <table v-if="seats" class="mx-auto w-full max-w-lg whitespace-nowrap">
          <tr v-for="(row, i) in seats.plane.businessRowCount" :key="i">
            <td
              v-for="(column, i) in seats.plane.businessColumncount"
              :key="i"
              class="px-0 lg:px-1 text-center"
            >
              <button
                @click="onSeatSelectedBusiness(row, column)"
                :class="classifierBusiness(row, column)"
                class="w-3/4 border-2 border-blue-light rounded-t-3xl rounded-b-lg hover:border-blue"
                style="padding-bottom: 75%"
              ></button>
            </td>
          </tr>
        </table>
        <h1
          class="w-full max-w-md mx-auto text-center mb-4 mt-8 border-t-2 border-blue-light"
        >
          Economy
        </h1>
        <table v-if="seats" class="mx-auto w-full max-w-lg whitespace-nowrap">
          <tr v-for="(row, i) in seats.plane.economyRowCount" :key="i">
            <td
              v-for="(column, i) in seats.plane.economyColumncount"
              :key="i"
              class="px-0 lg:px-1 text-center"
            >
              <button
                @click="onSeatSelectedEconomy(row, column)"
                :class="classifierEconomy(row, column)"
                class="w-3/4 border-2 border-blue-light rounded-t-3xl rounded-b-lg hover:border-blue"
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
                class="w-3/4 bg-blue-light border-2 border-blue-light rounded-t-3xl rounded-b-lg pointer-events-none"
                style="padding-bottom: 75%"
              ></button>
            </td>
          </tr>
        </table>
        <button
          v-if="
            selectedSeatsFirst.length +
              selectedSeatsBusiness.length +
              selectedSeatsEconomy.length ==
            passengerCount
          "
          @click="addBookedSeats()"
          class="bg-blue text-white px-4 py-3.5 rounded-xl font-bold focus:outline-none focus-visible:ring flex relative w-32 mx-auto mt-12 items-center hover:bg-blue-dark transition-all"
        >
          FINISH
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
        </button>
        <button
          v-else
          class="bg-neutral-xlight text-white px-4 py-3.5 rounded-xl font-bold flex relative w-32 mx-auto mt-12 items-center transition-all cursor-not-allowed"
        >
          FINISH
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
    </div>
  </div>
</template>
