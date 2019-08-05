<template lang="pug">
  #app(:class="{ invert: invertColors }")
    Video(v-if="isMusicStarted" :isVideoVisible="isVideoVisible")

    .overlay.lower(:class="lowerClass" @animationstart="setTime")
      TimeInfo(v-if="currentTime" :time="currentTime" :timezone="timezone")

    .overlay.upper(:class="upperClass" @animationstart="setTime")
      TimeInfo(v-if="currentTime" :time="currentTime" :timezone="timezone")

    Music(v-show="isMusicStarted" :isMusicStarted="isMusicStarted" @tick="tick" @play="onMusicPlay" @pause="onMusicPause")

    .button-wrapper(v-if="!isMusicStarted")
      a.play-button(@click="startMusic") ⯈ Music
</template>

<script>
  import TimeInfo from './TimeInfo'
  import Music from './Music'
  import Video from './Video'
  import randomInt from '../random-int'

  // Because the overlays and video layers go through different cycles and there's only 20 frames before it repeats
  // itself, it's easier to implement it as this table.
  /* eslint-disable array-bracket-spacing */
  const states = [
    // [overlay upper, overlay lower, is video visible]
    ['enter-right', 'show',         false], // 1
    ['exit-top',    'show',         false], // 2
    ['enter-left',  'show',         false], // 3
    ['exit-bottom', 'show',         false], // 4
    ['hide',        'exit-left',    true ], // 5
    ['hide',        'hide',         true ], // 6
    ['hide',        'hide',         true ], // 7
    ['hide',        'hide',         true ], // 8
    ['hide',        'hide',         true ], // 9
    ['hide',        'enter-bottom', true ], // 10
    ['enter-left',  'show',         false], // 11
    ['exit-bottom', 'show',         false], // 12
    ['enter-right', 'show',         false], // 13
    ['exit-top',    'show',         false], // 14
    ['hide',        'exit-right',   true ], // 15
    ['hide',        'hide',         true ], // 16
    ['hide',        'hide',         true ], // 17
    ['hide',        'hide',         true ], // 18
    ['hide',        'hide',         true ], // 19
    ['hide',        'enter-top',    true ]  // 20
  ]
  /* eslint-enable array-bracket-spacing */

  const overlayUpperStates = states.map((x) => x[0])
  const overlayLowerStates = states.map((x) => x[1])
  const isVideoVisible = states.map((x) => x[2])

  let timeInterval

  export default {
    components: { TimeInfo, Music, Video },

    data: () => ({
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currentTime: undefined,
      isMusicStarted: false,
      isMusicPlaying: false,
      invertColors: (randomInt(0, 2) === 1),
      currentState: -1
    }),

    computed: {
      lowerClass() { return overlayLowerStates[this.currentState] },
      upperClass() { return overlayUpperStates[this.currentState] || 'hide' },
      isVideoVisible() { return isVideoVisible[this.currentState] || false }
    },

    watch: {
      isMusicPlaying: {
        immediate: true, // Needed so that the interval starts on page load.
        handler() {
          // If the music is playing, we'll handle the tick updates through the overlay's animationstart.
          if (this.isMusicPlaying) {
            window.clearInterval(timeInterval)
          }
          // If the music isn't playing, we'll update the time using an interval.
          else {
            this.setTime()
            timeInterval = window.setInterval(this.setTime, 1000)
          }
        }
      },

      lowerClass() {
        if (this.lowerClass == 'hide') {
          this.setRandomColor()
        }
      }
    },

    mounted() {
      this.setRandomColor()
    },

    methods: {
      startMusic() {
        this.isMusicStarted = true
      },

      onMusicPlay() {
        this.isMusicPlaying = true
      },

      onMusicPause() {
        this.isMusicPlaying = false
      },

      tick() {
        this.currentState = (this.currentState + 1) % states.length
      },

      setTime() {
        let date = new Date()
        let hours = ((date.getHours() % 12) || 12)
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()

        this.currentTime = { hours, minutes, seconds }
      },

      setRandomColor() {
        let hue = randomInt(0, 360)
        document.documentElement.style.setProperty('--overlay-hue', hue)
      }
    }
  }
</script>

<style lang="stylus">
  transformSpeed = 300ms

  overlayColor(lightness = 70%)
    HSL(var(--overlay-hue) 50% lightness)

  animate(overlayAnimation, timeInfoAnimation)
    animation: overlayAnimation transformSpeed forwards

    .time-info
      animation: timeInfoAnimation transformSpeed forwards

  body
    margin: 0
    font-family: 'Roboto', sans-serif
    user-select: none

  .hide
    display: none

  .music
    position: absolute
    top: 0.5em
    left: 0.5em

  .button-wrapper
    fillScreen()
    flexCenter()
    // This wrapper is only used to position the play button correctly, so make it unselectable so that the element
    // picker in dev tools doesn't pick it up.
    pointer-events: none

  .play-button
    position: relative
    top: 5em
    font-size: 1.5em
    padding: 0.2em 0.8em 0.3em 0.5em
    border: 2px solid overlayColor(50%)
    border-radius: 0.2em
    background-color: overlayColor(70%)
    box-shadow: 2px 2px 5px 0px overlayColor(50%)
    color: white
    text-transform: uppercase
    cursor: pointer
    transition: filter 70ms ease-out
    pointer-events: auto

    &:hover
      filter: brightness(1.1)

    &:active
      filter: brightness(0.9)
      box-shadow: none
      transform: translate(3px, 3px)

  .overlay
    fillScreen()
    overflow: hidden

    &.lower
      background-color: white

      .time-info
        color: overlayColor()

    &.upper
      background: linear-gradient(overlayColor(), overlayColor())
      background-repeat: no-repeat

      .time-info
        color: white

    // Inverted colors, where the lower layer has the upper layer styles and vice versa.
    #app.invert &
      &.upper
        background: white

        .time-info
          color: overlayColor()

      &.lower
        background: linear-gradient(overlayColor(), overlayColor())
        background-repeat: no-repeat

        .time-info
          color: white

    &.enter-left
      animate(enterLeft, enterRight)

    &.enter-right
      animate(enterRight, enterLeft)

    &.enter-top
      animate(enterTop, enterBottom)

    &.enter-bottom
      animate(enterBottom, enterTop)

    &.exit-left
      animate(exitLeft, exitRight)

    &.exit-right
      animate(exitRight, exitLeft)

    &.exit-top
      animate(exitTop, exitBottom)

    &.exit-bottom
      animate(exitBottom, exitTop)

  @keyframes enterLeft
    from { transform: translateX(-100%) }
    to   { transform: translateX(0) }

  @keyframes exitLeft
    from { transform: translateX(0) }
    to   { transform: translateX(-100%) }

  @keyframes enterRight
    from { transform: translateX(100%) }
    to   { transform: translateX(0) }

  @keyframes exitRight
    from { transform: translateX(0) }
    to   { transform: translateX(100%) }

  @keyframes enterTop
    from { transform: translateY(-100%) }
    to   { transform: translateY(0) }

  @keyframes exitTop
    from { transform: translateY(0) }
    to   { transform: translateY(-100%) }

  @keyframes enterBottom
    from { transform: translateY(100%) }
    to   { transform: translateY(0) }

  @keyframes exitBottom
    from { transform: translateY(0) }
    to   { transform: translateY(100%) }
</style>
