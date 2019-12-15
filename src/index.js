import App from './app'

const initGame = () => {
  // Instantiate game
  const app = new App()
  app.start()
}

initGame()
document.addEventListener('deviceready', initGame)
