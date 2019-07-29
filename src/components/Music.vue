<template lang="pug">
  .music
    iframe.soundcloud(ref="soundcloud" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/214788168")
</template>

<script>
  export default {
    props: {
      isMusicStarted: { type: Boolean, required: true }
    },

    data: () => ({
      widget: undefined
    }),

    watch: {
      isMusicStarted() {
        if (this.isMusicStarted) { this.widget.play() }
      }
    },

    mounted() {
      // The music will play a tick sound every second, but there's a slight offset that we need to account for.
      let tickOffset = 350
      // Start the last position as -1000 so that the first second of the music will trigger a tick.
      let lastPosition = -1000
      // This allows the soundcloud iframe to be controlled cross-domain:
      // https://developers.soundcloud.com/docs/api/html5-widget#api
      let widget = SC.Widget(this.$refs.soundcloud)
      this.widget = widget

      widget.bind(SC.Widget.Events.PLAY_PROGRESS, (progress) => {
        // We'll treat every second the music plays as a 'block'. Once the tick offset has been reached per block, we'll
        // fire tick event, then wait for the next block.
        let subPosition = progress.currentPosition % 1000
        let isOnNextBlock = (progress.currentPosition - lastPosition) >= 1000

        if (isOnNextBlock && (subPosition >= tickOffset)) {
          this.$emit('tick')
          // Save the start position of the current block, i.e. if we're on 24438ms, save the position as 24000ms.
          lastPosition = progress.currentPosition - subPosition
        }
      })

      widget.bind(SC.Widget.Events.PLAY, () => this.$emit('play'))
      widget.bind(SC.Widget.Events.PAUSE, () => this.$emit('pause'))

      // Update the last position to the current position of the seek. Without this, seeking to a previous position will
      // break the tick logic.
      widget.bind(SC.Widget.Events.SEEK, (progress) => {
        lastPosition = progress.currentPosition - (progress.currentPosition % 1000)
      })

      // There's no built-in looping feature, so we'll just restart the audio through code.
      widget.bind(SC.Widget.Events.FINISH, () => {
        widget.play()
        lastPosition = -1000
      })
    }
  }
</script>

<style lang="stylus" scoped>
  .music
    width: 250px
    height: 125px

    &:hover .soundcloud
      fill()

  .soundcloud
    border: none
    // Force the SoundCloud iframe to only show the play/pause button.
    width: 20px
    height: 20px
    transition: width 100ms ease-out, height 100ms ease-out
    will-change: transform
</style>
