<template>
  <div class="input-group m-3" id="inGrp">
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
      if (!commonWords.includes(this.inputField)) {
        this.$emit('update', this.inputField)
      }
      this.inputField = ''
    },
  },
})
</script>
