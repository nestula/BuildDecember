import RuneInfo from "./RuneInfo.js";

class Board {
    constructor(element, options={}) {
        if(!element) {
            throw new Error("Element is required");
        }
        if(!(element instanceof HTMLCanvasElement)) {
            throw new Error("Element must be a canvas");
        }
        this.c = element;
        this.c.width = options.width || 600; // Default width
        this.c.height = options.height || 600; // Default height

        this.ctx = this.c.getContext("2d");

        // STATS AND VALUES
        this.center = {
            x: this.c.width / 2,
            y: this.c.height / 2
        }

        this.cached_images = {}; // Cache for images

        this.table=[
            new Array(5),
            new Array(6),
            new Array(7),
            new Array(8),
            new Array(7),
            new Array(6),
            new Array(5),
        ]

        this.currentPosition = null;
        this.savedPosition = null;
        this.currentRune = null;

        this.mouse = {
            x:0,
            y:0,
            down: false,
            onmousedown: ()=>{
                if(!this.currentRune && this.currentPosition) {
                    this.currentRune = this.table[this.currentPosition[0]][this.currentPosition[1]];
                    this.savedPosition = this.currentPosition;
                    this.c.style.cursor = "grabbing";
                }
            },
            onmouseup: ()=>{
                this.mouse.externalmouseup();
                if(this.savedPosition) {
                    this.table[this.savedPosition[0]][this.savedPosition[1]]=null;
                    this.savedPosition = null;
                    this.c.style.cursor = "default";
                }
                if(this.currentPosition && this.currentRune) {
                    this.table[this.currentPosition[0]][this.currentPosition[1]]=this.currentRune;
                    this.currentRune=null;
                }
            },
            externalmouseup: ()=>{},
            onclick: ()=>{}
        }

        // Start the animation loop
        this._start();


    }
    _handleResize() {
        this.center.x = this.c.width / 2;
        this.center.y = this.c.height / 2;
    }

    _draw() {
        const hexSize = this.c.height/14;  // Radius of each hexagon (distance from center to any vertex)
        const hexWidth = Math.sqrt(3) * hexSize;  // Width of the hexagon (horizontal distance between two points)
        const hexHeight = hexSize*1.5;
    
        // Function to draw a single hexagon
        const drawHexagon = (x, y) => {
            const points = [];
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3 + Math.PI / 6;  // Calculate each corner of the hexagon
                const px = x + hexSize * Math.cos(angle);  // X coordinate of the corner
                const py = y + hexSize * Math.sin(angle);  // Y coordinate of the corner
                points.push({ x: px, y: py });
            }
            const path = new Path2D();
            path.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < 6; i++) {
                path.lineTo(points[i].x, points[i].y);
            }
            path.closePath();
            if(ctx.isPointInPath(path, this.mouse.x,this.mouse.y)) {
                this.ctx.fillStyle = "#333";
            } else {
                this.ctx.fillStyle = "#555";
            }
            this.ctx.fill(path);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "black";
            this.ctx.stroke(path);

            return path;
        };
    
        // Clear canvas
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    
        // Draw hexagon slots //

        const pattern = [
            5,
            6,
            7,
            8,
            7,
            6,
            5
        ]


        const cx = this.center.x;
        const cy = this.center.y;
        const ctx = this.ctx;

        function getX(amt, i, j) {
            return cx - ((amt/2)*hexWidth+(hexWidth/2)) + ((j+1)*hexWidth); // calc x
        }

        function getY(amt, i, j) {
            return cy - ((pattern.length/2)*hexHeight-(hexHeight/2)) + (i*hexHeight); // calc y
        }

        function drawConnection(i1, j1, i2, j2, color) {
            const amt1 = pattern[i1];
            const amt2 = pattern[i2];

            // connecting point
            const x1 = getX(amt1, i1, j1);
            const y1 = getY(amt1, i1, j1);
            // Achor Point
            const x2 = getX(amt2, i2, j2);
            const y2 = getY(amt2, i2, j2);

            ctx.beginPath();
            ctx.arc(x1, y1, 10, 0, 2 * Math.PI); // Draw a circle with radius 10
            ctx.fillStyle = "red"; // Fill color
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.stroke();



            const path = new Path2D();
            path.moveTo(x1,y1);
            path.lineTo(x2,y2);
            ctx.lineWidth = 5;
            ctx.strokeStyle = color || "black";
            ctx.stroke(path);
        }

        let y = cy - ((pattern.length/2)*hexHeight-(hexHeight/2));

        let isInSlot = false;
        // loop y
        for(let i=0; i<pattern.length; i++) {
            const amt = pattern[i];

            let x = cx - ((amt/2)*hexWidth+(hexWidth/2)); // calc x
            
            // loop x
            for(let j=0; j<amt; j++) {
                x+=hexWidth;
                // check mouse position
                const path = drawHexagon(x,y);
                if(!isInSlot) {
                    if(this.ctx.isPointInPath(path, this.mouse.x,this.mouse.y)) {
                        this.currentPosition=[i,j];
                        isInSlot=true;
                    }
                }

                // check if slot has rune
                if(this.table[i][j]) {
                    // rememner, j is x, i is y so [y][x] position is reversed
                    if(i>3) {
                        // if(RuneInfo.canConnect(this.table[i-1][j], this.table[i][j])) {
                            
                        // }
                        drawConnection(i, j, i-1, j+1);
                    } else {
                        drawConnection(i, j, i-1, j);
                    }

                    if(!this.savedPosition) {
                        this.c.style.cursor = "grab";
                    }
                    const runeName = this.table[i][j];
                    if (window.allRunes) {
                        const matchingRune = window.allRunes.find(rune => rune.title.toLowerCase() === runeName.toLowerCase());
                        // print
                        if (matchingRune) {
                            // see if the image is cached
                            if(!this.cached_images[matchingRune.title]) {
                                const img = new Image();
                                img.src = `../../resources/icons/${matchingRune.icon}`;
                                this.cached_images[matchingRune.title] = img; // finish
                            }

                            const img = this.cached_images[matchingRune.title];
                            const padding = 0.8;
                            ctx.drawImage(img, x - hexSize*padding, y - hexSize*padding, hexSize*2*padding, hexSize*2*padding);
                        }
                    }

                } else {
                    // this.c.style.cursor = "default";
                }

            }

            y+=hexHeight;
        }
        // set back to default
        if(!isInSlot) {
            this.currentPosition=null;
        }


    }
    

    _tick() {
        this._draw();
        requestAnimationFrame(() => this._tick());
    }
    _start() {
        window.addEventListener('resize', () => this._handleResize());

        // event listeners

        this.c.addEventListener("mousemove", (e)=>{
            const rect = this.c.getBoundingClientRect();
            const x = (e.clientX - rect.left) | 0;
            const y = (e.clientY - rect.top) | 0;

            const hexSize = this.c.height/14;  // Radius of each hexagon (distance from center to any vertex)
            const hexWidth = Math.sqrt(3) * hexSize;  // Width of the hexagon (horizontal distance between two points)
            const hexHeight = hexSize*1.5;
            
            this.mouse.x=x;
            this.mouse.y=y - hexHeight/4;
        });
        this.c.addEventListener("mousedown", (e)=>{
            this.mouse.down=true;
            this.mouse.onmousedown();
        });
        this.c.addEventListener("mouseup", (e)=>{
            this.mouse.down=false;
            this.mouse.onmouseup();
        });
        this.c.addEventListener("click", (e)=>{this.mouse.onclick()});

        // start ticks

        this._tick();
    }
}

export default Board;