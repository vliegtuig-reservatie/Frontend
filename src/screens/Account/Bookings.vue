<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import AppHeader from '../../components/AppHeader.vue'
import BookingGrid from '../../components/BookingGrid.vue'
import useGraphQL from '../../composables/useGraphQL'
import BookingModel from '../../interfaces/Booking'
import useFirebase from '../../composables/useFirebase'

export default defineComponent({
  components: {
    AppHeader,
    BookingGrid,
  },

  setup() {
    const { query } = useGraphQL()
    const { user } = useFirebase()

    const bookingData: Ref<BookingModel[]> = ref([])

    const getUserBookingData = async () => {
      const data = await query(
        'getUserById',
        `query getUserById ($id: String = "") {
          getUserById (id: $id) {
            bookedSeats {
                row
                column
                flight {
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
            }
          }
        }`,
        { id: user.value?.uid },
      )
      var groupedData = <any>{}
      data.bookedSeats.forEach(function (a: any) {
        groupedData[a.flight.id] = groupedData[a.flight.id] || []
        groupedData[a.flight.id] = {
          id: a.flight.id,
          arrivalTime: a.flight.arrivalTime,
          departureTime: a.flight.departureTime,
          arrivalLocation: {
            name: a.flight.arrivalLocation.name,
            IATACode: a.flight.arrivalLocation.IATACode,
          },
          departureLocation: {
            name: a.flight.arrivalLocation.name,
            IATACode: a.flight.arrivalLocation.IATACode,
          },
          plane: {
            agency: a.flight.plane.agency,
          },
        }
      })

      bookingData.value = groupedData
      for (let bookings of Object.values(groupedData)) {
        console.log(bookings)
      }
    }

    getUserBookingData()

    return {
      bookingData,
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
          <p class="text-neutral-xlight pointer-events-none">My bookings</p>
        </div>
        <h1 class="text-2xl mb-12 font-bold border-b-2 pb-4 border-blue-light">
          My bookings
        </h1>
        <BookingGrid
          v-for="booking of Object.values(bookingData)"
          :key="booking.id"
          :data="booking"
        />
      </div>
    </div>
  </div>
</template>
