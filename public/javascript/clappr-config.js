const playerElement = document.getElementById('player-wrapper')

const player = new Clappr.Player({
  source: 'https://avnaweb.s3-sa-east-1.amazonaws.com/Ensaio_Lenine_22_Final/Ensaio_Lenine_22_Final.m3u8',
  poster: 'http://clappr.io/poster.png',
  plugins: [
    window.LevelSelector
  ],
})

player.attachTo(playerElement)
