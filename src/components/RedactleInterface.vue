<script setup lang="ts">
import RedactleArticle from '@/components/RedactleArticle.vue'
</script>

<template>
  <body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <span class="navbar-brand mb-0 h1 mx-4">Redactle</span>
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
      <div class="collapse navbar-collapse ms-5" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link mx-2" href="#" id="infoBtn">Info</a>
          </li>
          <li class="nav-item">
            <a class="nav-link mx-2" href="#" id="statsBtn">Stats</a>
          </li>
          <li class="nav-item">
            <a class="nav-link mx-2" href="#" id="settingsBtn">Settings</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link mx-2"
              href="https://www.patreon.com/jhntrnr"
              target="_blank"
            >
              Patreon
            </a>
          </li>
        </ul>
      </div>
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
        <tbody id="guessLogBody"></tbody>
      </table>
    </nav>
    <div class="bg-dark fixed-bottom" id="inputHolder">
      <div class="input-group m-3" id="inGrp">
        <button class="btn btn-outline-secondary" type="button" id="backToTop">
          &#9650; Top
        </button>
        <input
          type="text"
          class="form-text-lg"
          aria-label="Text input"
          autofocus
          autocomplete="off"
          placeholder="Guess"
          id="userGuess"
        />
        <button
          class="btn btn-outline-secondary"
          type="button"
          id="submitGuess"
        >
          Guess
        </button>
      </div>
    </div>
    <div class="container container-lg" id="winText"></div>

    <div class="container container-lg wikiHolder">
      <RedactleArticle />
    </div>

    <div
      class="modal fade"
      id="infoModal"
      tabindex="-1"
      aria-labelledby="infoModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content text-dark">
          <div class="modal-header">
            <h5 class="modal-title" id="infoModalLabel">
              Welcome to Redactle!
            </h5>
            <button
              type="button"
              class="btn-close closeInfo"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Redactle is a daily browser game where the user tries to determine
              the subject of a random obfuscated Wikipedia article, chosen from
              <a
                href="https://en.wikipedia.org/wiki/Wikipedia:Vital_articles/Level/4"
                target="_blank"
              >
                Wikipedia's 10,000 Vital Articles (Level 4).
              </a>
            </p>
            <p>
              A new puzzle will be available every day at 11:00 AM CDT (16:00
              UTC).
            </p>
            <p>
              Follow Redactle on Twitter
              <a href="https://www.twitter.com/RedactleGame" target="_blank">
                @RedactleGame
              </a>
              .
            </p>
            <p>
              Created by
              <a href="https://www.twitter.com/jhntrnr" target="_blank">
                John Turner
              </a>
            </p>
            <p id="yesterday"></p>
            <h5>How to Play</h5>
            <ul>
              <li>
                Type a word into the input box and press Enter or the Guess
                button.
              </li>
              <li>
                All occurrences of that word will become unredacted in the
                article body.
              </li>
              <li>To win, figure out the title or subject of the article.</li>
            </ul>
            <h5>Tips and Quirks</h5>
            <ul>
              <li>
                Each guess must be one word only (Guessing multiple words at a
                time will not work).
              </li>
              <li>
                <i>Most</i>
                Punctuation is automatically revealed in the article page. Some
                punctuation occasionally escapes Redactle's filter and becomes
                redacted.
              </li>
              <li>
                Guesses are case
                <i>insensitive</i>
                , and letters with diacritics (é, ü, etc) are considered to not
                have those diacritics.
              </li>
              <li>
                Shift+Enter will attempt to automatically pluralize or
                singularize your guess. There are certain edge cases (e.g.
                guessing a nonsense word like "asdf") where this will submit
                nonsense guesses.
              </li>
              <li>
                You will likely encounter some formatting and punctuation
                quirks. These are a result of stripping away certain characters
                and elements present in the original Wikipedia article that
                don't play nicely with Redactle.
              </li>
              <li>
                Many common words are automatically revealed for your
                convenience. The list includes most English prepositions and
                articles. Guessing these words does not count toward your score.
              </li>
              <li>Check the Settings menu for configuration options.</li>
            </ul>
            <h5>Does Redactle collect any user data?</h5>
            <p>
              In order to provide global performance stats, Redactle makes note
              of a user's performance on a given puzzle. The data collected is
              limited to the user's score and accuracy, and is anonymized.
            </p>
            <p>
              Redactle does not collect any information regarding a user's
              actual guesses.
            </p>
            <p>
              For more information, view Redactle's
              <a href="privacy.html">Privacy Policy.</a>
            </p>
            <p class="text-secondary">Version 1.0</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary closeInfo"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="settingsModal"
      tabindex="-1"
      aria-labelledby="settingsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content text-dark">
          <div class="modal-header">
            <h5 class="modal-title" id="settingsModalLabel">Settings</h5>
            <button
              type="button"
              class="btn-close closeSettings"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div>
              <div>
                <label>
                  <!-- <input name="checkbox" type="checkbox" id="hideZero" class="configCheck"> Hide Guesses with 0 Hits</input><br><br> -->
                </label>
              </div>
              <div>
                <label>
                  <!-- <input name="checkbox" type="checkbox" id="autoPlural" class="configCheck"> Attempt to automatically pluralize and singularize guesses. There are certain edge cases (e.g. guessing a nonsense word like "asdf") where this will submit nonsense guesses.</input><br><br> -->
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary closeSettings"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="statsModal"
      tabindex="-1"
      aria-labelledby="statsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content text-dark">
          <div class="modal-header">
            <h5 class="modal-title" id="statsModalLabel">Personal Stats</h5>
            <button
              type="button"
              class="btn-close closeStats"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div id="statsHolder">
              <table class="table table-dark" id="statsTable">
                <tbody>
                  <tr>
                    <th class="statHeadnum">#</th>
                    <th class="statHeadart">Article</th>
                    <th class="statHeadguess">Guesses</th>
                    <th class="statHeadacc">Accuracy</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary closeStats"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
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
.highlighted {
  background-color: #00585e !important;
}
.superHighlighted {
  background-color: #00becc !important;
  color: #0f0f0f;
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
