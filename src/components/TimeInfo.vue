<template lang="pug">
  .time-info
    .time
      .hour {{ hours }}
      .minute {{ minutes }}
      .second {{ seconds }}
    .timezone {{ zone }} / {{ city }}
</template>

<script>
  export default {
    props: {
      time: { type: Object, required: true },
      timezone: { type: String, required: true }
    },

    computed: {
      hours() { return this._formatTime(this.time.hours) },
      minutes() { return this._formatTime(this.time.minutes) },
      seconds() { return this._formatTime(this.time.seconds) },
      zone() { return this.timezone.split('/')[0] },
      city() { return this.timezone.split('/')[1] }
    },

    methods: {
      _formatTime(time) {
        return time.toString().padStart(2, 0)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .time-info
    flexCenter()
    fillScreen()

  .time
    display: flex
    font-family: 'Roboto Mono', sans-serif;
    font-size: 5em

    +mobile()
      font-size: 19vw

  .minute
    margin: 0 0.3em

  .timezone
    font-size: 2em
    text-transform: uppercase
    letter-spacing: 0.05em

    +mobile()
      font-size: 7.5vw
</style>
