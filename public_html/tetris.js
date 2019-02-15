/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Tetris {
    
    constructor(id) {
        this.isStart = false; 
        this.width = 250;
        this.height = 350;
        this.columns = 15;
        this.rows = 20;
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
        
        this.blockWidth = this.width / this.columns;
        this.blockHeight = this.height / this.rows;
        
        this.canvas = document.getElementById(id);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        this._clearCanvas();
    }
    
    start() {
        if (!this.isStart) {
            this.isStart = true;
            var col = 0;
            var row = 0;
            var figure = this.figures[2];
            this._drawFigure(figure, 0, 0);
            var prevTime = null;
            var self = this;

            requestAnimationFrame(function animate(time) {
                if (!prevTime) {
                    prevTime = time;
                }
                var timePassed = time - prevTime;
                if (timePassed > 500) {
                    row++;
                    self._clearCanvas();
                    self._drawFigure(figure, col, row);
                    prevTime = time;
                }
                requestAnimationFrame(animate);
            });
        }
    }
    
    _clearCanvas() {
        this.ctx.fillStyle = 'lightgray';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    _drawFigure(arr, startCol, startRow) {
        for (var row = 0; row < arr.length; row++) {
            for (var col = 0; col < arr[row].length; col++) {
                var value = arr[row][col];
                if (value === 1) {
                    this._drawBlock(startCol + col, startRow + row);
                }
            }
        }
    }
    
    _drawBlock(col, row) {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(col * this.blockWidth, row * this.blockHeight, this.blockWidth, this.blockHeight);
    }
    
}



