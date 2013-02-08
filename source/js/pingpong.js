$(function(){
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

    function V(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }

    function Player(stuff) {

    }



    function PingpongViewModel(w, h) {
        var self = this;
        this.width = ko.observable(w);
        this.height = ko.observable(h);
        this.ball = new Ball(w/2, h/2, 20, new V(10, 10));
        this.player1 = new Player('#player1');
        this.player2 = new Player('#player2');
        this.velocity = v(10, 10);
        this.start = function() {
            setInterval(self.tick, 30);
        }
        this.tick = function() {
            var ball = self.ball;
            if (ball.y() < ball.r) {
                ball.v;
            } else if (ball.y() > self.width() - ball.r) {
                ball.v;
            }
            self.ball.tick();
        }
    }

    var pingpong = new PingpongViewModel(600, 600);
    ko.applyBindings(pingpong);
    pingpong.start();
});