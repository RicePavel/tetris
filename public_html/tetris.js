/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Tetris {
    
    constructor(id, options) {
        
        options = options || {};
        this.baseDelay = options.baseDelay || 1000;
        this.keydownDelay = options.keydownDelay || 50;
        this.columns = options.columns || 10;
        this.rows = options.rows || 20;
        
        this.isPlay = false; 
        this.tetrisHtml = new TetrisHtml(id, this.columns, this.rows, this, options.width, options.height);
        this.score = 0;
        this.record = 0;
        this.keyDown = false;
        this.mainDelay;
        
        this.currentFigureColor = '';
        this.currentFigure = [];
        this.currentFigurePosition = {x: 0, y: 0};
        this.field = [];
        
        this.nextFigureColor;
        this.nextFigure;
        
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
        this.figuresColors = [
            'aqua',
            'blueviolet',
            'blue',
            'darkorange',
            'yellow',
            'red',
            'green'
        ];
        this._setKeyEvents();
    }
    
    start() {
        if (!this.isPlay) {
            this.isPlay = true;
            this.tetrisHtml.hideStartButton();
            this.delay = this.baseDelay;
            this.score = 0;
            this.nextFigure = undefined;
            this.tetrisHtml.renderInfo(this.score, this.record);
            this._setEmptyField();
            this._startNewFigure();
        }
    }
    
    _startNewFigure() {
        
        var figure, figureColor;
        if (this.nextFigure) {
            figure = this.nextFigure;
            figureColor = this.nextFigureColor;
        } else {
            var figureData = this._getRandomFigureData();
            figure = figureData.figure;
            figureColor = figureData.color;
        }

        var x = Math.round(this.columns / 2) - 2;
        var y = 0;
        
        if (this._validateFigure(figure, x, y)) {
            this.currentFigure = figure;
            this.currentFigureColor = figureColor;
            this.currentFigurePosition = {x: x, y: y};
            var figureData = this._getRandomFigureData();
            this.nextFigure = figureData.figure;
            this.nextFigureColor = figureData.color;
            this._render();
            var prevTime = null;
            var self = this;
            var requestId = requestAnimationFrame(function animate(time) {
                var done = true;
                if (!prevTime) {
                    prevTime = time;
                }
                var timePassed = time - prevTime;
                var delay = (self.keyDown ? self.keydownDelay : self.delay);
                if (timePassed > delay) {
                    var newX = self.currentFigurePosition.x;
                    var newY = self.currentFigurePosition.y + 1;
                    if (self._validateFigure(self.currentFigure, newX, newY)) {
                        self.currentFigurePosition.y = newY;
                        self._render();
                    } else {
                       self._addFigureToField(self.currentFigure, self.currentFigurePosition.x, self.currentFigurePosition.y, self.currentFigureColor); 
                       self._clearLines();
                       self.currentFigure = [];
                       self.currentFigureColor = '';
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
        } else {
            this.isPlay = false;
            if (this.score > this.record) {
                this.record = this.score;
            }
            this.tetrisHtml.gameOver();
            this.tetrisHtml.showStartButton();
            this.tetrisHtml.renderInfo(this.score, this.record);
        }
    }
    
    _getRandomFigure() {
        var idx = this._randomInteger(1, this.figures.length);
        return this.figures[idx - 1];
    }
    
    _getRandomFigureData() {
        var idx = this._randomInteger(1, this.figures.length);
        return {figure: this.figures[idx - 1], color: this.figuresColors[idx - 1]};
    }
    
    _randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return rand;
    }
    
    _render() {
        this.tetrisHtml.clearCanvas();
        this.tetrisHtml.drawFigureOnMainField(this.currentFigure, this.currentFigurePosition.x, this.currentFigurePosition.y, this.currentFigureColor);
        this.tetrisHtml.drawNextFigure(this.nextFigure, this.nextFigureColor);
        this.tetrisHtml.drawField(this.field);
    }
    
    _clearLines() {
        var deleteRowsNumbers = [];
        for (var row = 0; row < this.field.length; row++) {
            var rowFill = true;
            for (var col = 0; col < this.field[row].length; col++) {
                if (this.field[row][col] === 0) {
                    rowFill = false;
                    break;
                }
            }
            if (rowFill) {
                deleteRowsNumbers.push(row);
            }
        }
        for (var i = 0; i < deleteRowsNumbers.length; i++) {
            this.field.splice(deleteRowsNumbers[i], 1);
            var newArr = [];
            for (var n = 0; n < this.columns; n++) {
                newArr.push(0);
            }
            this.field.unshift(newArr);
            this.score += 10;
            this._addSpeed();
            this.tetrisHtml.renderScore(this.score);
        }
        this._render();
    }
    
    _addSpeed() {
        if (this.delay > 300) {
            this.delay -= 100;
        } else if (this.delay <= 300 && this.delay > 200 ) {
            this.delay -= 20;
        } else if (this.delay <= 200 && this.delay > 50 ) {
            this.delay -= 10;
        }
    }
    
    _addFigureToField(figure, x, y, color) {
        for (var row = 0; row < figure.length; row++) {
            for (var col = 0; col < figure[row].length; col++) {
                var figureValue = figure[row][col];
                if (figureValue === 1) {
                    if (this.field[y + row] !== undefined && this.field[y + row][x + col] !== undefined) {
                        this.field[y + row][x + col] = color;
                    }
                }
            }
        }
    }
    
    _setKeyEvents() {
        var self = this;
        $(document).keydown(function(event) {
            var code = event.which;
            if (code === 37) {
                // влево
                var newX = self.currentFigurePosition.x - 1;
                if (self._validateFigure(self.currentFigure, newX, self.currentFigurePosition.y)) {
                    self.currentFigurePosition.x = newX;
                    self._render();
                }
            } else if (code === 39) {
                // вправо
                var newX = self.currentFigurePosition.x + 1;
                if (self._validateFigure(self.currentFigure, newX, self.currentFigurePosition.y)) {
                    self.currentFigurePosition.x = newX;
                    self._render();
                }
            } else if (code === 38) {
                // вверх
                self._turnCurrentFigure();
            } else if (code === 40) {
                // вниз
                if (!self.keyDown) {
                    self.keyDown = true;
                }
            }
        });
        $(document).keyup(function (event) {
            var code = event.which;
            if (code === 40) {
                // вниз
                self.keyDown = false;
            }
        });
    }
    
    _turnCurrentFigure() {
        var newFigureInfo = this._getTurnFigure(this.currentFigure, this.currentFigurePosition.x, this.currentFigurePosition.y);
        if (this._validateFigure(newFigureInfo.figure, newFigureInfo.x, newFigureInfo.y)) {
            this.currentFigure = newFigureInfo.figure;
            this.currentFigurePosition.x = newFigureInfo.x;
            this.currentFigurePosition.y = newFigureInfo.y;
            this._render();
        }
    }
    
    _getTurnFigure(figure, x, y) {
        var newFigure = [];
        var maxCols = 0;
        for (var r = 0; r < figure.length; r++) {
            if (figure[r].length > maxCols) {
                maxCols = figure[r].length;
            }
        }
        for (var c = 0; c < maxCols; c++) {
            var newRow = [];
            for (var r = figure.length - 1; r >= 0; r--) {
                newRow.push(figure[r][c] !== undefined ? figure[r][c] : 0);
            }
            newFigure.push(newRow);
        }
        var newX;
        if (maxCols > 3) {
            newX = x+1;
        } else {
            newX = x;
        }
        var newY = y;
        return {
            figure: newFigure,
            x: newX,
            y: newY
        };
    }
    
    _setEmptyField() {
        this.field = [];
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
                        if (fieldValue !== 0) {
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
    
    constructor(id, columns, rows, tetrisObject, width, height) {
        
        this.width = width || 200;
        this.height = height || 400;
        
        this.fieldColor = 'lightgray';
        this.lineColor = 'white';
        this.figureColor = 'dimgray';
        
        this.tetrisObject = tetrisObject;
        
        this.columns = columns;
        this.rows = rows;
        this.blockWidth = this.width / this.columns;
        this.blockHeight = this.height / this.rows;
        
        this.container = $('#' + id);
        this.container.append(
            '<canvas class="mainCanvas"></canvas>' +
            '<canvas class="nextCanvas"></canvas>' +
            '<div class="infoContainer">' +
                '<div class="text">Счет: <span class="score"></span></div>' +
                '<div class="text">Рекорд: <span class="record">0</span></div>' +
                '<div class="text"><span class="gameStatus"></span></div>' +
            '</div>' +
            '<input type="submit" class="startInput" value="START" />'
            );
        
        this.canvas = this.container.find('.mainCanvas')[0];
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        this.clearCanvas();
        this.nextFigureCanvas = this.container.find('.nextCanvas')[0];
        this.nextFigureCanvas.width = this.blockWidth * 6;
        this.nextFigureCanvas.height = this.blockHeight * 6;
        this.nextFigureCtx = this.nextFigureCanvas.getContext('2d');
        this.nextFigureCtx.fillStyle = this.fieldColor;
        this.nextFigureCtx.fillRect(0, 0, this.nextFigureCanvas.width, this.nextFigureCanvas.height);
        
        var self = this;
        
        this.container.find('.startInput').click(function() {
            self.tetrisObject.start();
        });
    }
    
    clearCanvas() {
        this.ctx.fillStyle = this.fieldColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    drawNextFigure(arr, color) {
        this._clearNextCanvas();
        if (arr) {
            this._drawFigure(arr, 1, 1, this.nextFigureCtx, color);
        }
    }
    
    drawFigureOnMainField(arr, startCol, startRow, color) {
        this._drawFigure(arr, startCol, startRow, this.ctx, color);
    }
    
    _clearNextCanvas() {
        this.nextFigureCtx.fillStyle = this.fieldColor;
        this.nextFigureCtx.fillRect(0, 0, this.nextFigureCanvas.width, this.nextFigureCanvas.height);
    }
    
    _drawFigure(arr, startCol, startRow, ctx, color) {
        if (color === undefined) {
            color = this.figureColor;
        }
        for (var row = 0; row < arr.length; row++) {
            for (var col = 0; col < arr[row].length; col++) {
                var value = arr[row][col];
                if (value === 1) {
                    this._drawBlock(startCol + col, startRow + row, ctx, color);
                }
            }
        }
    }
    
    renderScore(score) {
        this.container.find('.score').text(score);
    }
    
    renderInfo(score, record) {
        this.container.find('.score').text(score);
        this.container.find('.record').text(record);
    }
    
    gameOver() {
        this.container.find('.gameStatus').text('Game over');
    }
    
    drawField(field) {
        for (var row = 0; row < field.length; row++) {
            for (var col = 0; col < field[row].length; col++) {
                if (field[row][col] !== 0) {
                    this._drawBlock(col, row, this.ctx, field[row][col]);
                } else {
                    this._drawEmptyBlock(col, row);
                }    
            }
        }
    }
    
    hideStartButton() {
        this.container.find('.startInput').hide();
    }
    
    showStartButton() {
        this.container.find('.startInput').show();
    }
    
    _drawBlock(col, row, ctx, color) {
        if (color === undefined) {
            color = this.figureColor;
        }
        ctx.fillStyle = color;
        ctx.fillRect(col * this.blockWidth, row * this.blockHeight, this.blockWidth, this.blockHeight);
        ctx.strokeStyle = this.lineColor;
        ctx.strokeRect(col * this.blockWidth, row * this.blockHeight, this.blockWidth, this.blockHeight);
    }
    
    _drawEmptyBlock(col, row) {
       this.ctx.strokeStyle = this.lineColor;
       this.ctx.lineWidth = 0.5;
       this.ctx.strokeRect(col * this.blockWidth, row * this.blockHeight, this.blockWidth, this.blockHeight); 
    }
    
    
    
}



