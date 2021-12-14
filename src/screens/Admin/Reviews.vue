<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '../../components/AppHeader.vue'
import AdminReviewGrid from '../../components/AdminReviewGrid.vue'
import useGraphQL from '../../composables/useGraphQL'
import Flight from '../../interfaces/Flight'

export default defineComponent({
  components: {
    AppHeader,
    AdminReviewGrid,
  },

  setup() {
    const { query } = useGraphQL()
    const route = useRoute()

    const flightId = ref<string | undefined>(
      route.params.id ? (route.params.id as string) : undefined,
    )

    const reviews = ref<Flight>()

    const getFlightReviews = async () => {
      const data = await query(
        'getFlightById',
        `query getFlightById ($id: String = "") {
          getFlightById(id: $id) {
            reviews {
                user {
                    firstName
                }
                note
                stars
                createdAt
            }
          }
        }`,
        { id: flightId.value },
      )
      if (data.reviews.length > 1) {
        const sum = data.reviews.reduce((a: any, b: any) => a.stars + b.stars)
        data.avgStars = Math.floor(sum / data.reviews.length)
      } else {
        data.avgStars = Math.floor(data.reviews[0].stars)
      }

      console.log(data)

      reviews.value = data
    }

    getFlightReviews()

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
          <p class="text-neutral-xlight pointer-events-none">Reviews</p>
        </div>
        <h1 class="text-2xl mb-12 font-bold border-b-2 pb-4 border-blue-light">
          Reviews
        </h1>
        <div v-if="reviews">
          <p>{{ reviews.avgStars }}</p>
          <AdminReviewGrid
            v-for="review of reviews.reviews"
            :key="review.id"
            :data="review"
          />
        </div>
      </div>
    </div>
  </div>
</template>
