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
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        

    }

  update(){
    if(this.image){
    this.desenhar()
    this.position.x += this.velocidade.x
    }
    
  }
}

const jogador = new Jogador()
const setas = {
    ArrowLeft: {
        pressed : false
    },
    ArrowRight: {
        pressed : false
    },
    space: {
        pressed : false
    }
}

function animar() {
    requestAnimationFrame(animar)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    jogador.update()

    if (setas.ArrowLeft.pressed && jogador.position.x >= 0) {
        jogador.velocidade.x = -5
    } else if(setas.ArrowRight.pressed && jogador.position.x + jogador.width <= canvas.width) {
        jogador.velocidade.x = 5
    }else{
        jogador.velocidade.x = 0
    }
}

animar()

addEventListener('keydown', ({key}) =>{
    switch (key) {
        case 'ArrowLeft':
            console.log('esquerda')
            setas.ArrowLeft.pressed = true
            break;
        case 'ArrowRight':
            console.log('direita')
            setas.ArrowRight.pressed = true
            break;
        case ' ':
            console.log('espaço')
            setas.space.pressed = true
            break; 
    }
})

addEventListener('keyup', ({key}) =>{
    switch (key) {
        case 'ArrowLeft':
            console.log('esquerda')
            setas.ArrowLeft.pressed = false
            break;
        case 'ArrowRight':
            console.log('direita')
            setas.ArrowRight.pressed = false
            break;
        case ' ':
            console.log('espaço')
            setas.space.pressed = true
            break; 
    }
})
