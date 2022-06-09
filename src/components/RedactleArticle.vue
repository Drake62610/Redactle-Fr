<script lang="ts">
import axios from 'axios'
import { commonWords } from '@/assets/commonWords'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

type Guess = {
  guess: string
  count: number
  list: Element[]
}

class TwitchGuess {
  user: string
  message: string
  constructor() {
    ;(this.user = ''), (this.message = '')
  }
}

export default defineComponent({
  props: {
    guess: String,
    twitchGuess: Object,
    focus: String,
    name: String,
  },
  data() {
    return {
      text: JSON,
      isReady: false,
      cleanHtml: new Document(),
      articleName: new Array<string>(),
      previousGuess: new Array<Guess>(),
      currentHighlighted: '',
      baffled: new Array<{
        formatedString: string
        e: Element
        original: string
      }>(),
    }
  },
  watch: {
    guess(value: string) {
      let count = 0

      // Check if not already guessed
      const hasWon = this.checkIfWin(value)

      if (this.baffled) {
        // Remove Highlight
        if (this.currentHighlighted) {
          this.baffled
            .filter((baffle) => {
              return baffle.formatedString === this.currentHighlighted
            })
            .forEach((matchGuess) => {
              matchGuess.e.classList.remove('highlighted')
            })
        }
        this.currentHighlighted = value

        // Reveal word
        const list: Element[] = []
        this.baffled
          .filter((baffle) => {
            return baffle.formatedString === value || hasWon
          })
          .forEach((matchGuess) => {
            matchGuess.e.innerHTML = matchGuess.original
            if (!hasWon) {
              matchGuess.e.classList.add('highlighted')
            }
            count++
            list.push(matchGuess.e)
          })
        this.$emit('update', {
          guess: value,
          count,
          list,
        })

        if (hasWon) {
          this.$emit('win')
        }
      }
    },
    twitchGuess(value: TwitchGuess) {
      let count = 0

      const hasWon = this.checkIfWin(value.message)

      if (this.baffled) {
        // Reveal word
        const list: Element[] = []
        this.baffled
          .filter((baffle) => {
            return baffle.formatedString === value.message || hasWon
          })
          .forEach((matchGuess) => {
            matchGuess.e.innerHTML = matchGuess.original
            count++
            list.push(matchGuess.e)
          })
        this.$emit('update', {
          guess: value.message,
          user: value.user,
          count,
          list,
        })

        if (hasWon) {
          this.$emit('win')
        }
      }
    },
    focus(value) {
      if (this.baffled) {
        if (!this.articleName.length) {
          return
        }

        // Remove Highlight
        if (this.currentHighlighted) {
          this.baffled
            .filter((baffle) => {
              return baffle.formatedString === this.currentHighlighted
            })
            .forEach((matchGuess) => {
              matchGuess.e.classList.remove('highlighted')
            })
        }
        this.currentHighlighted = value

        // Highlight word
        this.baffled
          .filter((baffle) => {
            return baffle.formatedString === value
          })
          .forEach((matchGuess) => {
            matchGuess.e.classList.add('highlighted')
          })
      }
    },
  },
  async created() {
    const route = useRoute()

    let isLoading = false
    // Local Storage
    if (!route.params.customName && localStorage.getItem('guesses')) {
      this.previousGuess = JSON.parse(localStorage.getItem('guesses') as string)
      this.previousGuess.forEach((e) => {
        e.list = []
      })
      isLoading = true
    }

    try {
      if (!this.name) {
        throw Error('Article Name not found')
      }
      this.articleName = decodeURI(this.name).split(/[:_'-\s]+/)
      await axios
        .get<{ parse: { text: string } }>(
          `https://fr.wikipedia.org/w/api.php?action=parse&format=json&page=${this.name}&prop=text&formatversion=2&origin=*`,
        )
        .then((res) => {
          if (res.status !== 200) {
            throw new Error(
              `Server error: [${res.status}] [${res.statusText}] [${res.request}]`,
            )
          }

          // Compute text
          const parser = new DOMParser()
          var cleanText: string = res.data.parse.text
            .replace(/<img[^>]*>/g, '')
            .replace(/\<small\>/g, '')
            .replace(/\<\/small\>/g, '')
            .replace(/–/g, '-')
            .replace(/<audio.*<\/audio>/g, '')
          this.cleanHtml = parser.parseFromString(cleanText, 'text/html')
          this.cleanHtml.querySelectorAll('small').forEach((e) => {
            e.replaceWith(...e.childNodes)
          })

          let deletableElement = this.cleanHtml.querySelector(
            '#Annexes',
          ) as HTMLElement
          if (this.cleanHtml.querySelector('#Notes_et_références')) {
            deletableElement = this.cleanHtml.querySelector(
              '#Notes_et_références',
            ) as HTMLElement
          } else if (this.cleanHtml.querySelector('#Annexes')) {
            deletableElement = this.cleanHtml.querySelector(
              '#Annexes',
            ) as HTMLElement
          } else if (this.cleanHtml.querySelector('#Voir_aussi')) {
            deletableElement = this.cleanHtml.querySelector(
              '#Voir_aussi',
            ) as HTMLElement
          }
          console.log(deletableElement);
          deletableElement = deletableElement.parentElement as HTMLElement

          if (deletableElement) {
            while (deletableElement?.nextElementSibling) {
              const element = deletableElement
              deletableElement = deletableElement.nextElementSibling as HTMLElement

              element.remove()
            }
          }

          //Handle times before deleting .nowrap classes
          this.cleanHtml.querySelectorAll('time').forEach((e) => {
            var newTag = document.createTextNode(e.innerText)
            if (e.firstChild) {
              e.parentNode?.replaceChild(newTag, e)
            }
          })
          this.cleanHtml
            .querySelectorAll(
              "style, .API nowrap, .reference, .prononciation, .NavFrame, #Voir_aussi, .reference-cadre, #Références, #Galerie, #Annexes, #Bibliographie, #Notes_et_références, #Articles_connexes, #Liens_externes, .nowrap, #bandeau-portail, [rel='mw-deduplicated-inline-style'], [title='Name at birth'], [aria-labelledby='micro-periodic-table-title'], .barbox, .wikitable, .clade, .Expand_section, .IPA, .thumb, .mw-empty-elt, .mw-editsection, .nounderlines, .nomobile, .searchaux, #toc, .sidebar, .sistersitebox, .noexcerpt, #External_links, #Further_reading, .hatnote, .haudio, .portalbox, .mw-references-wrap, .infobox, .unsolved, .navbox, .metadata, .refbegin, .reflist, .mw-stack, #Notes, #References, .reference, .quotebox, .collapsible, .uncollapsed, .mw-collapsible, .mw-made-collapsible, .mbox-small, .mbox, #coordinates, .succession-box, .noprint, .mwe-math-element, .cs1-ws-icon",
            )
            .forEach((e) => {
              e.remove()
            })

          // Handle anchors
          // this.emptyHTMLCollection(this.cleanHtml.getElementsByTagName('a'))
          // this.emptyHTMLCollection(this.cleanHtml.getElementsByTagName('i'))
          // this.emptyHTMLCollection(this.cleanHtml.getElementsByTagName('b'))
          // this.emptyHTMLCollection(this.cleanHtml.getElementsByTagName('abbr'))
          // this.emptyHTMLCollection(this.cleanHtml.getElementsByTagName('sub'))

          // // Handle quotes
          var bq = this.cleanHtml.getElementsByTagName('blockquote')
          for (var i = 0; i < bq.length; i++) {
            bq[i].innerHTML = bq[i].innerHTML.replace(/<[^>]*>?/gm, '')
          }

          // // Handle misc
          var s = this.cleanHtml.getElementsByTagName('sup')
          while (s.length) {
            s[0].remove()
          }
          var ex = this.cleanHtml.getElementsByClassName('excerpt')
          while (ex.length) {
            ex[0].remove()
          }

          // // Remove titles
          this.cleanHtml.querySelectorAll('[title]').forEach((e) => {
            e.removeAttribute('title')
          })

          // Unwrap headline parents
          this.cleanHtml.querySelectorAll('.mw-headline').forEach((e) => {
            e.replaceWith(...e.childNodes)
          })

          var titleHolder = this.cleanHtml.createElement('h1')
          var titleTxt = decodeURI(this.name as string).replace(/[_\s]+/g, " ")
          titleHolder.innerHTML = titleTxt

          this.cleanHtml.body.prepend(titleHolder)

          this.cleanHtml.body.innerHTML = this.cleanHtml.body.innerHTML
            .replace(/\(; /g, '(')
            .replace(/\(, /g, '(')
            .replace(/\(, /g, '(')
            .replace(/: ​;/g, ';')
            .replace(/ \(\) /g, ' ')
            .replace(/<\/?span[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')

          this.cleanHtml.querySelectorAll('*').forEach((e) => {
            e.removeAttribute('class')
            e.removeAttribute('style')
          })

          this.cleanHtml
            .querySelectorAll(
              'table',
            ).forEach((e) => {
              if (e.firstChild) {
                (e as HTMLElement).innerHTML = (e as HTMLElement).innerText.replace(
                  /([\.,:()\[\]?!;`\~\-\u2013\—&*"'«»%’/])/g,
                  '<span class="punctuation">$1</span>',
                )
              }
            })
          // Warning
          this.cleanHtml
            .querySelectorAll(
              'p, blockquote, h1, h2, h3, table, li, i, cite, span, dl',
            )
            .forEach((e) => {
              if (e.firstChild) {
                (e as HTMLElement).innerHTML = (e as HTMLElement).innerText.replace(
                  /([\.,:()\[\]?!;`\~\-\u2013\—&*"'«»%’/])/g,
                  '<span class="punctuation">$1</span>',
                )
              }
            })
            
            // Empty ( ) filter not working
            // this.cleanHtml
            // .querySelectorAll(
            //   '.punctuation, .innerTxt',
            // ).forEach((e) => {
            //   if (e.innerHTML === '(') {
            //   console.log(e.nextElementSibling)
            //     if (e.nextSibling?.parentElement?.innerHTML === ')') {
            //       e.nextSibling?.parentElement?.remove();
            //       e.remove();
            //     }
            //   }
            // })

          this.cleanHtml.body.innerHTML = this.cleanHtml.body.innerHTML
            .replace(/&lt;/g, '')
            .replace(/&gt;/g, '')
            .replace(/(<style.*<\/style>)/g, '')
            .replace(
              /(<span class="punctuation">.<\/span>)|(^|<\/?[^>]+>|\s+)|([^\s<]+)/g,
              '$1$2<span class="innerTxt">$3</span>',
            )
            .replace(
              '<<span class="innerTxt">h1>',
              '<h1><span class="innerTxt">',
            )
            .replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, '')

          this.cleanHtml.querySelectorAll('*:empty, style').forEach((e) => {
            e.remove()
          })

          // Load saved words AND commons words
          let previousWords: string[]
          if (isLoading) {
            previousWords = this.previousGuess.map((data) => {
              return data.guess
            })
          }
          this.articleName = this.articleName
            .map((word) => {
              return word
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .replace(' ', '')
                .replace(')', '')
                .replace(/[_'\(]+/, '')
            })
            .filter((word) => {
              return !commonWords.includes(word)
            })

          // Check if previous guess lead to win
          let hasWon = false
          if (isLoading) {
            this.previousGuess.map((data) => {
              hasWon = this.checkIfWin(data.guess)
            })
            if (hasWon) {
              this.$emit('win')
            }
          }

          this.cleanHtml.querySelectorAll('span.innertxt').forEach((e) => {
            const txt = e.innerHTML
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()

            if (isLoading && previousWords.indexOf(txt) >= 0) {
              this.previousGuess[previousWords.indexOf(txt)]?.list.push(e)
              return
            }
            if (!commonWords.includes(txt) && e.firstElementChild === null) {
              this.baffled.push({
                formatedString: txt,
                e,
                original: e.innerHTML,
              })
              if (!hasWon) {
                e.innerHTML = '█'.repeat(e.innerHTML.length)
              }
            }
          })

          this.$emit('load', this.previousGuess)
          this.$emit('isReady')
          this.isReady = true

          setTimeout(() => {
            while (this.cleanHtml.body.firstChild) {
              document
                .getElementById('content')
                ?.appendChild(this.cleanHtml.body.firstChild)
            }
          })
        })
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    checkIfWin(value: string): boolean {
      this.articleName = this.articleName.filter(
        (articleWord) => articleWord !== value,
      )
      return !this.articleName.length
    },
    emptyHTMLCollection(e: HTMLCollectionOf<HTMLElement>) {
      while (e.length) {
        let parent = e[0].parentNode
        while (e[0].firstChild) {
          parent?.insertBefore(e[0].firstChild, e[0])
        }
        parent?.removeChild(e[0])
      }
      return
    },
  },
})
</script>

<template>
  <div v-if="isReady" id="content" class="mw-parser-output"></div>
</template>

<style scoped>
.mw-parser-output ::v-deep(.highlighted) {
  background-color: #00585e !important;
}

.mw-parser-output ::v-deep(.superHighlighted) {
  background-color: #00becc !important;
  color: #0f0f0f;
}
</style>
