$(function(){
    var width = 600;

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
    }

    function v(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }

    function Player(position, computer) {
        this.self = this;
        this.k = (position == 'up') ? 1 : -1;
        this.height = 10;
        this.speed = 10;
        this.x = ko.observable(width / 2);
        this.width = 40;
        this.moveLeft = function() {
            if (self.x() - self.speed > 0) {
                self.x(self.x() - self.speed);
            }
        }
        this.moveRight = function() {
            if (self.x() + self.width + self.speed > width) {
                self.x(self.x() + self.speed);
            }
        }
        this.interactWith = function(ball) {
            if (self.k * self.border > self.k * ball.x()) {
                ball.v.dx = - ball.v.dx;
            }
        }
        if (computer) {
            this.defendFrom = function(ball){
                if (self.x() > ball.x()) {
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

    function PingpongViewModel(w, h) {
        var self = this;
        this.width = ko.observable(w);
        this.height = ko.observable(h);
        this.ball   = new Ball(w/2, h/2, 20, new v(-5, 2.5));
        this.player1   = new Player('#player1');
        this.player2   = new Player('#player2');
        this.leftWall  = new Wall(0, 'left');
        this.rightWall = new Wall(w, 'right');
        this.start = function() {
            setInterval(self.tick, 30);
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
        }
    }

    var pingpong = new PingpongViewModel(width, 600);
    ko.applyBindings(pingpong);
    pingpong.start();
});