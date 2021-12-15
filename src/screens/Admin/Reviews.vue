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
                    lastName
                }
                note
                stars
                updatedAt
            }
          }
        }`,
        { id: flightId.value },
      )
      if (data.reviews.length > 1) {
        const sum = data.reviews.reduce((a: any, b: any) => a.stars + b.stars)
        data.avgStars = Math.round((sum / data.reviews.length) * 10) / 10
      } else {
        data.avgStars = Math.round(data.reviews[0].stars * 10) / 10
      }

      var reviewCount = data.reviews.length
      var fiveStarCount = 0
      var fourStarCount = 0
      var threeStarCount = 0
      var twoStarCount = 0
      var oneStarCount = 0

      for (let review of data.reviews) {
        switch (review.stars) {
          case 5:
            fiveStarCount++
            break
          case 4:
            fourStarCount++
            break
          case 3:
            threeStarCount++
            break
          case 2:
            twoStarCount++
            break
          case 1:
            oneStarCount++
            break
        }
      }
      data.fiveStarPercentage = (fiveStarCount / reviewCount) * 100
      data.fourStarPercentage = (fourStarCount / reviewCount) * 100
      data.threeStarPercentage = (threeStarCount / reviewCount) * 100
      data.twoStarPercentage = (twoStarCount / reviewCount) * 100
      data.oneStarPercentage = (oneStarCount / reviewCount) * 100

      console.log(fourStarCount)

      data.reviews.sort((a: any, b: any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      })

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
          <div class="max-w-md mx-auto">
            <div class="flex justify-between items-center">
              <p class="text-3xl font-bold">
                {{ reviews.avgStars }}
                <span class="text-lg text-neutral-xlight">out of 5</span>
              </p>
              <div>
                <p class="text-neutral-xlight font-bold">
                  {{ reviews.reviews.length }}
                  {{ reviews.reviews.length > 1 ? 'ratings' : 'rating' }}
                </p>
              </div>
            </div>
            <div>
              <div class="flex items-center">
                <p>5</p>
                <svg
                  class="block h-8 w-8 pl-1 pr-2 transition-colors text-blue"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                  />
                </svg>
                <div class="w-full bg-blue-light h-3">
                  <div
                    class="bg-blue h-3"
                    :style="'width:' + reviews.fiveStarPercentage + '%'"
                  />
                </div>
                <p class="w-16 text-right">{{ reviews.fiveStarPercentage }}%</p>
              </div>
              <div class="flex items-center">
                <p>4</p>
                <svg
                  class="block h-8 w-8 pl-1 pr-2 transition-colors text-blue"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                  />
                </svg>
                <div class="w-full bg-blue-light h-3">
                  <div
                    class="bg-blue h-3"
                    :style="'width:' + reviews.fourStarPercentage + '%'"
                  />
                </div>
                <p class="w-16 text-right">{{ reviews.fourStarPercentage }}%</p>
              </div>
              <div class="flex items-center">
                <p>3</p>
                <svg
                  class="block h-8 w-8 pl-1 pr-2 transition-colors text-blue"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                  />
                </svg>
                <div class="w-full bg-blue-light h-3">
                  <div
                    class="bg-blue h-3"
                    :style="'width:' + reviews.threeStarPercentage + '%'"
                  />
                </div>
                <p class="w-16 text-right">
                  {{ reviews.threeStarPercentage }}%
                </p>
              </div>
              <div class="flex items-center">
                <p>2</p>
                <svg
                  class="block h-8 w-8 pl-1 pr-2 transition-colors text-blue"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                  />
                </svg>
                <div class="w-full bg-blue-light h-3">
                  <div
                    class="bg-blue h-3"
                    :style="'width:' + reviews.twoStarPercentage + '%'"
                  />
                </div>
                <p class="w-16 text-right">{{ reviews.twoStarPercentage }}%</p>
              </div>
              <div class="flex items-center">
                <p>1</p>
                <svg
                  class="block h-8 w-8 pl-1 pr-2 transition-colors text-blue"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                  />
                </svg>
                <div class="w-full bg-blue-light h-3">
                  <div
                    class="bg-blue h-3"
                    :style="'width:' + reviews.oneStarPercentage + '%'"
                  />
                </div>
                <p class="w-16 text-right">{{ reviews.oneStarPercentage }}%</p>
              </div>
            </div>
          </div>
          <div v-if="reviews">
            <AdminReviewGrid
              v-for="review of reviews.reviews"
              :key="review.id"
              :data="review"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
