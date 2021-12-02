<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import FlightGrid from '../components/FlightGrid.vue'
import useGraphQL from '../composables/useGraphQL'
import FlightModel from '../interfaces/Flight'

export default defineComponent({
  components: {
    AppHeader,
    FlightGrid,
  },

  setup() {
    const { query } = useGraphQL()

    const flights: Ref<FlightModel[]> = ref([])

    const getFlights = async () => {
      const data = await query(
        'getFlights',
        `query getFlights {
          getFlights {
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
        }`,
      )

      flights.value = data
    }

    getFlights()

    return {
      flights,
    }
  },
})
</script>

<template>
  <div>
    <AppHeader :login="true" />
    <div class="flex h-[calc(100vh-30vh)]">
      <div class="m-auto text-center">
        <h1 class="text-5xl font-bold mb-2">Oops!</h1>
        <h2 class="text-xl">That page does not exist.</h2>
      </div>
    </div>
  </div>
</template>
