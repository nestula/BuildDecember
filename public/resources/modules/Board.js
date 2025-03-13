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

        // Start the animation loop
        this._start();

        this.cached_images = {}; // Cache for images
    }
    _handleResize() {
        this.center.x = this.c.width / 2;
        this.center.y = this.c.height / 2;
    }

    _draw() {
        const hexSize = 40;  // Radius of each hexagon (distance from center to any vertex)
        const hexWidth = Math.sqrt(3) * hexSize;  // Width of the hexagon (horizontal distance between two points)
        const hexHeight = 2 * hexSize;  // Height of the hexagon (vertical distance between two points)
    
        // Function to draw a single hexagon
        const drawHexagon = (x, y) => {
            const points = [];
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3 + Math.PI / 6;  // Calculate each corner of the hexagon
                const px = x + hexSize * Math.cos(angle);  // X coordinate of the corner
                const py = y + hexSize * Math.sin(angle);  // Y coordinate of the corner
                points.push({ x: px, y: py });
            }
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < 6; i++) {
                this.ctx.lineTo(points[i].x, points[i].y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
        };
    
        // Clear canvas
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    
        // Draw hexagons in a grid pattern


        for(let row = -5; row <= 5; row++) {
            for (let col = -5; col <= 5; col++) {
                // center x and y
                const cx = this.center.x;
                const cy = this.center.y;                
                // Calculate the center position of each hexagon
                const x = this.center.x + col * hexWidth + (row % 2) * (hexWidth / 2) - (hexWidth / 2);  // Horizontal offset for staggered columns
                const y = this.center.y + row * (hexHeight * 0.75);  // Vertical offset for staggered rows
                // distance
                const distance = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                const horizontalDistance = Math.abs(x - cx);
                const verticalDistance = Math.abs(y - cy);
                if(distance > this.c.width/2.5 && (row != 0 || horizontalDistance > this.c.width/2.4)) continue; // Limit distance from center
                // Draw hexagon
                drawHexagon(x, y);
            }
        }
      
    }
    

    _tick() {
        this._draw();
        requestAnimationFrame(() => this._tick());
    }
    _start() {
        window.addEventListener('resize', () => this._handleResize());
        this._tick();
    }
}

export default Board;