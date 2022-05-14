<template>
  <div class="container container-lg" id="winText" style="display: block;">
    <h3>Congratulations, you solved Redactle #38!</h3>
    <ul>
      <li>The answer was: abraham</li>
      <li>You solved it in 1 guesses</li>
      <li>Your accuracy was 100.00%</li>
      <li>You have solved 1 consecutive Redactles</li>
    </ul>
    <h3>Global Stats</h3>
    <!-- <ul>
      <li>Globally, 5909 players have solved today's Redactle so far</li>
      <li>Global Median: 73.00 Guesses; 60.58% Accuracy</li>
      <li>Global Average: 92.04 Guesses; 61.37% Accuracy</li>
    </ul> -->
    <p><a @click="shareResults()">Share your results</a></p>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    redactusNumber: String,
    redactusSolution: String,
    name: String,
  },
})
</script>
