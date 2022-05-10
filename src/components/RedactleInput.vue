<template>
  <div class="input-group m-3" id="inGrp">
    <button class="btn btn-outline-secondary" type="button" @click="goToTop()">▲ Top</button>
    <input
      type="text"
      class="form-text-lg"
      aria-label="Text input"
      autofocus
      autocomplete="off"
      placeholder="Guess"
      v-model="inputField"
      @keyup.enter="updateInput()"
    />
    <button
      @click="updateInput()"
      class="btn btn-outline-secondary"
      type="button"
    >
      Guess
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { commonWords } from '@/assets/commonWords'

export default defineComponent({
  name: 'RedactleInput',
  data() {
    return {
      inputField: '',
    }
  },
  methods: {
    updateInput() {
      const formatedInput = this.inputField.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()
      if (!commonWords.includes(formatedInput)) {
        this.$emit('update', formatedInput)
      }
      this.inputField = ''
    },
    goToTop() {
        this.$emit('top');
    },
  },
})
</script>
