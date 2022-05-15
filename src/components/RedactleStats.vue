<script lang="ts">
import { defineComponent } from 'vue'
import DBService from '@/services/db.service'

import type { Guess } from '@/model/guess.data'
import type { UserStats } from '@/model/user-stats.data'

export default defineComponent({
  props: {
    redactusNumber: Number,
    redactusSolution: String,
  },
  data() {
    return {
      db: new DBService('redactus'),
      guesses: new Array<Guess>(),
      hits: 0,
      consecutive: 0,
      isReady: false,
    }
  },
  async created() {
    this.guesses = JSON.parse(localStorage.getItem('guesses') as string)
    this.hits = this.guesses.filter((e) => {
      return e.count !== 0
    }).length

    await this.db.createObjectStore(['stats'])

    this.consecutive = await this.computeConsecutive()

    const allWords = (await this.db.getAllValue('stats')) as UserStats[]

    if (
      !allWords.length ||
      !allWords.map((e) => e.word).includes(this.redactusSolution as string)
    ) {
      await this.db.putValue('stats', {
        number: this.redactusNumber,
        word: this.redactusSolution,
        hits: this.hits,
        accuracy: Math.round((this.hits / this.guesses.length) * 100),
      })
    }
    this.isReady = true
  },
  methods: {
    async computeConsecutive(): Promise<number> {
      const allValue = (await this.db.getAllValue('stats')) as UserStats[]
      if (allValue.length < 2) {
        return 0
      }

      let consecutive = 0
      let currentNumber = allValue.reverse()[0].number
      allValue.reverse().every((data) => {
        if (currentNumber - data.number === 1) {
          currentNumber = data.number
          consecutive++
        }
        if (currentNumber - data.number > 1) return false
      })
      return consecutive
    },
    shareResults() {
      return
    },
  },
})
</script>

<template>
  <div class="container container-lg" style="display: block;">
    <h3>
      Félicitation vous avez résolu le Redactus #{{
        redactusNumber
      }}
      (BETA)!
    </h3>
    <ul v-if="isReady">
      <li>La réponse était: {{ redactusSolution }}</li>
      <li>Vous avez résolu le rédactus en {{ guesses.length }} essaies</li>
      <li>
        Votre précision était
        {{ Math.round((hits / guesses.length) * 100) }}%
      </li>
      <li>Vous avez résolu {{ consecutive }} Redactus consécutif</li>
    </ul>
    <!-- <h3>Global Stats</h3> -->
    <!-- <ul>
      <li>Globally, 5909 players have solved today's Redactle so far</li>
      <li>Global Median: 73.00 Guesses; 60.58% Accuracy</li>
      <li>Global Average: 92.04 Guesses; 61.37% Accuracy</li>
    </ul> -->
    <!-- <p><a @click="shareResults">Share your results</a></p> -->
  </div>
</template>
