<template lang="pug">
  .video-wrapper
    video.video(:src="videoUrl" ref="video" preload="auto" loop)
</template>

<script>
  import randomInt from '../random-int'

  const apiKey = 'dc6zaTOxFJmzC'
  const pageSize = 25
  const query = 'unexpected funny'
  const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&limit=${pageSize}&q=${query}&rating=pg`

  export default {
    props: {
      isVideoVisible: { type: Boolean, required: true }
    },

    data: () => ({
      videoQueue: [],
      total: 10000, // Start with 10,000 and update this once we get the Giphy response.
      offset: 0
    }),

    computed: {
      videoUrl() {
        return this.videoQueue[0]
      },

      totalPages() {
        return Math.floor(this.total / pageSize)
      }
    },

    watch: {
      'videoQueue.length': {
        immediate: true,
        handler(newLength) {
          if (newLength <= 0) {
            this.getNewVideos()
          }
        }
      },

      isVideoVisible() {
        if (this.isVideoVisible) {
          this.$refs.video.play()
        }
        else {
          this.$refs.video.pause()
          this.videoQueue.shift() // We're done playing the current video, remove it.
        }
      }
    },

    methods: {
      getNewVideos() {
        // Maximum offset the Giphy API supports is 4999: https://github.com/Giphy/GiphyAPI/issues/88
        this.offset = Math.min(randomInt(0, this.totalPages), 4999)

        fetch(apiUrl + `&offset=${this.offset}`).then(async (response) => {
          let result = await response.json()
          let urls = result.data.map((x) => x.images.original_mp4.mp4)

          this.total = result.pagination.total_count
          this.videoQueue = urls
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .video-wrapper
    fillScreen()
    background-color: black

  .video
    fill()
</style>
