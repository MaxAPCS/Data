const chunkSize = 100;
const TPS = 20

const entities = [];

const getChunkPos = (pos) => [Math.floor(pos.y/chunkSize), Math.floor(pos.x/chunkSize)]
function chunksInRange(pos, rad) {
	let chunks = []
	for (let r = 0; r*chunkSize <= height; r++) {
		for (let c = 0; c*chunkSize <= width; c++) {
			let [y, x] = [r * chunkSize, c * chunkSize] // x, y is top left
			if (!(x <= pos.x + rad && x + chunkSize > pos.x - rad && y <= pos.y + rad && y + chunkSize > pos.y - rad)) continue
			chunks.push([r, c])
		}
	}
	return chunks;
}
function elapsedTicks() {
	let pt = TPS * (Date.now() - lastTick)/1000
	if (pt > 1.5) console.warn(`Tick Elapse trigger exceeded! (${pt-1} Ticks Behind)`)
	return pt
}

function setup() {
	createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 3)
	frameRate(60)
    for (let type = 0; type < 3; type++)
	for (let i = 0; i < 50; i++) {
      const obj = {"type": type, "position": createVector(Math.random()*width, Math.random()*height), "velocity": p5.Vector.random2D().setMag(Math.random()*3)};
      [cx, cy] = getChunkPos(obj.position)
      if (!entities[cx]) entities[cx] = [];
      if (!entities[cx][cy]) entities[cx][cy] = new Set();
      obj.chunk = [cx, cy]
      entities[cx][cy].add(obj);
    }
}

let lastTick = Date.now();
function draw() {
	background(0)
	let now = Date.now();
	if (now - lastTick >= 1000/TPS) {
		for (let chunk of entities.flat(2))
		for (let obj of chunk) {
          obj.velocity.setMag(obj.velocity.mag() + Math.random()-0.5);
          obj.velocity.rotate(Math.random()-0.5);
          for (let [cr, cc] of chunksInRange(obj.position, 15))
          for (let cobj of entities[cr][cc] ?? [])
            if (cobj.type === (obj.type+1)%3 && p5.Vector.sub(obj.position, cobj.position).mag() <= 15)
              cobj.type = obj.type
		}
		lastTick = now;
	}
    noStroke()
	for (let chunk of entities.flat(2))
	for (let obj of chunk) {
      fill(obj.type, 3, obj.type === 2 ? 3 : 2)
      ellipse(obj.position.x, obj.position.y, 15);
      let dt = elapsedTicks()
      let futurepos = p5.Vector.add(obj.position, p5.Vector.mult(obj.velocity, dt))
      if (futurepos.x < 0 || futurepos.x > width) obj.velocity.x *= -0.5 
      if (futurepos.y < 0 || futurepos.y > height) obj.velocity.y *= -0.5
      obj.position.add(p5.Vector.mult(obj.velocity, dt))
      let nc = getChunkPos(obj.position)
      if (nc[0] === obj.chunk[0] && nc[1] === obj.chunk[1]) continue;
      entities[obj.chunk[0]][obj.chunk[1]].delete(obj);
      obj.chunk = nc;
      if (entities[obj.chunk[0]] === undefined) entities[obj.chunk[0]] = [];
      if (entities[obj.chunk[0]][obj.chunk[1]] === undefined) entities[obj.chunk[0]][obj.chunk[1]] = new Set();
      entities[obj.chunk[0]][obj.chunk[1]].add(obj);
    }
}

const debugRange = 15;
function chunkDebug() {
	noStroke()
	const mp = createVector(mouseX, mouseY);
	fill(1, 2, 3, 2)
	let [r,c] = getChunkPos(mp)
	rect(c*chunkSize, r*chunkSize, chunkSize, chunkSize)
	fill(3, 150, 150, 1)
	circle(mp.x, mp.y, debugRange*2)
	fill(3, 2, 3, 1)
	for (let [r, c] of chunksInRange(mp, debugRange))
	rect(c*chunkSize, r*chunkSize, chunkSize, chunkSize)
	fill(0xfff)
	if (entities[r] && entities[r][c]) text(entities[r][c].size, mp.x, mp.y)
	noFill()
}