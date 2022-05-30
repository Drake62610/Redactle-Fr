<script setup lang="ts">
import type { Guess } from '@/model/guess.data'
import type { UserStats } from '@/model/user-stats.data'

import { defineComponent } from 'vue'
import { DateTime } from 'luxon'
import { redactus } from '@/assets/redactus'
import DBService from '@/services/db.service'
import { useRoute } from 'vue-router'
</script>

<script lang="ts">
export default defineComponent({
  name: 'RedactleInterface',
  data() {
    return {
      inputLink: '',
      wikiLink: '',
    }
  },
  created() {},
  methods: {
    computeCode(): void {
      if (this.inputLink === '') {
        return
      }
      this.wikiLink = btoa(this.inputLink.split('wiki/')[1])
      this.wikiLink = location.href + '/' + this.wikiLink
    },
    copy(): void {
      if (this.inputLink === '') {
        return
      }

      navigator.clipboard.writeText(this.wikiLink)
    },
  },
})
</script>
<template>
  <body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <span class="navbar-brand mb-0 h1 mx-4">
        REDACTUS
      </span>
      <div class="collapse navbar-collapse ms-5" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link mx-2" href="/">
              Home
            </a>
          </li>
          <!-- <li class="nav-item">
            <a
              class="nav-link mx-2"
              @click="triggerInfo"
              style="cursor: pointer;"
            >
              Info
            </a>
          </li> -->
          <!-- <li class="nav-item">
            <label class="nav-link mx-2">
              <a style="cursor: pointer;" @click="$router.push('custom')">
                Custom Mode
              </a>
            </label>
          </li> -->
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

    <div
      id="adsgoeshere"
      style="background: #1d1f29; padding-top: 60px; text-align: center;"
    ></div>

    <div class="container container-lg" style="height: 50rem;">
      <br />
      <h1>Generez un lien basé sur un article wikipedia</h1>
      <li>Va sur la page wikipedia que tu souhaite générer</li>
      <li>Récupère le lien de l'article et colle le ci-dessous</li>
      <li>
        Clique sur le bouton pour générer un lien et partage le à tes amis
      </li>
      <li>
        Pense à vérifier que l'article généré est le bon et qu'il n'y a pas
        d'erreur de formatage !
      </li>
      <div style="text-align: center;">
        <div>
          <div class="input-group m-3" id="inGrp" style="display: grid;">
            <input
              type="text"
              class="form-text-lg"
              aria-label="Text input"
              autofocus
              placeholder="https://fr.wikipedia.org/wiki/Marge_Simpson"
              v-model="inputLink"
              @keyup.enter="computeCode()"
            />
            <button
              @click="computeCode()"
              class="btn btn-outline-secondary"
              type="button"
            >
              Generate Link
            </button>
          </div>
        </div>
        <br />
        <button v-if="wikiLink !== ''" type="button" class="btn btn-primary">
          <a style="color: white; text-decoration: none;" :href="wikiLink">
            Redactus Custom
          </a>
        </button>
        &nbsp;
        <button v-if="wikiLink !== ''" type="button" class="btn btn-secondary">
          <a style="color: white; text-decoration: none;" @click="copy()">
            Copy Link
          </a>
        </button>
        <br />
      </div>
    </div>
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
