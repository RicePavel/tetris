/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Tetris {
    
    
    
    constructor(id) {
        this.isPlay = false; 
        this.delay = 200;
        this.columns = 15;
        this.rows = 20;
        this.tetrisHtml = new TetrisHtml(id, this.columns, this.rows);
        
        this.currentFigure = [];
        this.currentFigurePosition = {x: 0, y: 0};
        this.field = [];
        this._setEmptyField();
        
        this.figures = [
            [
                [1, 1, 1, 1]
            ],
            [
                [0, 1, 0],
                [1, 1, 1]
            ],
            [
                [1, 0, 0],
                [1, 1, 1]
            ],
            [
                [0, 0, 1],
                [1, 1, 1]
            ],
            [
                [1, 1],
                [1, 1]
            ],
            [
                [1, 1, 0],
                [0, 1, 1]
            ],
            [
                [0, 1, 1],
                [1, 1, 0]
            ]
        ];
    }
    
    start() {
        if (!this.isPlay) {
            this.isPlay = true;
            
            this._startNewFigure();
            this._setKeyEvents();
        }
    }
    
    _startNewFigure() {
        this.currentFigure = this._getRandomFigure();
        this.currentFigurePosition = {x: 0, y: 0};
            
        this._render();
        
        var prevTime = null;
        var self = this;

        var requestId = requestAnimationFrame(function animate(time) {
            var done = true;
            if (!prevTime) {
                prevTime = time;
            }
            var timePassed = time - prevTime;
            if (timePassed > self.delay) {
                var newX = self.currentFigurePosition.x;
                var newY = self.currentFigurePosition.y + 1;
                if (self._validateFigure(self.currentFigure, newX, newY)) {
                    self.currentFigurePosition.y = newY;
                    self._render();
                } else {
                   self._addFigureToField(self.currentFigure, self.currentFigurePosition.x, self.currentFigurePosition.y) 
                   self.currentFigure = [];
                   self._render(); 
                   self._startNewFigure();
                   done = false;
                }
                prevTime = time;
            }
            if (done) {
                requestAnimationFrame(animate);
            }
        });   
    }
    
    _getRandomFigure() {
        var idx = this._randomInteger(1, this.figures.length);
        return this.figures[idx - 1];
    }
    
    _randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return rand;
    }
    
    _render() {
        this.tetrisHtml.clearCanvas();
        this.tetrisHtml.drawFigure(this.currentFigure, this.currentFigurePosition.x, this.currentFigurePosition.y);
        this.tetrisHtml.drawField(this.field);
    }
    
    _addFigureToField(figure, x, y) {
        for (var row = 0; row < figure.length; row++) {
            for (var col = 0; col < figure[row].length; col++) {
                var figureValue = figure[row][col];
                if (figureValue === 1) {
                    if (this.field[y + row] !== undefined && this.field[y + row][x + col] !== undefined) {
                        this.field[y + row][x + col] = 1;
                    }
                }
            }
        }
    }
    
    _setKeyEvents() {
        var self = this;
        $(document).keydown(function(event) {
            var code = event.which;
            if (code == 37) {
                var newX = self.currentFigurePosition.x - 1;
                if (self._validateFigure(self.currentFigure, newX, self.currentFigurePosition.y)) {
                    self.currentFigurePosition.x = newX;
                    self._render();
                }
            } else if (code === 39) {
                var newX = self.currentFigurePosition.x + 1;
                if (self._validateFigure(self.currentFigure, newX, self.currentFigurePosition.y)) {
                    self.currentFigurePosition.x = newX;
                    self._render();
                }
            }
            
        });
    }
    
    _setEmptyField() {
        for (var y = 0; y < this.rows; y++) {
            var arr = [];
            for (var x = 0; x < this.columns; x++) {
                arr.push(0);
            }
            this.field.push(arr);
        }
    }
    
    _validateFigure(figure, x, y) {
        for (var row = 0; row < figure.length; row++) {
            for (var col = 0; col < figure[row].length; col++) {
                var figureValue = figure[row][col];
                if (figureValue === 1) {
                    if (this.field[y + row] !== undefined && this.field[y + row][x + col] !== undefined) {
                        var fieldValue = this.field[y + row][x + col];
                        if (fieldValue === 1) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
            }
        }
        return true;
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
    
    drawField(field) {
        for (var row = 0; row < field.length; row++) {
            for (var col = 0; col < field[row].length; col++) {
                if (field[row][col] === 1) {
                    this.drawBlock(col, row);
                } else {
                    this.drawEmptyBlock(col, row);
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
    
    drawEmptyBlock(col, row) {
       this.ctx.strokeStyle = 'white';
       this.ctx.lineWidth = 0.5;
       this.ctx.strokeRect(col * this.blockWidth, row * this.blockHeight, this.blockWidth, this.blockHeight); 
    }
    
}



