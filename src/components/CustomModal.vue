<script lang="ts">
import { defineComponent } from 'vue'
import { $vfm } from 'vue-final-modal'
import DBService from '@/services/db.service'
import type { UserStats } from '@/model/user-stats.data'

export default defineComponent({
  name: 'CustomModal',
  props: {
    enabled: Boolean,
  },
  data() {
    return {
      db: new DBService('redactus'),
      showModal: false,
      stats: new Array<UserStats>(),
      isReady: false,
    }
  },

  async created() {
    await this.db.createObjectStore(['stats'])
    this.isReady = true
  },
  watch: {
    async enabled() {
      this.showModal = !this.showModal
      this.stats = (await this.db.getAllValue('stats')) as UserStats[]
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
      <span class="modal__title">Statistique</span>
      <div class="modal__content" v-if="isReady">
        <table class="table table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Mot</th>
              <th scope="col">Essais</th>
              <th scope="col">Precision</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in [...stats]" :key="item.number">
              <th scope="col">{{ item.number }}</th>
              <th scope="col">{{ item.word }}</th>
              <th scope="col">{{ item.hits }}</th>
              <th scope="col">{{ item.accuracy }}</th>
            </tr>
          </tbody>
        </table>
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
}
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
