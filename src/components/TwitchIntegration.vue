<script lang="ts">
import { defineComponent } from 'vue'
import DBService from '@/services/db.service'
import 'https://cdn.jsdelivr.net/npm/comfy.js/dist/comfy.min.js'
import type { ComfyJSInstance } from 'comfy.js'

const ComfyJS = (window as any).ComfyJS as ComfyJSInstance

import type { Guess } from '@/model/guess.data'

import type { UserStats } from '@/model/user-stats.data'

export default defineComponent({
  props: {
    twitchChannel: String,
  },
  async created() {
    if (this.twitchChannel) {
      ComfyJS.onCommand = (user, command, message, flags, extra) => {
        if (command == 'word' && message.split(' ')[0] !== '') {
          this.$emit('twitchGuess', {
            user,
            message: message
              .split(' ')[0]
              .normalize('NFD')
              .replace(/^\s*$/, '')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(' ', '')
              .toLowerCase(),
          })
        }
      }
      ComfyJS.Init(this.twitchChannel)
    }
  },
  methods: {},
})
</script>

<template>
  <div class="container container-lg" style="display: block;">
    <h3>
      Attention cette feature est en early BETA
    </h3>
  </div>
</template>
