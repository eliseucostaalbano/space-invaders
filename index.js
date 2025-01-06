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

        this.rotaçao = 0

        const imagem = new Image()
        imagem.src = './images/spaceship.png'
        imagem.onload = () => {
            const escala = 0.15
            this.image = imagem
            this.width = imagem.width * escala
            this.height = imagem.height * escala
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }

    }

    desenhar() {
        // ctx.fillStyle = 'red'
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

        ctx.save()
        ctx.translate(jogador.position.x + jogador.width / 2, jogador.position.y + jogador.height / 2)
        ctx.rotate(this.rotaçao)
        ctx.translate(-jogador.position.x - jogador.width / 2, -jogador.position.y - jogador.height / 2)
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        ctx.restore()
    }

    update() {
        if (this.image) {
            this.desenhar()
            this.position.x += this.velocidade.x
        }

    }
}

class Projetil {
    constructor({ posiçao, velocidade }) {
        this.posiçao = posiçao
        this.velocidade = velocidade
        this.radius = 4
    }

    desenhar() {
        ctx.beginPath()
        ctx.arc(this.posiçao.x, this.posiçao.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.closePath()
    }

    update() {
        this.desenhar()
        this.posiçao.x += this.velocidade.x
        this.posiçao.y += this.velocidade.y
    }
}

const jogador = new Jogador()
const projeteis = []
const setas = {
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

function animar() {
    requestAnimationFrame(animar)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    jogador.update()
    projeteis.forEach((projetil, index) => {
        if (projetil.posiçao.y + projetil.radius <=0 ) {
            setTimeout(()=>{
             projeteis.splice(index, 1)   
            }, 0)
        } else {
         projetil.update()
        }
    })
    if (setas.ArrowLeft.pressed && jogador.position.x >= 0) {
        jogador.velocidade.x = -7
        jogador.rotaçao = -0.15
    } else if (setas.ArrowRight.pressed && jogador.position.x + jogador.width <= canvas.width) {
        jogador.velocidade.x = 7
        jogador.rotaçao = 0.15
    } else {
        jogador.velocidade.x = 0
        jogador.rotaçao = 0
    }
}

animar()

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'ArrowLeft':
            setas.ArrowLeft.pressed = true
            break;
        case 'ArrowRight':
            setas.ArrowRight.pressed = true
            break;
        case ' ':
            setas.space.pressed = true
            projeteis.push(
                new Projetil({
                    posiçao: {
                        x: jogador.position.x + jogador.width /2,
                        y: jogador.position.y
                    },
                    velocidade: {
                        x: 0,
                        y: -5
                    }
                })
            )
            break;
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'ArrowLeft':
            setas.ArrowLeft.pressed = false
            break;
        case 'ArrowRight':
            setas.ArrowRight.pressed = false
            break;
    }
})
