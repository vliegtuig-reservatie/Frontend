<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from '../components/AppHeader.vue'

export default defineComponent({
  components: {
    AppHeader,
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
        <div class="flex justify-between gap-6">
          <div class="flex justify-between w-full">
            <input
              type="text"
              id="departure"
              class="
                px-4
                py-3.5
                rounded-xl
                bg-blue-xlight
                border-2 border-blue-light
                text-neutral
                placeholder-neutral-xlight
                w-full
                hover:border-blue
                focus:outline-none
                focus-visible:ring
              "
              placeholder="Departure"
            />
            <div
              class="
                p-3
                rounded-full
                bg-white
                -ml-3
                -mr-3
                border-blue-light border-2
                z-10
              "
            >
              <svg
                class="w-8"
                xmlns="http://www.w3.org/2000/svg"
                enable-background="new 0 0 24 24"
                viewBox="0 0 24 24"
                fill="#000000"
              >
                <g><rect fill="none" height="24" width="24" x="0" /></g>
                <g>
                  <g>
                    <polygon
                      points="7.41,13.41 6,12 2,16 6,20 7.41,18.59 5.83,17 21,17 21,15 5.83,15"
                    />
                    <polygon
                      points="16.59,10.59 18,12 22,8 18,4 16.59,5.41 18.17,7 3,7 3,9 18.17,9"
                    />
                  </g>
                </g>
              </svg>
            </div>

            <input
              type="text"
              id="arrival"
              class="
                px-4
                py-3.5
                rounded-xl
                bg-blue-xlight
                border-2 border-blue-light
                text-neutral
                placeholder-neutral-xlight
                w-full
                hover:border-blue
                focus:outline-none
                focus-visible:ring
              "
              placeholder="Arrival"
            />
          </div>
          <div class="flex justify-between w-full">
            <input
              type="date"
              id="departureDate"
              :min="new Date(Date.now()).toISOString().split('T')[0]"
              class="
                px-4
                py-3.5
                rounded-xl rounded-tr-none rounded-br-none
                bg-blue-xlight
                border-2 border-blue-light
                -mr-px
                text-neutral
                placeholder-neutral-xlight
                w-full
                hover:border-blue hover:z-10
                focus:outline-none focus:z-20
                focus-visible:ring
              "
              placeholder="Departure Date"
            />
            <input
              type="date"
              id="arrivalDate"
              :min="new Date(Date.now()).toISOString().split('T')[0]"
              class="
                px-4
                py-3.5
                rounded-xl rounded-tl-none rounded-bl-none
                bg-blue-xlight
                border-2 border-blue-light
                text-neutral
                placeholder-neutral-xlight
                w-full
                hover:border-blue hover:z-10
                focus:outline-none focus:z-20
                focus-visible:ring
              "
              placeholder="Arrival Date"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
