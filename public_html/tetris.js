/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Tetris {
    
    
    
    constructor(id) {
        this.isStart = false; 
        this.columns = 15;
        this.rows = 20;
        this.tetrisHtml = new TetrisHtml(id, this.columns, this.rows);
        
        this.currentFigure = [];
        this.currentFigurePosition = {x: 0, y: 0};
        this.field = [];
        
        this.figures = [
            [
                [1, 1, 1, 1]
            ],
            [
                [1, 1, 1],
                [0, 1, 0]
            ],
            [
                [1, 1, 0],
                [0, 1, 1]
            ]
        ];
    }
    
    start() {
        if (!this.isStart) {
            this.isStart = true;
            
            this._startNewFigure();
        }
    }
    
    _startNewFigure() {
        this.currentFigure = this.figures[2];
        this.currentFigurePosition = {x: 0, y: 0};
            
        this.tetrisHtml.drawFigure(this.currentFigure, this.currentFigurePosition.x, this.currentFigurePosition.y);
        var prevTime = null;
        var self = this;

        requestAnimationFrame(function animate(time) {
            if (!prevTime) {
                prevTime = time;
            }
            var timePassed = time - prevTime;
            if (timePassed > 500) {
                self.currentFigurePosition.y++;
                self.tetrisHtml.clearCanvas();
                self.tetrisHtml.drawFigure(self.currentFigure, self.currentFigurePosition.x, self.currentFigurePosition.y);
                prevTime = time;
            }
            requestAnimationFrame(animate);
        });
        
        $(document).keydown(function(event) {
            var code = event.which;
            if (code == 37) {
                self.currentFigurePosition.x--;
                self.tetrisHtml.clearCanvas();
                self.tetrisHtml.drawFigure(self.currentFigure, self.currentFigurePosition.x, self.currentFigurePosition.y);
            } else if (code === 39) {
                self.currentFigurePosition.x++;
                self.tetrisHtml.clearCanvas();
                self.tetrisHtml.drawFigure(self.currentFigure, self.currentFigurePosition.x, self.currentFigurePosition.y);
            }
            
        });
        
    }
    
    _validateFigure(figure, x, y) {
        
    }
    
    
    
}

class TetrisHtml {
    
    constructor(id, columns, rows) {
        this.width = 250;
        this.height = 350;
        this.columns = columns;
        this.rows = rows;
        this.blockWidth = this.width / this.columns;
        this.blockHeight = this.height / this.rows;
        
        this.canvas = document.getElementById(id);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        this.clearCanvas();
    }
    
    clearCanvas() {
        this.ctx.fillStyle = 'lightgray';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    drawFigure(arr, startCol, startRow) {
        for (var row = 0; row < arr.length; row++) {
            for (var col = 0; col < arr[row].length; col++) {
                var value = arr[row][col];
                if (value === 1) {
                    this.drawBlock(startCol + col, startRow + row);
                }
            }
        }
    }
    
    drawBlock(col, row) {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(col * this.blockWidth, row * this.blockHeight, this.blockWidth, this.blockHeight);
        this.ctx.strokeStyle = 'white';
        this.ctx.strokeRect(col * this.blockWidth, row * this.blockHeight, this.blockWidth, this.blockHeight);
    }
    
}



