const placarEl = document.querySelector('#placarEl')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

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

class Particula {
    constructor({ posiçao, velocidade, radius, cor }) {
        this.posiçao = posiçao
        this.velocidade = velocidade
        this.radius = radius
        this.cor = cor
        this.opacidade = 1
    }

    desenhar() {
        ctx.save()
        ctx.globalAlpha = this.opacidade
        ctx.beginPath()
        ctx.arc(this.posiçao.x, this.posiçao.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.cor
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }

    update() {
        this.desenhar()
        this.posiçao.x += this.velocidade.x
        this.posiçao.y += this.velocidade.y
        this.opacidade -= 0.01
    }
}

class ProjetilInvasor {
    constructor({ posiçao, velocidade }) {
        this.posiçao = posiçao
        this.velocidade = velocidade
        this.width = 3
        this.height = 10
    }

    desenhar() {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.posiçao.x, this.posiçao.y, this.width, this.height)
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

    update({ velocidade }) {
        if (this.image) {
            this.desenhar()
            this.posiçao.x += velocidade.x
            this.posiçao.y += velocidade.y
        }

    }

    atirar(projeteisInvasor) {
        projeteisInvasor.push(new ProjetilInvasor({
            posiçao: {
                x: this.posiçao.x + this.width / 2,
                y: this.posiçao.y + this.height
            },
            velocidade: {
                x: 0,
                y: 10
            }
        }))
    }
}

class Grid {
    constructor() {
        this.posiçao = {
            x: 0,
            y: 0
        }

        this.velocidade = {
            x: 5,
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
const projeteisInvasor = []
const particulas = []

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
let placar = 0

function criarParticulas({ object, cor }) {
    for (let i = 0; i < 20; i++) {
        particulas.push(new Particula({
            posiçao: {
                x: object.posiçao.x + object.width / 2,
                y: object.posiçao.y + object.height / 2
            },
            velocidade: {
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 3
            },
            radius: Math.random() * 3,
            cor: cor || '#BAA0DE'
        }
        ))

    }
}

function animar() {
    requestAnimationFrame(animar)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    jogador.update()
    particulas.forEach((particula, i) => {
        if (particula.opacidade <= 0) {
            setTimeout(() => {
                particulas.splice(i, 1)
            }, 0);
        } else {
            particula.update()
        }

    });
    projeteisInvasor.forEach((projetilInvasor, index) => {
        if (projetilInvasor.posiçao.y + projetilInvasor.height >= canvas.height) {
            setTimeout(() => {
                projeteisInvasor.splice(index, 1)
            }, 0)
        } else {
            projetilInvasor.update()
        }

        if (projetilInvasor.posiçao.y + projetilInvasor.height >= jogador.posiçao.y
            && projetilInvasor.posiçao.x + projetilInvasor.width >= jogador.posiçao.x
            && projetilInvasor.posiçao.x <= jogador.posiçao.x + jogador.width) {
            setTimeout(() => {
                projeteisInvasor.splice(index, 1)
            }, 0)
            criarParticulas({
                object: jogador,
                cor: 'red'
            })
        }
    })
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
        if (frames % 100 === 0 && grid.invasores.length > 0) {
            grid.invasores[Math.floor(Math.random() * grid.invasores.length)].atirar(projeteisInvasor)
        }
        grid.invasores.forEach((invasor, i) => {
            invasor.update({ velocidade: grid.velocidade })

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
                            placar += 100
                            placarEl.innerHTML = placar
                            criarParticulas({
                                object: invasor
                            })

                            grid.invasores.splice(i, 1)
                            projeteis.splice(j, 1)
                        }

                        if (grid.invasores.length > 0) {
                            const primeiroInvasor = grid.invasores[0]
                            const ultimoInvasor = grid.invasores[grid.invasores.length - 1]

                            grid.width = ultimoInvasor.posiçao.x - primeiroInvasor.posiçao.x + 30
                            grid.posiçao.x = primeiroInvasor.posiçao.x
                        } else {
                            grid.splice(gridIndex, 1)
                        }

                    }, 0)
                }
            })
        })
    })

    if (setas.ArrowLeft.pressed && jogador.posiçao.x >= 0) {
        jogador.velocidade.x = -10
        jogador.rotaçao = -0.15
    } else if (setas.ArrowRight.pressed && jogador.posiçao.x + jogador.width <= canvas.width) {
        jogador.velocidade.x = 10
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
                        y: -15
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
