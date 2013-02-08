$(function(){
    var width = 600;
    var height = 600;
    var leftArrowPressed  = false;
    var rightArrowPressed = false;


    var pingpong = new PingpongViewModel(width, height);
    ko.applyBindings(pingpong);
    pingpong.start();

    $('body').keydown(function(e){
        console.log(e.which);
        if (e.which == 37) { leftArrowPressed  = true }
        if (e.which == 39) { rightArrowPressed = true }
    })

    $('body').keyup(function(){
        rightArrowPressed = leftArrowPressed = false;
    })

    function v(dx, dy) {  // velocity
        this.dx = dx;
        this.dy = dy;
    }

    function Ball(x, y, r, v) {
        var self = this;
        this.r = r;
        this.x = ko.observable(x);
        this.y = ko.observable(y);
        this.v = v;
        this.tick = function() {
            var x = self.x();
            var y = self.y();
            self.x(x + self.v.dx);
            self.y(y + self.v.dy);
        }
        this.include = function(x,y) {
            var dx = x - self.x();
            var dy = y - self.y();

            return dx*dx + dy*dy < self.r * self.r ;
        }
    }

    function Player(options) {
        var self = this;
        var position = options['position'];
        var computer = typeof(options['computer']) != 'undefined' && options['position'];
        this.k = (position == 'up') ? 1 : -1;
        this.height = 8;
        this.width = 120;
        this.x = ko.observable((width - self.width) / 2);
        this.y = (position == 'up') ? 0 : height - this.height;
        this.speed = 3;
        this.moveLeft = function() {
            if (self.x() - self.speed > 0) {
                self.x(self.x() - self.speed);
            }
        }
        this.moveRight = function() {
            if (self.x() + self.width + self.speed < width) {
                self.x(self.x() + self.speed);
            }
        }
        this.interactWith = function(ball) {
            if (ball.x() > self.x() && ball.x() < self.x() + self.width) {
                if (self.k * self.y + ball.r + ((position == 'up') ? self.height : 0) > self.k * ball.y()) {
                    ball.v.dy = - ball.v.dy;
                }
            } else if (self.sideCollision(ball)) {
                ball.v.dy = -ball.v.dy;
                ball.v.dx = -ball.v.dx;
            }
        }
        this.sideCollision = function (ball) {
            return ball.include(self.x(), self.y) ||
                   ball.include(self.x() + self.width, self.y);
        }
        if (computer) {
            this.defendFrom = function(ball){
                if (self.x() + self.width / 2  > ball.x()) {
                    self.moveLeft();
                } else {
                    self.moveRight();
                }
            }
        }

    }

    function Wall(xBorder, position) {
        var self = this;
        this.left = (position == 'left') ? true : false;
        this.k = this.left ? 1 : -1;
        this.border = xBorder;
        this.interactWith = function(ball) {
            if (self.k * self.border + ball.r > self.k * ball.x()) {
                ball.v.dx = - ball.v.dx;
            }
        }
    }

    function Border(yBorder, position, wonMessage) {
        var self = this;
        this.up = (position == 'up') ? true : false;
        this.k = this.up ? 1 : -1;
        this.border = yBorder;
        this.interactWith = function(ball) {
            if (self.k * self.border + ball.r > self.k * ball.y()) {
                alert(wonMessage);
                pingpong.start();
            }
        }
    }

    function PingpongViewModel(w, h) {
        var self = this;
        this.width   = w;
        this.height  = h;

        this.ball    = new Ball(w/2, h/2, 20, new v(5, 3));
        this.player1    = new Player({position: 'up', computer: true});
        this.player2    = new Player({position: 'down'});
        this.leftWall   = new Wall(0, 'left');
        this.rightWall  = new Wall(w, 'right');
        this.upBorder   = new Border(0, 'up', 'You won! Thanks for good match.');
        this.downBorder = new Border(h, 'down', 'Computer won! All hail our robots!');

        self.interval = 0;
        this.start = function() {
            self.ball.x(self.width/2);
            self.ball.y(self.height/2);
            if (self.interval != 0) { clearInterval(self.interval); self.interval = 0; }
            self.interval = setInterval(self.tick, 20);
        }
        this.tick = function() {
            var ball = self.ball;
            for (var key in self) {
                var object = self[key];
                if (typeof(object['interactWith']) != 'undefined') {
                    object.interactWith(ball);
                }
                if (typeof(object['defendFrom']) != 'undefined') {
                    object.defendFrom(ball);
                }
            }
            self.ball.tick();

            if (leftArrowPressed)  { self.player2.moveLeft();  } else
            if (rightArrowPressed) { self.player2.moveRight(); }
        }
    }


});