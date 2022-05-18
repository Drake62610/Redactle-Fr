<script setup lang="ts">
import RedactleInput from '@/components/RedactleInput.vue'
import RedactleArticle from '@/components/RedactleArticle.vue'
import RedactleStats from './RedactleStats.vue'
import TwitchIntegration from '@/components/TwitchIntegration.vue'
import CustomModal from './CustomModal.vue'
import RedactleInfo from './RedactleInfo.vue'
import type { Guess } from '@/model/guess.data'
import type { UserStats } from '@/model/user-stats.data'

import { defineComponent } from 'vue'
import { DateTime } from 'luxon'
import { redactus } from '@/assets/redactus'
import DBService from '@/services/db.service'
</script>

<script lang="ts">
export default defineComponent({
  name: 'RedactleInterface',
  data() {
    return {
      guess: '',
      guesses: new Array<Guess>(),
      superHighlighted: document.createElement('div') as Element,
      redactusNumber: 0,
      redactusSolution: '',
      hasWon: false,
      focus: '',
      index: 0,
      isReady: false,
      showStats: false,
      showInfo: false,
      twitchMode: false,
      twitchInput: '',
      twitchChannel: '',
      twitchGuess: { user: '', message: '' },
    }
  },
  async created() {
    const diff = DateTime.fromObject({ day: 13, month: 5, year: 2022 })
      .diffNow('days')
      .toObject().days as number
    this.redactusNumber = Math.floor(Math.abs(diff ? +diff : 0))
    this.redactusSolution = redactus[this.redactusNumber - 1] as string

    // await this.db.createObjectStore(['stats'])
    // const allWords = (await this.db.getAllValue('stats')) as UserStats[]
    // if (
    //   allWords.length &&
    //   allWords.map((e) => e.word).includes(this.redactusSolution as string)
    // ) {
    //   this.hasWon = true
    // }

    if (localStorage.getItem('currentRedactus')) {
      if (
        this.redactusNumber !==
        +(localStorage.getItem('currentRedactus') as string)
      ) {
        localStorage.removeItem('guesses')
      }
    }
    localStorage.setItem('currentRedactus', this.redactusNumber.toString())

    if (localStorage.getItem('currentTime')) {
      const currentTime = DateTime.fromISO(
        localStorage.getItem('currentTime') as string,
      )
      if (DateTime.now().day !== currentTime.day) {
        localStorage.removeItem('guesses')
      }
    }
    localStorage.setItem('currentTime', DateTime.now().toISODate())
  },
  methods: {
    // Twich Mode Methods
    enabletwitchMode(): void {
      this.twitchMode = !this.twitchMode
    },
    updateStreamerName(): void {
      if (this.twitchInput === '') {
        return
      }
      this.twitchChannel = this.twitchInput
    },
    inputTwitchUpdated(event: { user: string; message: string }): void {
      this.twitchGuess = event
    },
    triggerStats(): void {
      this.showStats = !this.showStats
    },
    triggerInfo(): void {
      this.showInfo = !this.showInfo
    },
    // /!\ BAD
    handleLoad(event: any): void {
      this.guesses = event
    },
    inputUpdated(event: string): void {
      this.guess = event
    },
    handleGuesses(event: Guess): void {
      if (this.hasWon) {
        return
      }
      let isDuplicate = false
      this.guesses.forEach((guess) => {
        if (guess.guess === event.guess) {
          if (!event.user) {
            this.focusWord(event)
          }
          isDuplicate = true
          return
        }
      })

      if (!isDuplicate) {
        this.guesses.push(event)
        if (!event.user) {
          this.focusWord(event)
        }
        localStorage.setItem(
          'guesses',
          JSON.stringify(
            this.guesses.map((guess) => {
              return { guess: guess.guess, count: guess.count }
            }),
          ),
        )
      }
    },
    handleWin(): void {
      this.superHighlighted.classList.remove('superHighlighted')
      this.hasWon = true
    },
    goToTop(): void {
      window.scrollTo(0, 0)
    },
    focusWord(input: Guess): void {
      if (!input.count) {
        return
      }
      if (this.focus !== input.guess) {
        this.focus = input.guess
        this.index = 0
      }
      const element = input.list[
        this.index++ % input.list.length
      ] as HTMLElement

      // Highlight
      this.superHighlighted.classList.remove('superHighlighted')
      this.superHighlighted.classList.remove('highlighted')
      element.classList.add('superHighlighted')
      this.superHighlighted = element

      // Scroll
      window.scrollTo(0, element.offsetTop - 120)
    },
    switchReady(): void {
      this.isReady = true
    },
  },
})
</script>
<template>
  <body>
    <template>
      <component
        :is="'script'"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1578220624296803"
        crossorigin="anonymous"
      ></component>
      <!-- Test -->
      <ins
        class="adsbygoogle"
        style="display: block;"
        data-ad-client="ca-pub-1578220624296803"
        data-ad-slot="6125916261"
        data-full-width-responsive="true"
      ></ins>
      <component :is="'script'">
        ;(adsbygoogle = window.adsbygoogle || []).push({})
      </component>
    </template>

    <TwitchIntegration
      v-if="twitchChannel != ''"
      @twitchGuess="inputTwitchUpdated"
      :twitchChannel="twitchChannel"
    />
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <span class="navbar-brand mb-0 h1 mx-4">
        REDACTUS #{{ redactusNumber }}
      </span>
      <div class="collapse navbar-collapse ms-5" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a
              class="nav-link mx-2"
              @click="triggerInfo"
              style="cursor: pointer;"
            >
              Info
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link mx-2"
              @click="triggerStats"
              style="cursor: pointer;"
            >
              Stats
            </a>
          </li>
          <!-- <li class="nav-item">
            <a class="nav-link mx-2" href="#" id="settingsBtn">Settings</a>
          </li> -->
          <li class="nav-item">
            <label class="nav-link mx-2">
              <a style="cursor: pointer;" @click="enabletwitchMode()">
                Twitch Mode
              </a>
            </label>
          </li>
          <li class="nav-item" v-if="twitchMode">
            <input
              type="text"
              class="form-text-lg"
              autofocus
              autocomplete="on"
              placeholder="DrakeLeLionBlanc"
              v-model="twitchInput"
              @keyup.enter="updateStreamerName()"
            />
            <button
              @click="updateStreamerName()"
              class="btn btn-outline-secondary"
              type="button"
            >
              Go
            </button>
          </li>
        </ul>
      </div>
      <button
        class="navbar-toggler mx-2"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    </nav>
    <nav
      class="navbar navbar-expand-lg navbar-dark bg-dark fixed-right overflow-auto"
    >
      <table class="table table-dark table-hover mt-5" id="tableHolder">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th v-if="twitchMode" scope="col">UserName</th>
            <th scope="col">Guess</th>
            <th scope="col">Hits</th>
          </tr>
        </thead>
        <template v-if="guesses.length">
          <tbody
            v-for="(item, index) in [...guesses].reverse()"
            :key="item.guess"
          >
            <tr
              :class="{ 'table-secondary': item.guess === focus, 'success': item.count > 0}"
              @click="focusWord(item)"
            >
              <td># {{ guesses.length - index }}</td>
              <td v-if="twitchMode">{{ item.user ? item.user : 'streamer' }}</td>
              <td>{{ item.guess }}</td>
              <td>{{ item.count }}</td>
            </tr>
          </tbody>
        </template>
      </table>
    </nav>

    <CustomModal v-if="isReady" :enabled="showStats" />
    <RedactleInfo v-if="isReady" :enabled="showInfo" />

    <template v-if="hasWon && isReady">
      <RedactleStats
        :redactusNumber="redactusNumber"
        :redactusSolution="redactusSolution"
        :guesses="guesses"
      />
    </template>
    <div
      v-if="redactusSolution !== ''"
      class="container container-lg wikiHolder"
    >
      <RedactleArticle
        @load="handleLoad"
        @update="handleGuesses"
        @win="handleWin"
        @isReady="switchReady"
        :name="redactusSolution"
        :guess="guess"
        :focus="focus"
        :hasWon="hasWon"
        :twitchGuess="twitchGuess"
      />
    </div>
    <template v-if="isReady">
      <div class="bg-dark fixed-bottom">
        <RedactleInput @update="inputUpdated" @top="goToTop" />
      </div>
    </template>
  </body>
</template>

<style scoped>
body {
  font-family: 'Segoe UI', 'Liberation Sans', sans-serif;
  background-color: #0f0f0f;
  color: #989898;
}

.wikiHolder {
  display: flex;
}

@media (min-width: 992px) {
  body {
    margin-right: 30vw;
  }
  .mw-parser-output {
    margin-bottom: auto;
    margin-right: 0;
    max-width: 100vw;
  }
}

.baffled {
  background-color: #989898;
}
.hiddenRow {
  display: none;
}
td {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.navbar.fixed-right {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
}
.mw-parser-output {
  font-family: monospace;
  font-size: 18px;
  margin-top: 15px;
  margin-bottom: 10vh;
  overflow-x: auto;
  overflow-wrap: break-word;
}

#inputHolder {
  position: fixed;
  bottom: 0;
  z-index: 1;
}
#inGrp {
  padding-left: 20vw;
}
#userGuess {
  min-width: 20vw;
}
.statsTable {
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
@media (min-width: 992px) {
  .navbar.fixed-right {
    top: 0;
    width: 30vw;
    flex-flow: column nowrap;
    align-items: flex-start;
  }
  .navbar.fixed-right .navbar-collapse {
    flex-grow: 0;
    flex-direction: column;
    width: 100%;
  }
  .navbar.fixed-right .navbar-collapse .navbar-nav {
    flex-direction: column;
    width: 100%;
  }
  .navbar.fixed-right .navbar-collapse .navbar-nav .nav-item {
    width: 100%;
  }
  .navbar.fixed-right .navbar-collapse .navbar-nav .nav-item .dropdown-menu {
    top: 0;
  }
}
@media (min-width: 992px) {
  .navbar.fixed-right {
    left: auto;
  }
  .navbar.fixed-right .navbar-nav .nav-item .dropdown-toggle:after {
    border-top: 0.3em solid transparent;
    border-left: none;
    border-bottom: 0.3em solid transparent;
    border-right: 0.3em solid;
    vertical-align: baseline;
  }
  .navbar.fixed-right .navbar-nav .nav-item .dropdown-menu {
    left: auto;
    right: 100%;
  }
}
@media (max-width: 992px) {
  .mw-parser-output {
    margin-bottom: 50vh;
    max-width: 100vw;
    padding-right: 15px;
  }
  .navbar.fixed-right {
    bottom: 60px;
    max-height: 30vh;
    max-width: 100vw;
  }
  .modal {
    max-width: 100vw;
  }
  #inputHolder {
    max-width: 100vw;
  }
  #tableHolder {
    margin: 0px !important;
  }
  #inGrp {
    padding-left: 10vw;
  }
  #userGuess {
    min-width: 50vw;
  }
  #submitGuess {
    min-width: 15vw;
  }
  #inGrp {
    padding-left: 0;
  }
}
</style>
