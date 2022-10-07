const HEIGHT = 400
const WIDTH = 800
const DPI_WIDTH = WIDTH * 2
const DPI_HEIGHT = HEIGHT * 2
const ROWS_COUNT = 5
const PADDING = 40
const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2
const VIEW_WIDTH = DPI_WIDTH - PADDING
const STEP = VIEW_HEIGHT / ROWS_COUNT
const FONT = "22px serif"
const WIDTH_SUBSCRIBE_PADDING = 2
const {minY, maxY, yRatio, xRatio} = computeData(dataPreparation())
const textStep = (maxY - minY) / ROWS_COUNT
function dataPreparation() {
    const {columns, colors, types} = getChartData()
    return {
        x: columns[0].filter((el, idx) => idx > 0),
        xy: columns.map((el) => {
            const name = el?.[0]
            const isLine = types[name] == 'line'
            if (isLine) {
                return el.map((item, idx) => [idx, item]).filter((el, idx) => idx > 0)
            }
        }).filter(Boolean),
        colors: Object.values(colors),
    }
}


function gridLineStyle(ctx) {
    ctx.strokeStyle = "#bbb"
    ctx.stroke()
}

function chartLineStyle(ctx, color = "#ff0000", lineWidth = 4) {
    ctx.strokeStyle = color
    ctx.lineCap = "round"
    ctx.lineWidth = lineWidth
    ctx.stroke()
}

function drawGrid(ctx) {
    ctx.beginPath()
    ctx.font = FONT;
    for (let i = 1; i <= ROWS_COUNT; i++) {
        let y = i * STEP
        const text = Math.round(maxY - textStep * i).toString()
        ctx.moveTo(0, y + PADDING)
        ctx.lineTo(DPI_WIDTH, y + PADDING)
        ctx.fillText(text, 0, y + PADDING)
    }
    gridLineStyle(ctx)
    ctx.closePath()
}

function draw(ctx, {xy, colors}) {
    ctx.beginPath()
    for (let data in xy) {
        ctx.beginPath()
        for (let [x, y] of xy[data]) ctx.lineTo(x * xRatio, DPI_HEIGHT - PADDING - y * yRatio)
        chartLineStyle(ctx, colors[data])
        ctx.closePath()
    }
    ctx.closePath()
}

const chart = (canvas, data) => {
    const ctx = canvas.getContext("2d")
    canvas.width = DPI_WIDTH
    canvas.height = DPI_HEIGHT
    canvas.style.width = WIDTH + "px"
    canvas.style.height = HEIGHT + "px"
    drawGrid(ctx)
    draw(ctx, data)
}

function computeData({x, xy}) {
    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    for (let data in xy) {
        for (let [x, y] of xy[data]) {
            if (minY > y) minY = y
            if (maxY < y) maxY = y
            if (minX > x) minX = x
            if (maxX < x) maxX = x
        }
    }
    const yRatio = VIEW_HEIGHT / (maxY - minY)
    const xRatio = VIEW_WIDTH / x.length + WIDTH_SUBSCRIBE_PADDING
    return {minX, minY, maxX, maxY, yRatio, xRatio}
}


chart(document.getElementById("chart"), dataPreparation())


