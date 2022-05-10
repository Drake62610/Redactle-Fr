<script setup lang="ts">
import RedactleInput from '@/components/RedactleInput.vue'
import RedactleArticle from '@/components/RedactleArticle.vue'
import { defineComponent } from 'vue'
</script>

<script lang="ts">
type Guess = {
  guess: string
  count: number
  list: HTMLElement[]
}

export default defineComponent({
  name: 'RedactleInterface',
  data() {
    return {
      guess: '',
      guesses: new Array<Guess>(),
      focus: '',
      index: 0,
    }
  },
  methods: {
    inputUpdated(event: string): void {
      this.guess = event
    },
    handleGuesses(event: Guess): void {
      let isDuplicate = false
      this.guesses.forEach((guess) => {
        if (guess.guess === event.guess) {
          this.focusWord(event)
          isDuplicate = true;
          return;
        }
      })

      if (!isDuplicate) {
        this.guesses.push(event);
        this.focusWord(event);
      }
    },
    goToTop(): void {
      window.scrollTo(0, 0);
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
      window.scrollTo(0, element.offsetTop - 60)
    },
  },
})
</script>

<template>
  <body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <span class="navbar-brand mb-0 h1 mx-4">Redactle FR</span>
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
              :class="{ 'table-secondary': item.guess === focus }"
              @click="focusWord(item)"
            >
              <td># {{ guesses.length - index }}</td>
              <td>{{ item.guess }}</td>
              <td>{{ item.count }}</td>
            </tr>
          </tbody>
        </template>
      </table>
    </nav>

    <div class="container container-lg wikiHolder">
      <RedactleArticle @update="handleGuesses" :guess="guess" :focus="focus" />
    </div>

    <div class="bg-dark fixed-bottom">
      <RedactleInput @update="inputUpdated" @top="goToTop" />
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
  z-index: 1030;
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
  z-index: 4;
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
