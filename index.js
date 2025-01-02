const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Jogador {
    constructor() {
        

        this.velocidade = {
            x: 0,
            y: 0
        }

        const imagem = new Image()
        imagem.src = './images/spaceship.png'
        imagem.onload = () => {
            const escala = 0.15
            this.image = imagem
            this.width = imagem.width * escala
            this.height = imagem.height * escala
            this.position = {
            x: canvas.width / 2 - this.width/ 2 ,
            y: canvas.height - this.height- 20
        }
        }

    }

    desenhar() {
        // ctx.fillStyle = 'red'
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        if (this.image) {
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        }

    }
}

const jogador = new Jogador()


function animar() {
    requestAnimationFrame(animar)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    jogador.desenhar()
}

animar()