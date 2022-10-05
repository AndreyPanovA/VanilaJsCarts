const HEIGHT = 600
const WIDTH = 400
const DPI_WIDTH = WIDTH * 2
const DPI_HEIGHT = HEIGHT * 2
const data = [
    [0, 0],
    [200, 100],
    [400, 50],
    [500, 100],
]

class Chart {
    constructor(data, width, height, lines) {
        this.canvas = document.getElementById("chart")
        this.ctx = this.canvas.getContext("2d")
        this.getConstants(data, width, height, lines)
        this.red = "#ff0000"
        this.green = "green"
        this.stepColor = "#bbb"
    }
    lineStyle(color = "red") {
        this.ctx.lineWidth = 4
        this.ctx.strokeStyle = color
    }

    getConstants(data, width, height, lines = 5) {
        this.data = data
        this.height = height
        this.width = width
        this.lines = lines + 1
        this.DPI_HEIGHT = this.height * 2
        this.DPI_WIDTH = this.width * 2
        this.step = this.DPI_HEIGHT / this.lines
        this.canvas.style.width = this.width
        this.canvas.style.height = this.height
        this.canvas.width = this.DPI_WIDTH
        this.canvas.height = this.DPI_HEIGHT
        return this
    }

    calcY(y) {
        return this.DPI_HEIGHT - y
    }
    drawOrbit() {
        this.ctx.moveTo(0, 0)
        this.ctx.lineTo(0,this.DPI_HEIGHT)
        this.ctx.moveTo(0, this.DPI_HEIGHT)
        this.ctx.lineTo(this.DPI_WIDTH,this.DPI_HEIGHT)
        this.ctx.stroke()
    }
    drawGrid() {
        this.ctx.beginPath()
        this.drawOrbit()
        for (let i = 0; i < this.lines; i++) {
            let step = i * this.step
            this.ctx.fillText(this.calcY(step) , 0, step)
            this.ctx.moveTo(0, step)
            this.ctx.lineTo(this.DPI_WIDTH, step)
        }
        this.lineStyle(this.stepColor)
        this.ctx.stroke()
        this.ctx.closePath()
        return this
    }

    lineTo(x, y) {
        this.ctx.lineTo(x, this.calcY(y))
    }

    draw() {
        this.ctx.beginPath()
        this.lineStyle()
        for (let [x, y] of this.data) {
            this.lineTo(x, y)
        }
        this.ctx.stroke()
        this.ctx.closePath()
        return this
    }

    render() {
        this.draw()
            .drawGrid()
        return this
    }
}


const chart = new Chart(data, WIDTH, HEIGHT).render()


// const chart = ()=> {
//     const canvas = document.getElementById("chart")
//     const ctx = canvas.getContext("2d")
//     canvas.addEventListener("click", (e)=> {
//         console.log(e)
//     })
//     canvas.width= WIDTH
//     canvas.height = HEIGHT
//     canvas.style.width = WIDTH + "px"
//     canvas.style.height = HEIGHT + "px"
//
//     ctx.beginPath()
//     // ctx.lineTo(0, WIDTH)
//     for (let [x, y] of data) {
//         // console.log(x, this.calcY(y))
//         ctx.lineTo(x, y)
//     }
//     ctx.stroke()
//     ctx.closePath()
// }

// chart()
