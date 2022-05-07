<template>
  <div class="input-group m-3" id="inGrp">
    <!-- <button class="btn btn-outline-secondary" type="button" id="backToTop">
      &#9650; Top
    </button> -->
    <input
      type="text"
      class="form-text-lg"
      aria-label="Text input"
      autofocus
      autocomplete="off"
      placeholder="Guess"
      v-model="inputField"
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
export default {
  name: 'RedactleInput',
  data() {
    return {
      inputField: '',
    }
  },
  methods: {
    updateInput() {
      console.log(this.inputField);
      this.$emit("update", this.inputField);
    },
  },
}
</script>
