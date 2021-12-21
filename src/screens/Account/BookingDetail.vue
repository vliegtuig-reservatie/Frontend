<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '../../components/AppHeader.vue'
import useFirebase from '../../composables/useFirebase'
import useGraphQL from '../../composables/useGraphQL'
import Flight from '../../interfaces/Flight'
import Review from '../../interfaces/Review'

export default defineComponent({
  components: {
    AppHeader,
  },

  setup() {
    const route = useRoute()
    const { query } = useGraphQL()
    const { user } = useFirebase()
    const { push } = useRouter()

    const flightId = ref<string | undefined>(
      route.params.id ? (route.params.id as string) : undefined,
    )

    const flight = ref<Flight>()
    const review = ref<Review>()
    const generatedSeatsFirst = ref<any[]>([])
    const generatedSeatsBusiness = ref<any[]>([])
    const generatedSeatsEconomy = ref<any[]>([])
    const rating = ref<number>(0)
    const hoverStars = ref<boolean>(false)
    const reviewInput = ref<string>('')

    const getFlight = async () => {
      const data = await query(
        'getUserBookedFlightById',
        `query getUserBookedFlightById ($userId: String = "", $flightId: String = "") {
            getUserBookedFlightById (userId: $userId, flightId: $flightId) {
                bookedSeats {
                    column
                    row
                    class
                    flight {
                        id
                        plane {
                            businessRowCount
                            businessColumncount
                            firstclassRowCount
                            firstclassColumncount
                            economyRowCount
                            economyColumncount
                        }
                    }
                }
            }
          }`,
        { userId: user.value?.uid, flightId: flightId.value },
      )

      var groupedData = <any>{}
      var seats = <any>[]
      await data.bookedSeats.forEach(function (a: any) {
        groupedData[a.flight.id] = groupedData[a.flight.id] || []
        seats.push({ row: a.row, column: a.column, class: a.class })
        groupedData = {
          id: a.flight.id,
          rowCount: a.flight.plane.rowCount,
          columnCount: a.flight.plane.columncount,
          businessRowCount: a.flight.plane.businessRowCount,
          businessColumncount: a.flight.plane.businessColumncount,
          firstclassRowCount: a.flight.plane.firstclassRowCount,
          firstclassColumncount: a.flight.plane.firstclassColumncount,
          economyRowCount: a.flight.plane.economyRowCount,
          economyColumncount: a.flight.plane.economyColumncount,
          bookedSeats: seats,
        }
      })

      flight.value = groupedData
    }

    const getReview = async () => {
      const data = await query(
        'getUserReviewByFlightId',
        `query getUserReviewByFlightId ($userId: String = "", $flightId: String = "") {
            getUserReviewByFlightId (userId: $userId, flightId: $flightId) {
              id
              stars
              note
            }
          }`,
        { userId: user.value?.uid, flightId: flightId.value },
      )
      review.value = data

      if (review.value !== undefined && review !== null) {
        reviewInput.value = review.value?.note
        rating.value = review.value?.stars
      }
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

    const classifierFirst = (r: any, c: any) => {
      let seat = getSeatFirst(r, c)
      if (seat != null) {
        switch (seat.status) {
          case 'FREE':
            return 'bg-blue-light'
          case 'BOOKED':
            return 'bg-blue'
        }
      }
    }

    const classifierBusiness = (r: any, c: any) => {
      let seat = getSeatBusiness(r, c)
      if (seat != null) {
        switch (seat.status) {
          case 'FREE':
            return 'bg-blue-light'
          case 'BOOKED':
            return 'bg-blue'
        }
      }
    }

    const classifierEconomy = (r: any, c: any) => {
      let seat = getSeatEconomy(r, c)
      if (seat != null) {
        switch (seat.status) {
          case 'FREE':
            return 'bg-blue-light'
          case 'BOOKED':
            return 'bg-blue'
        }
      }
    }

    const generateSeats = () => {
      if (flight.value != undefined) {
        for (let y = 1; y <= flight.value?.firstclassRowCount; ++y) {
          for (let x = 1; x <= flight.value?.firstclassColumncount; ++x) {
            generatedSeatsFirst.value.push({
              position: { r: y, c: x },
              status: 'FREE',
              class: 'F',
            })
          }
        }
        for (let y = 1; y <= flight.value?.businessRowCount; ++y) {
          for (let x = 1; x <= flight.value?.businessColumncount; ++x) {
            generatedSeatsBusiness.value.push({
              position: { r: y, c: x },
              status: 'FREE',
              class: 'B',
            })
          }
        }
        for (let y = 1; y <= flight.value?.economyRowCount; ++y) {
          for (let x = 1; x <= flight.value?.economyColumncount; ++x) {
            generatedSeatsEconomy.value.push({
              position: { r: y, c: x },
              status: 'FREE',
              class: 'E',
            })
          }
        }
        for (let bookedSeat of flight.value.bookedSeats) {
          let seat = getSeatFirst(bookedSeat.row, bookedSeat.column)
          let seatBusiness = getSeatBusiness(bookedSeat.row, bookedSeat.column)
          let seatEconomy = getSeatEconomy(bookedSeat.row, bookedSeat.column)
          if (seat != null && seat.class == bookedSeat.class) {
            seat.status = 'BOOKED'
          }
          if (seatBusiness != null && seatBusiness.class == bookedSeat.class) {
            seatBusiness.status = 'BOOKED'
          }
          if (seatEconomy != null && seatEconomy.class == bookedSeat.class) {
            seatEconomy.status = 'BOOKED'
          }
        }
      }
    }

    const createReview = async () => {
      const response = await query(
        `createReview`,
        `mutation createReview($data: ReviewInput!, $userId: String!, $flightId: String!) {
          createReview(data: $data, userId: $userId, flightId: $flightId) {
            id
          }
        }`,
        {
          data: {
            stars: rating.value,
            note: reviewInput.value,
          },
          userId: user.value?.uid,
          flightId: flightId.value,
        },
      )
      getReview()
    }

    const updateReview = async () => {
      const response = await query(
        `updateReview`,
        `mutation updateReview($data: ReviewInput!, $id: String!) {
          updateReview(data: $data, id: $id) {
            id
          }
        }`,
        {
          data: {
            stars: rating.value,
            note: reviewInput.value,
          },
          id: review.value?.id,
        },
      )
      getReview()
    }

    const deleteReview = async () => {
      if (confirm('Are you sure you want to delete your review?')) {
        const response = await query(
          `deleteReview`,
          `mutation deleteReview($id: String!) {
            deleteReview(id: $id) {
              id
            }
          }`,
          {
            id: review.value?.id,
          },
        )
        getReview()
        rating.value = 0
        hoverStars.value = false
        reviewInput.value = ''
      }
    }

    const data = async () => {
      await getFlight()
      getReview()
      generateSeats()
    }

    data()

    return {
      flightId,
      flight,
      review,
      generatedSeatsFirst,
      generatedSeatsBusiness,
      generatedSeatsEconomy,
      rating,
      hoverStars,
      reviewInput,
      getSeatFirst,
      getSeatBusiness,
      getSeatEconomy,
      classifierFirst,
      classifierBusiness,
      classifierEconomy,
      createReview,
      updateReview,
      deleteReview,
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
        <div class="w-full gap-20 flex flex-col md:flex-row md:justify-between">
          <div class="w-full border-t-2 border-blue-light md:max-w-lg">
            <div class="flex justify-between">
              <h2 class="text-lg font-bold py-4">
                {{ review !== null ? 'Update your review' : 'Write a review' }}
              </h2>
              <button
                v-if="review && review !== null"
                @click="deleteReview()"
                class="float-right text-blue"
              >
                Delete review
              </button>
            </div>
            <textarea
              v-model="reviewInput"
              type="text"
              id="reviewDescription"
              maxlength="255"
              class="px-4 py-3.5 mb-4 h-32 rounded-xl bg-blue-xlight border-2 border-blue-light text-neutral placeholder-neutral-xlight w-full hover:border-blue focus:outline-none focus-visible:ring transition-colors"
              placeholder="Write something about this flight.."
            />

            <div class="flex">
              <button
                type="button"
                v-for="i in 5"
                :class="{ 'pr-1': i < 5 }"
                @click="rating = i"
                :key="i"
                @mouseover="hoverStars = i"
                @mouseleave="hoverStars = false"
              >
                <svg
                  class="block h-8 w-8 transition-colors"
                  :class="[
                    hoverStars
                      ? hoverStars >= i
                        ? 'text-blue'
                        : 'text-blue-xlight stroke-1 stroke-blue'
                      : rating >= i
                      ? 'text-blue'
                      : 'text-blue-xlight stroke-1 stroke-blue',
                  ]"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                  />
                </svg>
              </button>
            </div>
            <button
              v-if="
                rating > 0 &&
                reviewInput !== '' &&
                reviewInput !== undefined &&
                ((review !== null && review.note !== reviewInput) ||
                  (review !== null && review.stars !== rating) ||
                  review === null)
              "
              @click="review !== null ? updateReview() : createReview()"
              class="bg-blue text-white px-4 py-3.5 rounded-xl font-bold focus:outline-none focus-visible:ring flex relative w-32 mx-auto mt-12 items-center hover:bg-blue-dark transition-all"
            >
              {{ review !== null ? 'UPDATE' : 'SUBMIT' }}
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
              {{ review !== null ? 'UPDATE' : 'SUBMIT' }}
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
          <div v-if="flight">
            <h2 class="text-lg font-bold py-4 text-center">Your seats</h2>
            <h1
              class="w-full max-w-md mx-auto text-center mb-4 border-t-2 border-blue-light"
            >
              First Class
            </h1>
            <table v-if="flight" class="mx-auto">
              <tr v-for="(row, i) in flight.firstclassRowCount" :key="i">
                <td
                  v-for="(column, i) in flight.firstclassColumncount"
                  :key="i"
                  class="px-1"
                >
                  <button
                    :class="classifierFirst(row, column)"
                    class="w-8 h-8 rounded-t-3xl rounded-b-lg pointer-events-none"
                  ></button>
                </td>
              </tr>
            </table>
            <h1
              class="w-full max-w-md mx-auto text-center mb-4 mt-8 border-t-2 border-blue-light"
            >
              Business
            </h1>
            <table v-if="flight" class="mx-auto">
              <tr v-for="(row, i) in flight.businessRowCount" :key="i">
                <td
                  v-for="(column, i) in flight.businessColumncount"
                  :key="i"
                  class="px-1"
                >
                  <button
                    :class="classifierBusiness(row, column)"
                    class="w-8 h-8 rounded-t-3xl rounded-b-lg pointer-events-none"
                  ></button>
                </td>
              </tr>
            </table>
            <h1
              class="w-full max-w-md mx-auto text-center mb-4 mt-8 border-t-2 border-blue-light"
            >
              Economy
            </h1>
            <table v-if="flight" class="mx-auto">
              <tr v-for="(row, i) in flight.economyRowCount" :key="i">
                <td
                  v-for="(column, i) in flight.economyColumncount"
                  :key="i"
                  class="px-1"
                >
                  <button
                    :class="classifierEconomy(row, column)"
                    class="w-8 h-8 rounded-t-3xl rounded-b-lg pointer-events-none"
                  ></button>
                </td>
              </tr>
            </table>
          </div>
          <div v-else>
            <h2 class="text-lg font-bold py-4 text-center">Your seats</h2>
            <table class="mx-auto animate-pulse">
              <tr v-for="(row, i) in 7" :key="i">
                <td v-for="(column, i) in 5" :key="i" class="px-1">
                  <button
                    class="w-8 h-8 bg-blue-light rounded-t-3xl rounded-b-lg pointer-events-none"
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
