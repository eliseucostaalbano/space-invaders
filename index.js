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
            this.posiçao = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }

    }

    desenhar() {
        // ctx.fillStyle = 'red'
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

        ctx.save()
        ctx.translate(jogador.posiçao.x + jogador.width / 2, jogador.posiçao.y + jogador.height / 2)
        ctx.rotate(this.rotaçao)
        ctx.translate(-jogador.posiçao.x - jogador.width / 2, -jogador.posiçao.y - jogador.height / 2)
        ctx.drawImage(this.image, this.posiçao.x, this.posiçao.y, this.width, this.height)
        ctx.restore()
    }

    update() {
        if (this.image) {
            this.desenhar()
            this.posiçao.x += this.velocidade.x
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

class Invasor {
    constructor({ posiçao }) {
        this.velocidade = {
            x: 0,
            y: 0
        }

        const imagem = new Image()
        imagem.src = './images/invader.png'
        imagem.onload = () => {
            const escala = 1
            this.image = imagem
            this.width = imagem.width * escala
            this.height = imagem.height * escala
            this.posiçao = {
                x: posiçao.x,
                y: posiçao.y
            }
        }

    }

    desenhar() {
        // ctx.fillStyle = 'red'
        // ctx.fillRect(this.posição.x, this.posiçao.y, this.width, this.height)

        ctx.drawImage(this.image, this.posiçao.x, this.posiçao.y, this.width, this.height)
    }

    update({ velo }) {
        if (this.image) {
            this.desenhar()
            this.posiçao.x += velo.x
            this.posiçao.y += velo.y
        }

    }
}

class Grid {
    constructor() {
        this.posiçao = {
            x: 0,
            y: 0
        }

        this.velocidade = {
            x: 4,
            y: 0
        }

        this.invasores = []
        const columns = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width = columns * 30

        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                this.invasores.push(new Invasor({
                    posiçao: {
                        x: i * 30,
                        y: j * 30
                    }
                })
                )
            }
        }
        console.log(this.invasores)
    }

    update() {
        this.posiçao.x += this.velocidade.x
        this.posiçao.y += this.velocidade.y
        this.velocidade.y = 0

        if (this.posiçao.x + this.width >= canvas.width || this.posiçao.x <= 0) {
            this.velocidade.x = -this.velocidade.x
            this.velocidade.y = 30
        }
    }
}

const jogador = new Jogador()
const projeteis = []
const grids = []
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

let frames = 0
let intervaloAleatorio = Math.floor(Math.random() * 500 + 500)


function animar() {
    requestAnimationFrame(animar)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    jogador.update()
    projeteis.forEach((projetil, index) => {
        if (projetil.posiçao.y + projetil.radius <= 0) {
            setTimeout(() => {
                projeteis.splice(index, 1)
            }, 0)
        } else {
            projetil.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()
        grid.invasores.forEach((invasor, i) => {
            invasor.update({ velo: grid.velocidade })

            projeteis.forEach((projetil, j) => {
                if (projetil.posiçao.y - projetil.radius <= invasor.posiçao.y + invasor.height
                    && projetil.posiçao.x + projetil.radius >= invasor.posiçao.x
                    && projetil.posiçao.x - projetil.radius <= invasor.posiçao.x + invasor.width
                    && projetil.posiçao.y + projetil.radius >= invasor.posiçao.y) {
                    setTimeout(() => {
                        const invasorEncontrado = grid.invasores.find(invasor2 => invasor2 === invasor
                        )

                        const projetilEncontrado = projeteis.find(projetil2 => projetil2 === projetil
                        )

                        if (invasorEncontrado && projetilEncontrado) {
                            grid.invasores.splice(i, 1)
                            projeteis.splice(j, 1)
                        }
                       
                    if (grid.invasores.length > 0) {
                        const primeiroInvasor = grid.invasores[0]
                        const ultimoInvasor = grid.invasores[grid.invasores.length - 1]

                        grid.width = ultimoInvasor.posiçao.x - primeiroInvasor.posiçao.x + 30
                        grid.posiçao.x = primeiroInvasor.posiçao.x
                    }else{
                         grid.splice(gridIndex, 1)
                    }

                    }, 0)
                }
            })
        })
    })

    if (setas.ArrowLeft.pressed && jogador.posiçao.x >= 0) {
        jogador.velocidade.x = -7
        jogador.rotaçao = -0.15
    } else if (setas.ArrowRight.pressed && jogador.posiçao.x + jogador.width <= canvas.width) {
        jogador.velocidade.x = 7
        jogador.rotaçao = 0.15
    } else {
        jogador.velocidade.x = 0
        jogador.rotaçao = 0
    }

    if (frames % intervaloAleatorio === 0) {
        grids.push(new Grid())
        intervaloAleatorio = Math.floor(Math.random() * 500 + 500)
        frames = 0
    }

    frames++
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
                        x: jogador.posiçao.x + jogador.width / 2,
                        y: jogador.posiçao.y
                    },
                    velocidade: {
                        x: 0,
                        y: -9
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
