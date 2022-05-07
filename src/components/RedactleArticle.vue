<script lang="ts">
import axios from 'axios'
import { commonWords } from '@/assets/commonWords'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    guess: String,
  },
  data() {
    return {
      text: JSON,
      isReady: false,
      cleanHtml: new Document(),
      cipheredHtml: new Document(),
      articleName: '',
      baffled: new Array<{ txt: string; e: Element }>(),
    }
  },
  watch: {
    guess(value) {
      let count = 0
      if (this.baffled) {
        this.baffled
          .filter((baffle) => {
            return baffle.txt === value
          })
          .forEach((matchGuess) => {
            matchGuess.e.innerHTML = value
            count++
          })
        console.log('emit event');
        console.log({ guess: value, count });
        this.$emit('update', { guess: value, count });
      }
    },
  },
  async created() {
    try {
      this.articleName = 'Yakuza'
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
          let seeAlso: (ParentNode | null | undefined)[] = []
          if (this.cleanHtml.getElementById('Liens_externes')?.parentNode) {
            seeAlso.push(
              this.cleanHtml.getElementById('Liens_externes')?.parentNode,
            )
          }

          if (
            this.cleanHtml.getElementById('Notes_et_r.C3.A9f.C3.A9rences')
              ?.parentNode
          ) {
            seeAlso.push(
              this.cleanHtml.getElementById('Notes_et_r.C3.A9f.C3.A9rences')
                ?.parentNode,
            )
          }

          if (this.cleanHtml.getElementById('Bibliographie')?.parentNode) {
            seeAlso.push(
              this.cleanHtml.getElementById('Bibliographie')?.parentNode,
            )
          }

          seeAlso.forEach((seeing) => {
            var e = this.cleanHtml.getElementsByClassName('mw-parser-output')
            if (seeing?.parentNode?.children) {
              let alsoIndex = Array.prototype.indexOf.call(
                seeing?.parentNode?.children,
                seeing,
              )
              for (var i = alsoIndex; i < e[0].children.length; i++) {
                e[0].removeChild(e[0].children[i])
              }
            }
          })

          // Remove unused elements
          this.cleanHtml
            .querySelectorAll(
              "#bandeau-portail, [rel='mw-deduplicated-inline-style'], [title='Name at birth'], [aria-labelledby='micro-periodic-table-title'], .barbox, .wikitable, .clade, .Expand_section, .nowrap, .IPA, .thumb, .mw-empty-elt, .mw-editsection, .nounderlines, .nomobile, .searchaux, #toc, .sidebar, .sistersitebox, .noexcerpt, #External_links, #Further_reading, .hatnote, .haudio, .portalbox, .mw-references-wrap, .infobox, .unsolved, .navbox, .metadata, .refbegin, .reflist, .mw-stack, #Notes, #References, .reference, .quotebox, .collapsible, .uncollapsed, .mw-collapsible, .mw-made-collapsible, .mbox-small, .mbox, #coordinates, .succession-box, .noprint, .mwe-math-element, .cs1-ws-icon",
            )
            .forEach((e) => {
              e.remove()
            })

          // Handle bold
          var b = this.cleanHtml.getElementsByTagName('b')
          while (b.length) {
            var parent = b[0].parentNode
            while (b[0].firstChild) {
              parent?.insertBefore(b[0].firstChild, b[0])
            }
            parent?.removeChild(b[0])
          }

          // // Handle links
          var a = this.cleanHtml.getElementsByTagName('a')
          while (a.length) {
            var parent = a[0].parentNode
            while (a[0].firstChild) {
              parent?.insertBefore(a[0].firstChild, a[0])
            }
            parent?.removeChild(a[0])
          }

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
            .querySelectorAll('p, blockquote, h1, h2, table, li, i, cite, span')
            .forEach((e) => {
              e.innerHTML = e.innerHTML.replace(
                /([\.,:()\[\]?!;`\~\-\u2013\—&*"])/g,
                '<span class="punctuation">$1</span>',
              )
              // e.children.forEach((child) => {

              // }
              // console.log(e)
              // console.log(.nodeType);
              // filter((node) => {
              //   console.log(node)
              //   console.log(node.nodeName)
              //   console.log(node.nodeType)
              //   return node.nodeType === 3
              // }
              // )
              // .forEach((filteredNode) => {
              //   if (filteredNode.textContent) {
              //     var replaced = filteredNode.textContent.replace(
              //       /([\.,:()\[\]?!;`\~\-\u2013\—&*"])/g,
              //       '<span class="punctuation">$1</span>',
              //     )
              //     filteredNode.replaceWith(replaced)
              //     console.log(replaced)
              //   }
              // })
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

          this.cleanHtml.querySelectorAll('*:empty, style').forEach((e) => {
            e.remove()
          })
          this.cleanHtml.querySelectorAll('span.innertxt').forEach((e) => {
            const txt = e.innerHTML
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()
            if (!commonWords.includes(txt) && e.firstElementChild === null) {
              e.innerHTML = '█'.repeat(e.innerHTML.length)

              this.baffled.push({ txt, e })
            }
          })

          // console.log(this.baffled[0]);

          // if (guessedWords.length > 0) {
          //   for (var i = 0; i < guessedWords.length; i++) {
          //     guessCounter += 1
          //     PerformGuess(guessedWords[i][0], true)
          //   }
          // }

          // if (pluralizing) {
          //   document.getElementById('autoPlural').checked = true
          // } else {
          //   document.getElementById('autoPlural').checked = false
          // }

          // if (hidingZero) {
          //   document.getElementById('hideZero').checked = true
          //   HideZero()
          // } else {
          //   document.getElementById('hideZero').checked = false
          //   ShowZero()
          // }

          // if (redactleIndex > 0) {
          //   document.getElementById(
          //     'yesterday',
          //   ).innerHTML = `The answer to yesterday's Redactle was: ${atob(
          //     yesterday,
          //   )
          //     .replace(/ *\([^)]*\) */g, '')
          //     .normalize('NFD')
          //     .replace(/[\u0300-\u036f]/g, '')
          //     .replace(/_/g, ' ')
          //     .toLowerCase()}`
          // }

          // wikiHolder.style.display = 'flex'
          this.isReady = true
        })
    } catch (error) {
      console.log(error)
    }
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

<style scoped></style>
