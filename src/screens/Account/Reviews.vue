<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import AppHeader from '../../components/AppHeader.vue'
import ReviewGrid from '../../components/ReviewGrid.vue'
import useFirebase from '../../composables/useFirebase'
import useGraphQL from '../../composables/useGraphQL'
import Review from '/@/interfaces/Review'

export default defineComponent({
  components: {
    AppHeader,
    ReviewGrid,
  },

  setup() {
    const { query } = useGraphQL()
    const { user } = useFirebase()

    const reviews: Ref<Review[]> = ref([])

    const getUserReviews = async () => {
      const data = await query(
        'getUserById',
        `query getUserById ($id: String = "") {
          getUserById(id: $id) {
            reviews {
              id
              note
              stars
              flight {
                id
                arrivalLocation {
                  IATACode
                }
                departureLocation {
                  IATACode
                }
                arrivalTime
                plane {
                  agency
                }
              }
            }
          }
        }`,
        { id: user.value?.uid },
      )
      reviews.value = data
    }

    getUserReviews()

    return {
      reviews,
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
          <p class="text-neutral-xlight pointer-events-none">My reviews</p>
        </div>
        <h1 class="text-2xl mb-12 font-bold border-b-2 pb-4 border-blue-light">
          My reviews
        </h1>
        <div
          v-if="reviews.reviews && Object.keys(reviews.reviews).length !== 0"
        >
          <ReviewGrid
            v-for="review of reviews.reviews"
            :key="review.id"
            :data="review"
          />
        </div>
        <div class="w-full" v-else>
          <div v-if="reviews" class="text-center">
            You have made no reviews yet.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
