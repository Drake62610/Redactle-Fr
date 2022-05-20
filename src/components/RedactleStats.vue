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
      correctHits: 0,
      consecutive: 0,
      share: false,
      isReady: false,
    }
  },
  async created() {
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
    triggerShare() {
      this.share = !this.share
    },
  },
})
</script>

<template>
  <div class="container container-lg" style="display: block;">
    <h3>
      Félicitation vous avez résolu le Redactus #{{ redactusNumber }}
      (BETA)!
    </h3>
    <ul v-if="isReady">
      <li>La réponse était: {{ redactusSolution }}</li>
      <li>Vous avez résolu le rédactus en {{ guesses.length }} essaies</li>
      <li>
        Votre précision était
        {{ Math.round((this.correctHits / this.guesses.length) * 100) }}%
      </li>
      <li>Vous avez résolu {{ consecutive }} Redactus consécutif</li>
    </ul>

    <div class="share-button sharer" style="display: block;">
      <button
        @click="triggerShare"
        type="button"
        class="btn btn-success share-btn"
      >
        Share
      </button>
      <div
        class="social top center networks-5"
        :class="{ active: share === true }"
      >
        <!-- Facebook Share Button -->
        <!-- <a
          class="fbtn share facebook"
          href="https://www.facebook.com/sharer/sharer.php?u=url"
        >
          <i class="fa fa-facebook"></i>
        </a> -->

        <!-- Twitter Share Button -->
        <a
          class="fbtn share twitter"
          :href="'https://twitter.com/intent/tweet?text='+ encodeURIComponent('Redactus #' + redactusNumber + '\nRésolue en ' +guesses.length +'essaies avec une précision de '+Math.round((this.correctHits / this.guesses.length) * 100) +' %\n\nTrouve le titre de cet article Wikipédia obfuscé ! #Redactus\nhttps://redactus.lion-blanc.com')"
        >
          <i class="fa fa-twitter"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.social .fbtn {
  width: 50px;
  display: inline-block;
  color: #fff;
  text-align: center;
  line-height: 18px;
  float: left;
}
.social .fa {
  padding: 15px 0px;
}
.facebook {
  background-color: #3b5998;
}
.gplus {
  background-color: #dd4b39;
}
.twitter {
  background-color: #55acee;
}
.stumbleupon {
  background-color: #eb4924;
}
.pinterest {
  background-color: #cc2127;
}
.linkedin {
  background-color: #0077b5;
}
.buffer {
  background-color: #323b43;
}
.share-button.sharer {
  height: 20px;
}
.share-button.sharer .social.active.top {
  transform: scale(1) translateY(-10px);
}
.share-button.sharer .social.active {
  opacity: 1;
  transition: all 0.4s ease 0s;
  visibility: visible;
}
.share-button.sharer .social.top {
  margin-top: -80px;
  transform-origin: 0 0 0;
}
.share-button.sharer .social {
  margin-left: -65px;
  opacity: 0;
  transition: all 0.4s ease 0s;
  visibility: hidden;
}
</style>
