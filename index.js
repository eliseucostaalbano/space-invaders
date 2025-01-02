const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Jogador {
    constructor() {
        this.position = {
            x: 200,
            y: 200
        }

        this.velocidade = {
            x: 0,
            y: 0
        }

        // this.image=
        this.width = 100
        this.height = 100
    }

    desenhar() {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const jogador = new Jogador
jogador.desenhar()