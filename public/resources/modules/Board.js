import RuneInfo from "./RuneInfo.js";


const ELEMENTS = ["Poison", "Fire", "Lightning", "Cold", "Physical"]

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

        this.calculatedRunes = {};

        this.table=[
            new Array(5),
            new Array(6),
            new Array(7),
            new Array(8),
            new Array(7),
            new Array(6),
            new Array(5),
        ],
        this.calculatedTable=[
            new Array(5),
            new Array(6),
            new Array(7),
            new Array(8),
            new Array(7),
            new Array(6),
            new Array(5),
        ]
        // this.table[2][2] = "Ogre Arrow";
        // this.table[2][1] = "Convert Physical Damage";
        // this.table[2][3] = "Additional Physical DMG";
        // this.table[3][3] = "Extract Poison Energy";

        this.currentPosition = null;
        this.savedPosition = null;
        this.currentRune = null;

        this.mouse = {
            waitingTouchAction: false,
            x:0,
            y:0,
            down: false,
            onmousedown: ()=>{
                if(!this.currentRune && this.currentPosition && this.currentPosition && this.currentPosition[0]!=-1 && this.currentPosition[1]!=-1) {
                    this.currentRune = this.table[this.currentPosition[0]][this.currentPosition[1]];
                    this.savedPosition = this.currentPosition;
                    this.c.style.cursor = "grabbing";
                }
            },
            onmouseup: ()=>{
                this.mouse.externalmouseup();
                // check if rune is in trash
                if(!this.currentPosition) {
                    this.currentRune=null;
                    this.savedPosition = null;
                    this.c.style.cursor = "default";
                    return;
                };
                const isInTrash  = (this.currentPosition && this.currentPosition[0]==-1 && this.currentPosition[1]==-1);
                // set new condition
                let tempRune = null;

                if(!isInTrash && this.currentPosition && this.currentRune) {
                    tempRune = this.table[this.currentPosition[0]][this.currentPosition[1]];
                    this.table[this.currentPosition[0]][this.currentPosition[1]]=this.currentRune;
                };
                
                if(this.savedPosition) {
                    // set original position
                    this.table[this.savedPosition[0]][this.savedPosition[1]]=tempRune;
                    this.savedPosition = null;
                    this.c.style.cursor = "default";
                }
                
                this.currentRune=null;
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

    doesConnect(i, j, i2, j2) {
        let surroundingIndexes = [];
        if(i == 3) {
            // middle
            surroundingIndexes = [
                [i-1, j], // top right
                [i-1, j-1], // top left
                [i, j+1], // right
                [i, j-1], // left
                [i+1, j], // bottom left
                [i+1, j-1], // bottom right
            ]
        } else if(i < 3) {
            // top row
            surroundingIndexes = [
                [i-1, j], // top right
                [i-1, j-1], // top left
                [i, j+1], // right
                [i, j-1], // left
                [i+1, j], // bottom left
                [i+1, j+1], // bottom right
            ]
        } else if(i > 3) {
            // bottom row
            surroundingIndexes = [
                [i-1, j+1], // top right
                [i-1, j], // top left
                [i, j+1], // right
                [i, j-1], // left
                [i+1, j], // bottom left
                [i+1, j-1], // bottom right
            ]
        }
        let connects = false;
        for(const [posx, posy] of surroundingIndexes) {
            if(posx == i2 && posy == j2) {
                connects = true;
                break;
            }
        }
        return connects;
    }

    _draw() {
        const hexSize = this.c.height/14;  // Radius of each hexagon (distance from center to any vertex)
        const hexWidth = Math.sqrt(3) * hexSize;  // Width of the hexagon (horizontal distance between two points)
        const hexHeight = hexSize*1.5;
    
        // Function to draw a single hexagon
        const drawHexagon = (x, y, color) => {
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
            // if(ctx.isPointInPath(path, this.mouse.x,this.mouse.y)) {
            //     // this.ctx.fillStyle = "#333";
            // } else {
            //     this.ctx.fillStyle = "#555";
            // }

            this.ctx.fillStyle = color || "#555";
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

        function dist(x1, y1, x2, y2) { return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)); }
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
                // dull out unlockable sides / slots
                if(j==0 || j == amt-1) {
                    drawHexagon(x,y, "rgba(55,55,55,0.8)");
                }

                // check if mouse is in slot

                if(!isInSlot) {
                    const inset = 5;
                    if(dist(x,y,this.mouse.x,this.mouse.y) < hexSize-inset) {
                        this.currentPosition=[i,j];
                        isInSlot=true;
                        // draw bounding circe
                        const circle = new Path2D();
                        circle.arc(x, y, hexSize-inset, 0, 2 * Math.PI);
                        this.ctx.lineWidth = 2;
                        this.ctx.fillStyle = "#06402B";
                        this.ctx.fill(circle);
                        this.ctx.strokeStyle = "black";
                        this.ctx.stroke(circle);


                        // draw circle at mouse x and y
                        // const circle2 = new Path2D();
                        // circle2.arc(this.mouse.x, this.mouse.y, 5, 0, 2 * Math.PI);
                        // this.ctx.lineWidth = 2;
                        // this.ctx.fillStyle = "red";
                        // this.ctx.fill(circle2);
                    }
                }

                // check if slot has rune
                if(this.table[i][j]) {
                
                    if(!this.savedPosition) {
                        this.c.style.cursor = "grab";
                    }
                    

                }

            }

            y+=hexHeight;
        }
        // set back to default
        if(!isInSlot) {
            this.currentPosition=null;
        }


        // draw connections

        for(let i=0; i<pattern.length; i++) {
            for(let j=0; j<pattern[i]; j++) {
                const baseRuneName = this.table[i][j];

                let surroundingIndexes = [];
                if(i == 3) {
                    // middle
                    surroundingIndexes = [
                        [i-1, j], // top right
                        [i-1, j-1], // top left
                        [i, j+1], // right
                        [i, j-1], // left
                        [i+1, j], // bottom left
                        [i+1, j-1], // bottom right
                    ]
                } else if(i < 3) {
                    // top row
                    surroundingIndexes = [
                        [i-1, j], // top right
                        [i-1, j-1], // top left
                        [i, j+1], // right
                        [i, j-1], // left
                        [i+1, j], // bottom left
                        [i+1, j+1], // bottom right
                    ]
                } else if(i > 3) {
                    // bottom row
                    surroundingIndexes = [
                        [i-1, j+1], // top right
                        [i-1, j], // top left
                        [i, j+1], // right
                        [i, j-1], // left
                        [i+1, j], // bottom left
                        [i+1, j-1], // bottom right
                    ]
                }

                // draw connections

                if(baseRuneName && window.allRunes) {
                    const baseRune = JSON.parse(JSON.stringify(window.allRunes.find(rune => rune.title.toLowerCase() === baseRuneName.toLowerCase())));
                
                    // update based on surrounding
                    if(baseRune.type=="skill")  { // make sure not link-link

                        let newTags = baseRune.tags; //  Array
                        for(const [ni, nj] of surroundingIndexes) {
                            // check if it exists
                            if(this.table[ni] && this.table[ni][nj]) {
                                const checkRune = window.allRunes.find(rune => rune.title.toLowerCase() === this.table[ni][nj].toLowerCase());
                                // Converts
                                if(checkRune.title.includes("Convert")) {
                                    const convertType = checkRune.title.split(" ")[1];
                                    if(newTags.includes(convertType)) continue; // already has this type

                                    const convertTags = checkRune.tags;
                                    let canConnect = false;
                                    for(const tag of baseRune.tags) {
                                        if(ELEMENTS.includes(tag) && convertTags.includes(tag)) {
                                            canConnect = true;
                                            break;
                                        }
                                    }
                                    if(!canConnect) continue;

                                    let hasTag = false;
                                    for (let tag of ELEMENTS) {
                                        if(newTags.includes(tag)) {
                                            newTags = newTags.filter(t => t !== tag);
                                            hasTag = true;
                                        }
                                    }

                                    if(!hasTag) { continue };

                                    newTags.push(convertType); // add new type
                                    drawConnection(i, j, ni, nj, "orange");
                                }
                            }
                        }
                        baseRune.tags = newTags;

                    }
                    

                    for(const [ni, nj] of surroundingIndexes) {
                        // check if indexes are within bounds
                        if (ni >= 0 && ni < pattern.length && nj >= 0 && nj < pattern[ni]) {
                            // see if connectable
                            if(baseRune.type=="skill" && this.table[ni] && this.table[ni][nj]) {
                                // check if rune can connect
                                const linkRuneName = this.table[ni][nj].toLowerCase();

                                const linkRune = window.allRunes.find(rune => rune.title.toLowerCase() === linkRuneName);
                                
                                const activation = linkRuneName.includes("activation");
                                const convert = linkRuneName.includes("convert");

                                if(linkRune.type=="link" && RuneInfo.canLink(baseRune, linkRune)) {
                                    let color = "black";
                                    // set color
                                    switch(linkRune.mainStat.toLowerCase()) {
                                        case "strength":
                                            color="red";
                                            break;
                                        case "agility":
                                            color="green";
                                            break;
                                        case "intellect":
                                            color="blue";
                                            break;
                                        default:
                                            color="orange";
                                    }

                                    
                                    if(!activation && !convert) {
                                        drawConnection(i, j, ni, nj, color);

                                    }
                                }

                                if(activation) {
                                    drawConnection(i, j, ni, nj, "purple");
                                }
                            }
                        }
                    }
                }

            }   
        }

        // draw images

        for(let i=0; i<pattern.length; i++) {
            for(let j=0; j<pattern[i]; j++) {
                // draw images
                if(this.table[i][j]) {
                    const runeName = this.table[i][j];
                    if (window.allRunes) {
                        const matchingRune = window.allRunes.find(rune => rune.title.toLowerCase() === runeName.toLowerCase());
                        // print
                        if (matchingRune) {
                            const x = getX(pattern[i], i, j);
                            const y = getY(pattern[i], i, j);
                            // see if the image is cached
                            if(!window.cached_images) {
                                window.cached_images = {};
                            }
                            if(!window.cached_images[matchingRune.title]) {
                                const img = new Image();
                                img.src = `../../resources/icons/${matchingRune.icon}`;
                                window.cached_images[matchingRune.title] = img; // finish
                            }

                            const img = window.cached_images[matchingRune.title];
                            const padding = 0.8;
                            ctx.drawImage(img, x - hexSize*padding, y - hexSize*padding, hexSize*2*padding, hexSize*2*padding);
                        }
                    }
                }
            }
        }

        // draw trash can


        const xSize = 20; // Size of the "X"
        const xPos = 10 + hexWidth / 2; // Center X position
        const yPos = 10 + hexHeight / 2; // Center Y position

        // drawHexagon(xPos, yPos);

        const rect = new Path2D();
        rect.rect(10, 10, hexWidth, hexHeight);
        ctx.fillStyle = "darkred";
        ctx.fill(rect);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.stroke(rect);

        // Draw "X"
        ctx.beginPath();
        ctx.moveTo(xPos - xSize / 2, yPos - xSize / 2);
        ctx.lineTo(xPos + xSize / 2, yPos + xSize / 2);
        ctx.moveTo(xPos + xSize / 2, yPos - xSize / 2);
        ctx.lineTo(xPos - xSize / 2, yPos + xSize / 2);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Check if mouse is inside
        if (ctx.isPointInPath(rect, this.mouse.x, this.mouse.y)) {
            this.currentPosition = [-1, -1];
        }

    }
    

    _tick() {
        this._draw();
        requestAnimationFrame(() => this._tick());
    }
    _start() {
        window.addEventListener('resize', () => this._handleResize());

        // event listeners

        this.c.addEventListener("mousemove", (e) => {
            const rect = this.c.getBoundingClientRect();
            const scaleX = this.c.width / rect.width;   // Scale factor for X
            const scaleY = this.c.height / rect.height; // Scale factor for Y
        
            this.mouse.x = (e.clientX - rect.left) * scaleX;
            this.mouse.y = (e.clientY - rect.top) * scaleY;
        });
        
        this.c.addEventListener("touchmove", (e) => {
            const rect = this.c.getBoundingClientRect();
            const scaleX = this.c.width / rect.width;
            const scaleY = this.c.height / rect.height;
        
            const touch = e.touches[0];  // Get first touch
            this.mouse.x = (touch.clientX - rect.left) * scaleX;
            this.mouse.y = (touch.clientY - rect.top) * scaleY;
        });

    
        this.c.addEventListener("touchstart", (e)=>{
            e.preventDefault(); 

            const rect = this.c.getBoundingClientRect();
            const scaleX = this.c.width / rect.width;
            const scaleY = this.c.height / rect.height;
        
            const touch = e.touches[0];  // Get first touch
            this.mouse.x = (touch.clientX - rect.left) * scaleX;
            this.mouse.y = (touch.clientY - rect.top) * scaleY;

            this._draw(); // update mouse position


            // DELETE

            if(this.currentPosition && this.currentPosition[0] === -1 && this.currentPosition[1] === -1) {
                this.mouse.down = false;
                if(this.currentRune) {
                    this.table[this.savedPosition[0]][this.savedPosition[1]] = null;
                    this.currentRune = null;
                    this.savedPosition = null;
                }
                this.waitingTouchAction = false;
                return;
            }

            // TOUCH CONTROLS

            if(this.waitingTouchAction) { // second touch

                this.mouse.down = false;
                if(this.currentRune && this.savedPosition && this.currentPosition) {
                    // set positions
                    const tempRune = this.table[this.currentPosition[0]][this.currentPosition[1]];
                    this.table[this.currentPosition[0]][this.currentPosition[1]] = this.currentRune;
                    this.table[this.savedPosition[0]][this.savedPosition[1]] = tempRune;
                } else if(this.currentRune) {
                    console.log(this.currentRune);
                    this.table[this.currentPosition[0]][this.currentPosition[1]] = this.currentRune;
                    this.currentRune = null;
                }
    
                this.waitingTouchAction = false;


            } else { // first touch
    
                // SELECT
                if(this.savedPosition == -999 ) {
                    this.mouse.down = false;
                    this.table[this.currentPosition[0]][this.currentPosition[1]] = this.currentRune;
                    this.currentRune = null;
                    this.savedPosition = null;
                    return;
                }

                if(this.currentPosition) {
                    this.mouse.down=true;


                    this.currentRune = this.table[this.currentPosition[0]][this.currentPosition[1]];
                    if(this.currentRune) { // make sure not empty
                        this.savedPosition = [...this.currentPosition];

                        this.waitingTouchAction = true;
    
                        setTimeout(() => {
                            if(this.waitingTouchAction) {
                                this.waitingTouchAction = false;
                            }
                        }, 1000);
                    }
                    
                }

            }
 
        }, { passive: false });
        
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
    clear() {
        this.table = [
            new Array(5),
            new Array(6),
            new Array(7),
            new Array(8),
            new Array(7),
            new Array(6),
            new Array(5)
        ];
        this.calculatedTable = [
            new Array(5),
            new Array(6),
            new Array(7),
            new Array(8),
            new Array(7),
            new Array(6),
            new Array(5)
        ];
        this._draw();
    }

    setSize(width, height) {
        this.c.width = width;
        this.c.height = height;
    }
}

export default Board;