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
    customCommand: String
  },
  async created() {
    if (this.twitchChannel) {
      const validsCommands = ['w', 'word', 'mot', 'm', this.customCommand]
      ComfyJS.onCommand = (user, command, message, flags, extra) => {
        if (validsCommands.includes(command) && message.split(' ')[0] !== '') {
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
</template>
