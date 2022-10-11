const HEIGHT = 400
const WIDTH = 800
const DPI_WIDTH = WIDTH *2
const DPI_HEIGHT = HEIGHT * 2
const ROWS_COUNT = 5
const PADDING = 40
const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2
const VIEW_WIDTH = DPI_WIDTH
const STEP = VIEW_HEIGHT / ROWS_COUNT
const FONT = "22px serif"
const WIDTH_SUBSCRIBE_PADDING = 1
const {minY, maxY, yRatio, xRatio} = computeData(dataPreparation())
const textStep = (maxY - minY) / ROWS_COUNT
const TOOLTIP_WIDTH = 300
const TOOLTIP_HEIGHT = 300
let el = document.querySelector(".tooltip")

function dataPreparation() {
    const {columns, colors, types} = getChartData()
    return {
        x: columns[0].filter((el, idx) => idx > 0).map((el, idx) => idx),
        xy: columns.map((el) => {
            const name = el?.[0]
            const isLine = types[name] == 'line'
            if (isLine) {
                return el
                    .filter((el, idx) => idx > 0)
                    .map((item, idx) => [idx, item])
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
    ctx.lineWidth = 1
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

function drawXOrbitText(ctx, data, cols = 5) {
    ctx.beginPath()
    const step = Math.round(data.length / cols)
    for (let i = 1; i <= data.length; i += step) {
        let text = new Date().toISOString().slice(0, 10)
        let x = Math.floor(i * xRatio)
        ctx.fillText(text, x + PADDING * 2, DPI_HEIGHT - PADDING / 2.5)
    }
    ctx.closePath()

}

function draw(ctx, {xy, x: xx, colors}, canvas, [clientX, clientY]) {
    const {left, top} = canvas.getBoundingClientRect()
    let x = (clientX - left) * 2
    let y = (clientY - top) * 2
    let mouse = {
        x,
        y
    }
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, DPI_HEIGHT)
    ctx.strokeStyle = "#bbb"
    ctx.stroke()

    // for (let data in xy) {
    //     ctx.beginPath()
    //     for (let [x, y] of xy[data]) {
    //         let calcX = Math.floor(x * xRatio),
    //             calcY = Math.floor(DPI_HEIGHT - PADDING - y * yRatio)
    //         ctx.lineTo(calcX, calcY)
    //     }
    //     chartLineStyle(ctx, colors[data])
    //     ctx.closePath()
    // }
    for (let data in xy) {
        ctx.beginPath()
        for (let i = 0; i < xy[data].length; i++) {
            const [x, y] = xy[data][i]
            let calcX = Math.floor(x * xRatio),
                calcY = Math.floor(DPI_HEIGHT - PADDING - y * yRatio)
            ctx.lineTo(calcX, calcY)
        }
        chartLineStyle(ctx, colors[data])
        ctx.closePath()
    }
}

function clearCanvas(ctx) {
    ctx.clearRect(0, 0, DPI_WIDTH, DPI_HEIGHT)
}

function paint(ctx, data, canvas, [x, y]) {
    clearCanvas(ctx)
    drawGrid(ctx)
    drawXOrbitText(ctx, data.x)
    draw(ctx, data, canvas, [x, y])
}

function painCoordsLine(canvas, clientX, clientY, ctx, {xy, x: xx, colors}) {
    const {left, top} = canvas.getBoundingClientRect()
    let x = (clientX - left) * 2
    let y = (clientY - top) * 2
    let mouse = {
        x,
        y
    }
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, DPI_HEIGHT)
    ctx.strokeStyle = "#bbb"
    ctx.stroke()

    for (let data in xy) {
        // for (let [x, y] of xy[data]) {
        for (let i = 0; i < xy[data].length; i++) {
            const [x, y] = xy[data][i]
            let calcX = Math.floor(x * xRatio),
                calcY = Math.floor(DPI_HEIGHT - PADDING - y * yRatio)
            if (isOver(calcX, mouse.x, xx.length)) {
                circle(ctx, [calcX, calcY], colors[data])
                tooltip(xy, mouse, [calcX, calcY], i, el)
            }
        }
        // }
    }
    ctx.closePath()
}

function circle(ctx, [x, y], color) {
    ctx.beginPath()
    ctx.arc(x, y, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = color
    ctx.stroke()
    ctx.closePath()
}

const css = (el, styles = {}) => {
    console.log(styles)
    Object.assign(el.style, styles)
}

function tooltip(...rest) {
    const [data, mouse, [calcX, calcY], idx, el] = rest

    const {top, left, height, width} = el.getBoundingClientRect()
    console.log(el.getBoundingClientRect())
    const [, y] = data[0][idx]
    const [, y1] = data[1][idx]


    // el.querySelector("p").insertAdjacentHTML('beforebegin', `${calcY} ${calcX}`)
    css(el, {
        // top: (mouse.y - height) / 2 + "px",
        // left: (mouse.x - width) / 2 + 50 + "px"
        transform: `translate( ${Math.floor((mouse.x - width) / 2 + 50)}px, ${(mouse.y - height) / 2}px)`

        // top: top -height + "px",
        // left: left + width/2+ "px"
    })
    el.textContent = `y0: ${y} y1: ${y1} `

}

const chart = (canvas, data) => {
    const ctx = canvas.getContext("2d")
    canvas.width = DPI_WIDTH
    canvas.height = DPI_HEIGHT
    canvas.style.width = WIDTH + "px"
    canvas.style.height = HEIGHT + "px"

    function mouseMove({clientX, clientY}) {

        paint(ctx, data, this, [clientX, clientY])
        painCoordsLine(this, clientX, clientY, ctx, data)
    }

    function handleListeners(canvas) {
        return {
            init() {
                this.destroy()
                canvas.addEventListener("mousemove", mouseMove)
                ctx.beginPath()
                paint(ctx, data)
                ctx.closePath()
                return this
            },
            destroy() {
                canvas.removeEventListener("mousemove", mouseMove)
                return this
            }
        }
    }

    return handleListeners(canvas, ctx)

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
    const xRatio = VIEW_WIDTH / (x.length - WIDTH_SUBSCRIBE_PADDING)
    return {minX, minY, maxX, maxY, yRatio, xRatio}
}


function isOver(currentX, x, length) {
    const width = DPI_WIDTH / length
    // console.log(Math.abs(x - currentX), x, currentX, width/2)
    return Math.abs(x - currentX) < width / 2
}

chart(document.getElementById("chart"), dataPreparation()).init()

