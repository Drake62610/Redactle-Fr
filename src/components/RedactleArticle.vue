<script lang="ts">
import axios from 'axios'
import { commonWords } from '@/assets/commonWords'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    guess: String,
    focus: String,
  },
  data() {
    return {
      text: JSON,
      isReady: false,
      cleanHtml: new Document(),
      articleName: '',
      currentHighlighted: '',
      baffled: new Array<{
        formatedString: string
        e: Element
        original: string
      }>(),
    }
  },
  watch: {
    guess(value) {
      let count = 0
      const hasWon = value === this.articleName
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
          })
        // [...document.getElementsByClassName('innerTxt')]
        // .forEach((element) => {
        //   console.log(element);
        //   element.classList.add("highlighted");
        // })
        this.$emit('update', { guess: value, count })
      }
    },
    focus(value) {
      if (this.baffled) {
        if (value === this.articleName) {
          return;
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
    try {
      this.articleName = 'Manga'
      await axios
        .get<{ parse: { text: string } }>(
          `https://fr.wikipedia.org/w/api.php?action=parse&format=json&page=${this.articleName}&prop=text&formatversion=2&origin=*`,
        )
        .then((res) => {
          if (res.status !== 200) {
            throw `Server error: [${res.status}] [${res.statusText}] [${res.request}]`
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

          //Remove References
          // let seeAlso: (ParentNode | null | undefined)[] = []
          // if (this.cleanHtml.getElementById('Liens_externes')?.parentNode) {
          //   seeAlso.push(
          //     this.cleanHtml.getElementById('Liens_externes')?.parentNode,
          //   )
          // }

          // if (
          //   this.cleanHtml.getElementById('Notes_et_r.C3.A9f.C3.A9rences')
          //     ?.parentNode
          // ) {
          //   seeAlso.push(
          //     this.cleanHtml.getElementById('Notes_et_r.C3.A9f.C3.A9rences')
          //       ?.parentNode,
          //   )
          // }

          // if (this.cleanHtml.getElementById('Bibliographie')?.parentNode) {
          //   seeAlso.push(
          //     this.cleanHtml.getElementById('Bibliographie')?.parentNode,
          //   )
          // }

          // seeAlso.forEach((seeing) => {
          //   var e = this.cleanHtml.getElementsByClassName('mw-parser-output')
          //   if (seeing?.parentNode?.children) {
          //     let alsoIndex = Array.prototype.indexOf.call(
          //       seeing?.parentNode?.children,
          //       seeing,
          //     )
          //     for (var i = alsoIndex; i < e[0].children.length; i++) {
          //       e[0].removeChild(e[0].children[i])
          //     }
          //   }
          // })

          this.cleanHtml.querySelectorAll('time').forEach((e) => {
            // if (e.getAttribute('datetime') === null) {
            //   console.log(e.parentNode?.firstChild)
            // }
            const replace = new Date(
              (e.getAttribute('datetime')
                ? e.getAttribute('datetime')
                : '') as string,
            )
            var newTag = document.createTextNode(
              replace.toLocaleDateString('fr-FR'),
            )
            if (e.firstChild) {
              e.parentNode?.replaceChild(newTag, e)
            }
          })

          // Remove unused elements
          this.cleanHtml
            .querySelectorAll(
              ".nowrap, #bandeau-portail, [rel='mw-deduplicated-inline-style'], [title='Name at birth'], [aria-labelledby='micro-periodic-table-title'], .barbox, .wikitable, .clade, .Expand_section, .IPA, .thumb, .mw-empty-elt, .mw-editsection, .nounderlines, .nomobile, .searchaux, #toc, .sidebar, .sistersitebox, .noexcerpt, #External_links, #Further_reading, .hatnote, .haudio, .portalbox, .mw-references-wrap, .infobox, .unsolved, .navbox, .metadata, .refbegin, .reflist, .mw-stack, #Notes, #References, .reference, .quotebox, .collapsible, .uncollapsed, .mw-collapsible, .mw-made-collapsible, .mbox-small, .mbox, #coordinates, .succession-box, .noprint, .mwe-math-element, .cs1-ws-icon",
            )
            .forEach((e) => {
              e.remove()
            })

          // Handle anchors
          this.emptyHTMLCollection(this.cleanHtml.getElementsByTagName('a'))
          this.emptyHTMLCollection(this.cleanHtml.getElementsByTagName('i'))
          this.emptyHTMLCollection(this.cleanHtml.getElementsByTagName('b'))
          this.emptyHTMLCollection(this.cleanHtml.getElementsByTagName('abbr'))

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
          var titleTxt = this.articleName.replace(/_/g, ' ')
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
          this.cleanHtml
            .querySelectorAll(
              'p, blockquote, h1, h2, h3, table, li, i, cite, span',
            )
            .forEach((e) => {
              e.innerHTML = e.innerHTML.replace(
                /([\.,:()\[\]?!;`\~\-\u2013\—&*"'’/])/g,
                '<span class="punctuation">$1</span>',
              )
            }),
            (this.cleanHtml.body.innerHTML = this.cleanHtml.body.innerHTML
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
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

          // this.cleanHtml.querySelectorAll('span.innertxt').forEach((e) => {
          //   console.log(e.innerHTML);
          //   e.innerHTML = e.innerHTML
          //     .replace(/['"]+/g, '</span><span class="punctuation">\'</span><span class="innertxt"');
          // });
          this.cleanHtml.querySelectorAll('*:empty, style').forEach((e) => {
            e.remove()
          })
          this.cleanHtml.querySelectorAll('span.innertxt').forEach((e) => {
            const txt = e.innerHTML
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()
            if (!commonWords.includes(txt) && e.firstElementChild === null) {
              this.baffled.push({
                formatedString: txt,
                e,
                original: e.innerHTML,
              })
              e.innerHTML = '█'.repeat(e.innerHTML.length)
            }
          })

          // Format article name /!\ works only with one-word article name
          this.articleName = this.articleName
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
          this.isReady = true
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
  <div
    v-if="isReady"
    class="mw-parser-output"
    v-html="cleanHtml.body.innerHTML"
  ></div>
</template>

<style scoped>
.mw-parser-output >>> .highlighted {
  background-color: #00585e !important;
}

.mw-parser-output >>> .superHighlighted {
  background-color: #00becc !important;
  color: #0f0f0f;
}
</style>
