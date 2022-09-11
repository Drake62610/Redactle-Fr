<script setup lang="ts">
import type { Guess } from '@/model/guess.data'
import type { UserStats } from '@/model/user-stats.data'
import RedactleInfo from './RedactleInfo.vue'

import { defineComponent } from 'vue'
import { DateTime } from 'luxon'
import { redactus } from '@/assets/redactus'
import DBService from '@/services/db.service'
import { useRoute } from 'vue-router'
</script>

<script lang="ts">
export default defineComponent({
  name: 'RedactleHome',
  data() {
    return {
      db: new DBService('redactus'),
      stats: new Array<UserStats>(),
      showInfo: false,
      redactusInProgressNumber: new Number,
      solvedRedactusNumbers: new Array<Number>(),
      isReady: false,
    }
  },
  async created() {
    await this.db.createObjectStore(['stats'])
    this.stats = (await this.db.getAllValue('stats')) as UserStats[];
    this.redactusInProgressNumber = +(localStorage.getItem('currentRedactus') as string)

    this.stats.forEach((e) => {
      this.solvedRedactusNumbers.push(e.number)
    });
    this.isReady = true
  },
  methods: {
    triggerInfo(): void {
      this.showInfo = !this.showInfo
    },
  },
})
</script>
<template>
    <RedactleInfo v-if="isReady" :enabled="showInfo" :yesterdaySolution="''" />

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <span class="navbar-brand mb-0 h1 mx-4">
        REDACTUS
      </span>
      <div class="collapse navbar-collapse ms-5" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link mx-2">
              Home
            </a>
          </li>
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
            <label class="nav-link mx-2">
              <a style="cursor: pointer;" @click="$router.push('custom')">
                Custom Mode
              </a>
            </label>
          </li>
          <li class="nav-item">
            <a
              class="nav-link mx-2"
              href="https://ko-fi.com/drakelionblanc"
              style="cursor: pointer;"
            >
              Support
            </a>
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

    <div v-if="isReady" style="height: 50rem; background-color:black; color: #989898; overflow: scroll;">
      <br />
      <div class="container container-lg" >
        <h2>Résolus</h2>
        <table class="table table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Mot</th>
                <th scope="col">Essais</th>
                <th scope="col">Precision</th>
                <th scope="col">Replay</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in stats.sort((a, b) => {
                  return a.number - b.number;
              })" :key="item.word">
                <th scope="col">{{ item.number }}</th>
                <th scope="col">{{ item.word.replace('_', ' ') }}</th>
                <th scope="col">{{ item.hits }}</th>
                <th scope="col">{{ item.accuracy }}</th>
                <th v-if="!(redactusInProgressNumber === item.number)" @click="$router.push({ name: 'play', params: { number: item.number } })" scope="col" style="cursor: pointer;">🔄</th>
                <th v-if="redactusInProgressNumber === item.number" @click="$router.push({ name: 'play', params: { number: item.number } })" scope="col" style="cursor: pointer;">⏯</th>
              </tr>
            </tbody>
          </table>

        <h2>Non Résolus</h2>
        <table class="table table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Mot</th>
                <th scope="col">Essais</th>
                <th scope="col">Precision</th>
                <th scope="col">Play</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in redactus" :key="item"> 
                <tr v-if="!(index in solvedRedactusNumbers)">
                  <th scope="col">{{index + 1}}</th>
                  <!-- <th scope="col">{{item}}</th> -->
                  <th scope="col">{{'█'.repeat(item.length)}}</th>
                  <th scope="col">Not done</th>
                  <th scope="col">Not Done</th>
                  <th v-if="!(redactusInProgressNumber === index + 1)" @click="$router.push({ name: 'play', params: { number: index + 1 } })" scope="col" style="cursor: pointer;">▶️</th>
                  <th v-if="redactusInProgressNumber === index + 1" @click="$router.push({ name: 'play', params: { number: index + 1 } })" scope="col" style="cursor: pointer;">⏯</th>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
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
