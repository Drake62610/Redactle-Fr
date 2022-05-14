<script lang="ts">
import axios from 'axios'
import { commonWords } from '@/assets/commonWords'
import { defineComponent } from 'vue'

type Guess = {
  guess: string
  count: number
  list: Element[]
}

export default defineComponent({
  props: {
    guess: String,
    focus: String,
    name: String
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
      this.articleName = this.articleName.filter(
        (articleWord) => articleWord !== value,
      )
      const hasWon = !this.articleName.length

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
        // [...document.getElementsByClassName('innerTxt')]
        // .forEach((element) => {
        //   console.log(element);
        //   element.classList.add("highlighted");
        // })
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
    let isLoading = false
    // Local Storage
    if (localStorage.getItem('guesses')) {
      this.previousGuess = JSON.parse(localStorage.getItem('guesses') as string)
      this.previousGuess.forEach((e) => {
        e.list = []
      })
      isLoading = true
    }

    try {
      if (!this.name) {
        throw Error("Article Name not found");
      }
      this.articleName = this.name.replace('%27', "'")
      .split(/[_']+/);

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

          // Remove Annexe
          this.cleanHtml
            .querySelector('#Articles_connexes')
            ?.parentElement?.nextElementSibling?.remove()
          this.cleanHtml
            .querySelector('#Liens_externes')
            ?.parentElement?.nextElementSibling?.remove()
          this.cleanHtml
            .querySelector('#Galerie')
            ?.parentElement?.nextElementSibling?.remove()
          this.cleanHtml
            .querySelector('#Notes_et_références')
            ?.parentElement?.nextElementSibling?.remove()
          this.cleanHtml
            .querySelector('#Bibliographie')
            ?.parentElement?.nextElementSibling?.remove()
          this.cleanHtml
            .querySelector('#Références')
            ?.parentElement?.nextElementSibling?.remove()

          //Handle times before deleting .nowrap classes
          this.cleanHtml.querySelectorAll('time').forEach((e) => {
            var newTag = document.createTextNode(e.innerText)
            if (e.firstChild) {
              e.parentNode?.replaceChild(newTag, e)
            }
          })

          this.cleanHtml
            .querySelectorAll(
              ".reference-cadre, #Références, #Galerie, #Annexes, #Bibliographie, #Notes_et_références, #Articles_connexes, #Liens_externes, .nowrap, #bandeau-portail, [rel='mw-deduplicated-inline-style'], [title='Name at birth'], [aria-labelledby='micro-periodic-table-title'], .barbox, .wikitable, .clade, .Expand_section, .IPA, .thumb, .mw-empty-elt, .mw-editsection, .nounderlines, .nomobile, .searchaux, #toc, .sidebar, .sistersitebox, .noexcerpt, #External_links, #Further_reading, .hatnote, .haudio, .portalbox, .mw-references-wrap, .infobox, .unsolved, .navbox, .metadata, .refbegin, .reflist, .mw-stack, #Notes, #References, .reference, .quotebox, .collapsible, .uncollapsed, .mw-collapsible, .mw-made-collapsible, .mbox-small, .mbox, #coordinates, .succession-box, .noprint, .mwe-math-element, .cs1-ws-icon",
            )
            .forEach((e) => {
              e.remove()
            })

          // Handle anchors
          this.emptyHTMLCollection(this.cleanHtml.getElementsByTagName('a'))
          this.emptyHTMLCollection(this.cleanHtml.getElementsByTagName('i'))
          this.emptyHTMLCollection(this.cleanHtml.getElementsByTagName('b'))
          this.emptyHTMLCollection(this.cleanHtml.getElementsByTagName('abbr'))
          this.emptyHTMLCollection(this.cleanHtml.getElementsByTagName('sub'))

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
          var titleTxt = this.articleName.join(' ')
          titleHolder.innerHTML = titleTxt
          this.cleanHtml.body.prepend(titleHolder)
          let ansStr = titleTxt
            .replace(/ *\([^)]*\) */g, '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
          let ans = ansStr.match(/\b(\w+)\b/g)
          if (ans) {
            ans = ans.filter((el) => {
              return commonWords.indexOf(el) < 0
            })
          }

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
          ;[
            ...this.cleanHtml.querySelectorAll(
              'p, blockquote, h1, h2, h3, table, li, i, cite, span',
            ),
          ].forEach((e) => {
            if (e.firstChild) {
            }
            e.innerHTML = e.innerHTML.replace(
              /([\.,:()\[\]?!;`\~\-\u2013\—&*"'«»%’/])/g,
              '<span class="punctuation">$1</span>',
            )
          }),
            (this.cleanHtml.body.innerHTML = this.cleanHtml.body.innerHTML
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
              .replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, ''))

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
              e.innerHTML = '█'.repeat(e.innerHTML.length)
            }
          })

          this.articleName = this.articleName.map((word) => {
            return word
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()
              .replace('_', '')
              .replace(' ', '')
          })

          this.$emit('load', this.previousGuess)
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
