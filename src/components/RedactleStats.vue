<script lang="ts">
import { defineComponent } from 'vue'
import DBService from '@/services/db.service'

import type { Guess } from '@/model/guess.data'
import type { UserStats } from '@/model/user-stats.data'

export default defineComponent({
  props: {
    redactusNumber: Number,
    redactusSolution: String,
    customMode: Boolean
  },
  data() {
    return {
      db: new DBService('redactus'),
      guesses: new Array<Guess>(),
      correctHits: 0,
      consecutive: 0,
      share: false,
      isReady: false,
    }
  },
  async created() {
    if(this.customMode) {
      return;
    }
    this.guesses = JSON.parse(localStorage.getItem('guesses') as string)
    this.correctHits = this.guesses.filter((e) => {
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
        hits: this.guesses.length,
        accuracy: Math.round((this.correctHits / this.guesses.length) * 100),
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
  },
})
</script>

<template>
  <div v-if="!customMode" class="container container-lg" style="display: block;">
    <h3>
      Félicitation vous avez résolu le Redactus #{{ redactusNumber }}
      (BETA)!
    </h3>
    <ul v-if="isReady">
      <li>La réponse était: {{ redactusSolution }}</li>
      <li>Vous avez résolu le rédactus en {{ guesses.length }} essaies</li>
      <li>
        Votre précision était
        {{ Math.round((correctHits / guesses.length) * 100) }}%
      </li>
      <li>Vous avez résolu {{ consecutive }} Redactus consécutif</li>
    </ul>

    <!-- Sharingbutton Twitter -->
    <a
      class="resp-sharing-button__link"
      :href="
        'https://twitter.com/intent/tweet?text=' +
        encodeURIComponent(
          'Redactus #' +
            redactusNumber +
            '\nRésolu en ' +
            guesses.length +
            'essaies avec une précision de ' +
            Math.round((correctHits / guesses.length) * 100) +
            ' %\n\nTrouve le titre de cet article Wikipédia obfuscé ! #Redactus\nhttps://redactus.lion-blanc.com',
        )
      "
      target="_blank"
      rel="noopener"
      aria-label="Share on Twitter"
    >
      <div
        class="resp-sharing-button resp-sharing-button--twitter resp-sharing-button--large"
      >
        <div
          aria-hidden="true"
          class="resp-sharing-button__icon resp-sharing-button__icon--solid"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"
            />
          </svg>
        </div>
        Share on Twitter
      </div>
    </a>
  </div>
  <div v-if="customMode" class="container container-lg" style="display: block;">
    <h3>
      Bravo vous avez résolu le Redactus Custom !
    </h3>
    <ul>
      <li>La réponse était: {{ redactusSolution }}</li>
      <!-- Support Guesses as input and not via localstorage for custom mode --> 
      <!-- <li>Vous avez résolu le rédactus en {{ guesses.length }} essaies</li>
      <li>
        Votre précision était
        {{ Math.round((correctHits / guesses.length) * 100) }}%
      </li> -->
    </ul>
    
  </div>
</template>

<style scoped>
.resp-sharing-button__link,
.resp-sharing-button__icon {
  display: inline-block;
}

.resp-sharing-button__link {
  text-decoration: none;
  color: #fff;
  margin: 0.5em;
}

.resp-sharing-button {
  border-radius: 5px;
  transition: 25ms ease-out;
  padding: 0.5em 0.75em;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
}

.resp-sharing-button__icon svg {
  width: 1em;
  height: 1em;
  margin-right: 0.4em;
  vertical-align: top;
}

.resp-sharing-button--small svg {
  margin: 0;
  vertical-align: middle;
}

/* Non solid icons get a stroke */
.resp-sharing-button__icon {
  stroke: #fff;
  fill: none;
}

/* Solid icons get a fill */
.resp-sharing-button__icon--solid,
.resp-sharing-button__icon--solidcircle {
  fill: #fff;
  stroke: none;
}

.resp-sharing-button--twitter {
  background-color: #55acee;
}

.resp-sharing-button--twitter:hover {
  background-color: #2795e9;
}

.resp-sharing-button--twitter {
  background-color: #55acee;
  border-color: #55acee;
}

.resp-sharing-button--twitter:hover,
.resp-sharing-button--twitter:active {
  background-color: #2795e9;
  border-color: #2795e9;
}
</style>
