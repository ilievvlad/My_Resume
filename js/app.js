(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    window.addEventListener("load", windowLoadHandler, false);
    var Debugger = function() {};
    Debugger.log = function(message) {
        try {
            console.log(message);
        } catch (exception) {
            return;
        }
    };
    function windowLoadHandler() {
        canvasApp();
    }
    function canvasApp() {
        var theCanvas = document.getElementById("canvasOne");
        var context = theCanvas.getContext("2d");
        var displayWidth;
        var displayHeight;
        var wait;
        var count;
        var numToAddEachFrame;
        var particleList;
        var recycleBin;
        var particleAlpha;
        var r, g, b;
        var fLen;
        var m;
        var projCenterX;
        var projCenterY;
        var zMax;
        var turnAngle;
        var turnSpeed;
        var sphereRad, sphereCenterY, sphereCenterZ;
        var particleRad;
        var zeroAlphaDepth;
        var randAccelX, randAccelY, randAccelZ;
        var gravity;
        var rgbString;
        var outsideTest;
        var nextParticle;
        var sinAngle;
        var cosAngle;
        var rotX, rotZ;
        var depthAlphaFactor;
        var i;
        var theta, phi;
        var x0, y0, z0;
        init();
        function init() {
            wait = 1;
            count = wait - 1;
            numToAddEachFrame = 8;
            r = 32;
            g = 148;
            b = 243;
            rgbString = "rgba(" + r + "," + g + "," + b + ",";
            particleAlpha = 1;
            displayWidth = theCanvas.width;
            displayHeight = theCanvas.height;
            fLen = 320;
            projCenterX = displayWidth / 2;
            projCenterY = displayHeight / 2;
            zMax = fLen - 2;
            particleList = {};
            recycleBin = {};
            randAccelX = .1;
            randAccelY = .1;
            randAccelZ = .1;
            gravity = 0;
            particleRad = 2.5;
            sphereRad = 280;
            0;
            sphereCenterY = 0;
            sphereCenterZ = -3 - sphereRad;
            zeroAlphaDepth = -750;
            turnSpeed = 2 * Math.PI / 1600;
            turnAngle = 0;
            setInterval(onTimer, 1e3 / 24);
        }
        function onTimer() {
            count++;
            if (count >= wait) {
                count = 0;
                for (i = 0; i < numToAddEachFrame; i++) {
                    theta = 2 * Math.random() * Math.PI;
                    phi = Math.acos(2 * Math.random() - 1);
                    x0 = sphereRad * Math.sin(phi) * Math.cos(theta);
                    y0 = sphereRad * Math.sin(phi) * Math.sin(theta);
                    z0 = sphereRad * Math.cos(phi);
                    var p = addParticle(x0, sphereCenterY + y0, sphereCenterZ + z0, .002 * x0, .002 * y0, .002 * z0);
                    p.attack = 50;
                    p.hold = 50;
                    p.decay = 160;
                    p.initValue = 0;
                    p.holdValue = particleAlpha;
                    p.lastValue = 0;
                    p.stuckTime = 80 + 20 * Math.random();
                    p.accelX = 0;
                    p.accelY = gravity;
                    p.accelZ = 0;
                }
            }
            turnAngle = (turnAngle + turnSpeed) % (2 * Math.PI);
            sinAngle = Math.sin(turnAngle);
            cosAngle = Math.cos(turnAngle);
            context.fillStyle = "#1f1f1f";
            context.fillRect(0, 0, displayWidth, displayHeight);
            p = particleList.first;
            while (null != p) {
                nextParticle = p.next;
                p.age++;
                if (p.age > p.stuckTime) {
                    p.velX += p.accelX + randAccelX * (2 * Math.random() - 1);
                    p.velY += p.accelY + randAccelY * (2 * Math.random() - 1);
                    p.velZ += p.accelZ + randAccelZ * (2 * Math.random() - 1);
                    p.x += p.velX;
                    p.y += p.velY;
                    p.z += p.velZ;
                }
                rotX = cosAngle * p.x + sinAngle * (p.z - sphereCenterZ);
                rotZ = -sinAngle * p.x + cosAngle * (p.z - sphereCenterZ) + sphereCenterZ;
                m = fLen / (fLen - rotZ);
                p.projX = rotX * m + projCenterX;
                p.projY = p.y * m + projCenterY;
                if (p.age < p.attack + p.hold + p.decay) {
                    if (p.age < p.attack) p.alpha = (p.holdValue - p.initValue) / p.attack * p.age + p.initValue; else if (p.age < p.attack + p.hold) p.alpha = p.holdValue; else if (p.age < p.attack + p.hold + p.decay) p.alpha = (p.lastValue - p.holdValue) / p.decay * (p.age - p.attack - p.hold) + p.holdValue;
                } else p.dead = true;
                if (p.projX > displayWidth || p.projX < 0 || p.projY < 0 || p.projY > displayHeight || rotZ > zMax) outsideTest = true; else outsideTest = false;
                if (outsideTest || p.dead) recycle(p); else {
                    depthAlphaFactor = 1 - rotZ / zeroAlphaDepth;
                    depthAlphaFactor = depthAlphaFactor > 1 ? 1 : depthAlphaFactor < 0 ? 0 : depthAlphaFactor;
                    context.fillStyle = rgbString + depthAlphaFactor * p.alpha + ")";
                    context.beginPath();
                    context.arc(p.projX, p.projY, m * particleRad, 0, 2 * Math.PI, false);
                    context.closePath();
                    context.fill();
                }
                p = nextParticle;
            }
        }
        function addParticle(x0, y0, z0, vx0, vy0, vz0) {
            var newParticle;
            if (null != recycleBin.first) {
                newParticle = recycleBin.first;
                if (null != newParticle.next) {
                    recycleBin.first = newParticle.next;
                    newParticle.next.prev = null;
                } else recycleBin.first = null;
            } else newParticle = {};
            if (null == particleList.first) {
                particleList.first = newParticle;
                newParticle.prev = null;
                newParticle.next = null;
            } else {
                newParticle.next = particleList.first;
                particleList.first.prev = newParticle;
                particleList.first = newParticle;
                newParticle.prev = null;
            }
            newParticle.x = x0;
            newParticle.y = y0;
            newParticle.z = z0;
            newParticle.velX = vx0;
            newParticle.velY = vy0;
            newParticle.velZ = vz0;
            newParticle.age = 0;
            newParticle.dead = false;
            if (Math.random() < .5) newParticle.right = true; else newParticle.right = false;
            return newParticle;
        }
        function recycle(p) {
            if (particleList.first == p) if (null != p.next) {
                p.next.prev = null;
                particleList.first = p.next;
            } else particleList.first = null; else if (null == p.next) p.prev.next = null; else {
                p.prev.next = p.next;
                p.next.prev = p.prev;
            }
            if (null == recycleBin.first) {
                recycleBin.first = p;
                p.prev = null;
                p.next = null;
            } else {
                p.next = recycleBin.first;
                recycleBin.first.prev = p;
                recycleBin.first = p;
                p.prev = null;
            }
        }
    }
    (function() {
        var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d"), w = canvas.width = innerWidth, h = canvas.height = "400", particles = [], properties = {
            bgColor: "#1f1f1f",
            particleColor: "#2094f3",
            particleRadius: 3,
            particleCount: 40,
            particleMaxVelocity: .5,
            lineLength: 120,
            particleLife: 6
        };
        document.querySelector(".contacts__container").appendChild(canvas);
        window.onresize = function() {
            w = canvas.width = innerWidth, h = canvas.height = innerHeight;
        };
        class Particle {
            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.velocityX = Math.random() * (2 * properties.particleMaxVelocity) - properties.particleMaxVelocity;
                this.velocityY = Math.random() * (2 * properties.particleMaxVelocity) - properties.particleMaxVelocity;
                this.life = Math.random() * properties.particleLife * 60;
            }
            position() {
                this.x + this.velocityX > w && this.velocityX > 0 || this.x + this.velocityX < 0 && this.velocityX < 0 ? this.velocityX *= -1 : this.velocityX;
                this.y + this.velocityY > h && this.velocityY > 0 || this.y + this.velocityY < 0 && this.velocityY < 0 ? this.velocityY *= -1 : this.velocityY;
                this.x += this.velocityX;
                this.y += this.velocityY;
            }
            reDraw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, properties.particleRadius, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fillStyle = properties.particleColor;
                ctx.fill();
            }
            reCalculateLife() {
                if (this.life < 1) {
                    this.x = Math.random() * w;
                    this.y = Math.random() * h;
                    this.velocityX = Math.random() * (2 * properties.particleMaxVelocity) - properties.particleMaxVelocity;
                    this.velocityY = Math.random() * (2 * properties.particleMaxVelocity) - properties.particleMaxVelocity;
                    this.life = Math.random() * properties.particleLife * 60;
                }
                this.life--;
            }
        }
        function reDrawBackground() {
            ctx.fillStyle = properties.bgColor;
            ctx.fillRect(0, 0, w, h);
        }
        function drawLines() {
            var x1, y1, x2, y2, length, opacity;
            for (var i in particles) for (var j in particles) {
                x1 = particles[i].x;
                y1 = particles[i].y;
                x2 = particles[j].x;
                y2 = particles[j].y;
                length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                if (length < properties.lineLength) {
                    opacity = 1 - length / properties.lineLength;
                    ctx.lineWidth = "0.5";
                    ctx.strokeStyle = "rgba(32, 148, 243, " + opacity + ")";
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        }
        function reDrawParticles() {
            for (var i in particles) {
                particles[i].reCalculateLife();
                particles[i].position();
                particles[i].reDraw();
            }
        }
        function loop() {
            reDrawBackground();
            reDrawParticles();
            drawLines();
            requestAnimationFrame(loop);
        }
        function init() {
            for (var i = 0; i < properties.particleCount; i++) particles.push(new Particle);
            loop();
        }
        init();
    })();
    window["FLS"] = true;
    isWebp();
})();