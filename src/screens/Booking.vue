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

    const flight = ref<Flight>()

    const getCurrentFlight = async () => {
      const data = await query(
        'getFlightById',
        `query getFlightById ($id: String = "") {
          getFlightById (id: $id) {
            departureTime
            arrivalTime
            departureLocation {
              id
              name
              IATACode
            }
            arrivalLocation {
              id
              name
              IATACode
            }
            plane {
              id
              agency
            }
          }
        }`,
        { id: flightId.value },
      )

      flight.value = data
    }

    getCurrentFlight()

    return {
      flightId,
      flight,
    }
  },
})
</script>

<template>
  <div>
    <AppHeader />
    <p>{{ flight.departureTime }}</p>
    <p>{{ flight.arrivalTime }}</p>
  </div>
</template>
