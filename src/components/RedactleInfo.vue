<script lang="ts">
import { defineComponent } from 'vue'
import { $vfm } from 'vue-final-modal'
import DBService from '@/services/db.service'
import type { UserStats } from '@/model/user-stats.data'

export default defineComponent({
  name: 'CustomModal',
  props: {
    enabled: Boolean,
    yesterdaySolution: String
  },
  data() {
    return {
      showModal: false,
      isReady: false,
    }
  },

  async created() {
    this.isReady = true
  },
  watch: {
    async enabled() {
      this.showModal = !this.showModal
    },
  },
})
</script>

<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="modal-container"
      content-class="modal-content"
    >
      <div class="modal__content" v-if="isReady">
        <h2>Informations</h2>

        <p>
          Bienvenue sur Redactus, la version Française de
          <a href="https://www.redactle.com">Redactle</a>
        </p>
        <p>
          Chaque jours tentez de découvrir le titre de l'article wikipédia qui a
          été obfusqué. Pour ne pas partir de zéro les
          <a>mots communs</a>
          ont déjà été révélés
        </p>
        <p>La solution du redactus de hier était <b>{{yesterdaySolution}}</b></p>
        <br />
        <h2>Comment Jouer</h2>
        <p>
          Pour jouer il suffit de taper un mot dans la barre de recherche, si ce
          mot apparait alors il sera dévoilé dans l'article, vous avez un nombre
          illimité de tentative pour trouver la Solution. Tout vos tentatives
          seront répertoriés dans le menu de gauche.
        </p>
        <br />
        <p>
          Pour gagner il suffit de trouver tout les mots présent dans le titre
          de l'article
        </p>
        <br />
        <h2>Liens Utiles</h2>
        <p>
          Adapté et maintenu par
          <a href="https://www.twitter.com/Drake62610">DrakeLeLionBlanc</a>
        </p>
        <li>
          <a href="https://github.com/Drake62610/Redactle-Fr">GitHub</a>
          Pour ceux qui veulent apporter leurs aide
        </li>
        <li>
          <a href="https://www.twitch.tv/DrakeLeLionBlanc">Twitch</a>
          Pour faire un coucou et echanger directement
        </li>
        <li>
          <a href="https://www.twitter.com/Drake62610">
            Twitter Pour suivre mon "actu"
          </a>
        </li>
        <h2>Astuces</h2>
        <li>
          Chaque tentative doit être un mot unique, les mots composé d'un trait
          d'union sont considéré comme deux mots par rédactus. Par exemple pour
          révéler "passe-droit" il faudra deviner "passe" puis "droit".
        </li>
        <li>Ne vous souciez pas des accents et majuscules.</li>
        <li>
          Pour proposer une astuce, contactez moi via les liens utiles
          ci-dessus.
        </li>
        <br />
        <h2>Mode Twitch</h2>
        <p>
          En activant le mode Twitch il vous faudra juste indiquer votre nom de
          chaine pour permettre à votre Chat de jouer avec vous. Une fois activé
          en utilisant la commande !word votre chat commencera à submit des mots
          dans votre session de Redactus.
        </p>
        <p>
          Pour des raisons de praticité et afin que le streamer ne perdent pas
          la main l'auto surlignage et l'autoscroll des éléments trouvé est
          désactivé. Le streamer devra donc jouer son rôle d'animateur en
          montrant les itterations des différents mots trouvé à son chat.
        </p>
      </div>
    </vue-final-modal>
  </div>
</template>

<style scoped>
::v-deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep(.modal-content) {
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #000000;
  border-radius: 0.25rem;
  background: #212529;
  color: #989898;
  overflow: scroll;
  height: 40rem;
}
p {
  color: white;
}
li {
  color: white;
}
a {
  color: #0dcaf0;
}

@media (min-width: 992px) {
  ::v-deep(.modal-content) {
    margin: 0 12rem;
  }
}

.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
