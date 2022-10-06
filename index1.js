const HEIGHT = 400
const WIDTH = 600
const DPI_WIDTH = WIDTH * 2
const DPI_HEIGHT = HEIGHT * 2
const ROWS_COUNT = 5
const PADDING = 40
const STEP = Math.floor(DPI_HEIGHT / ROWS_COUNT)
const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2
const VIEW_WIDTH = DPI_WIDTH - PADDING * 2
const FONT = "22px serif"

function calcY(y) {
    return VIEW_HEIGHT - y
}

function drawGrid(ctx, yRatio) {
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, VIEW_HEIGHT)
    ctx.stroke()
    ctx.closePath()
    ctx.beginPath()
    for (let i = 0; i < ROWS_COUNT; i++) {
        let y = calcY(i * STEP)
        let x = 0
        ctx.moveTo(x, y)
        ctx.lineTo(DPI_WIDTH, y)
        ctx.strokeStyle = "#bbb"
        ctx.font = FONT;
        ctx.fillText(calcY(y), x + PADDING / 2, y - PADDING / 4)
    }
    ctx.stroke()
    ctx.closePath()
}

function draw(ctx, data, yRatio ) {
    ctx.beginPath()
    ctx.lineWidth = 4
    ctx.lineCap = "round"
    ctx.strokeStyle = "#ff0000"
    for (let [x, y] of data) {
        console.log(yRatio)
        ctx.lineTo(x + PADDING, calcY(y*yRatio))
    }
    ctx.stroke()
    ctx.closePath()
}

const chart = (canvas, data) => {
    const ctx = canvas.getContext("2d")
    canvas.width = DPI_WIDTH
    canvas.height = DPI_HEIGHT
    canvas.style.width = WIDTH + "px"
    canvas.style.height = HEIGHT + "px"
    const {minY, maxY} = computeData(data)
    const yRatio = VIEW_HEIGHT/(maxY-minY)
    drawGrid(ctx, yRatio)
    draw(ctx, data, yRatio)
}

function computeData(data) {
    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    for (let [x, y] of data) {
        if (minY > y) minY = y
        if (maxY < y) maxY = y
        if (minX > x) minX = x
        if (maxX < x) maxX = x
    }
    return {minX, minY, maxX, maxY}
}


chart(document.getElementById("chart"), [
    [0, 0],
    [300, 480],
    [500, 160],
    [700, 5180],
    [800, 1200],
    [1000, 100],
    [1200, 500]
])
