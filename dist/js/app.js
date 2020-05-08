(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

document.addEventListener('DOMContentLoaded', function () {
  // variables
  var bricks = document.querySelectorAll('.bricks__block');
  var buildingArea = document.querySelector('.bricks__droppable');
  var bricksPile = document.querySelector('.bricks__pile');
  var building = document.querySelector('.building');
  var isAreaOvered = false;
  var brickCount = 10;
  var pathsLength = [];
  var paths;

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  } // svg load


  function svgLoad() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', "../img/".concat(getRandomInt(0, 3), ".svg"), true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4) return;
      var svg = xhr.responseXML.documentElement;
      svg = document.importNode(svg, true);
      building.appendChild(svg);
      getSvgPath();
      dragInit();
    };

    xhr.send();
  }

  svgLoad();

  function getSvgPath() {
    pathsLength = [];
    paths = document.querySelectorAll('.building svg path');
    pathsLength = Object.values(paths).map(function (path) {
      return path.getTotalLength();
    });
  }

  function dragInit() {
    var _iterator = _createForOfIteratorHelper(bricks),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var brick = _step.value;
        dragNdrop(brick);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  function addMaterialsToBuilding() {
    Object.values(paths).forEach(function (path, index) {
      var currentLength = pathsLength[index];
      Object.assign(path.style, {
        stroke: '#ffffff',
        strokeDasharray: "".concat(currentLength, " ").concat(currentLength),
        strokeDashoffset: currentLength,
        fill: brickCount > 0 ? 'transparent' : '#ffffff'
      });
      path.getBoundingClientRect();

      if (brickCount > 0) {
        Object.assign(path.style, {
          transition: 'stroke-dashoffset 1s ease-in-out, fill 1s ease',
          strokeDashoffset: "".concat(currentLength - currentLength / brickCount)
        });
      }
    });
  }

  function createBrick() {
    var newBrick = document.createElement("div");
    newBrick.innerHTML = "<div class='bricks__cont'>кирпич</div>";
    newBrick.setAttribute('id', 'brick');
    newBrick.setAttribute('class', 'bricks__block');
    bricksPile.appendChild(newBrick);
    dragNdrop(newBrick);
    addMaterialsToBuilding();
  }

  function createNewObject(node) {
    return Object.create({
      x1: node.getBoundingClientRect().left,
      y1: node.getBoundingClientRect().top,
      x2: node.getBoundingClientRect().left + node.getBoundingClientRect().width,
      y2: node.getBoundingClientRect().top + node.getBoundingClientRect().height
    });
  } // dragNdrop


  function dragNdrop(brick) {
    brick.onmousedown = function (event) {
      var shiftX = event.clientX - brick.getBoundingClientRect().left;
      var shiftY = event.clientY - brick.getBoundingClientRect().top;
      var buildingAreaParams = createNewObject(buildingArea);
      var brickAreaParams = createNewObject(brick);
      brick.style.position = 'absolute';
      brick.style.zIndex = 1000;
      document.body.append(brick);
      moveAt(event.pageX, event.pageY);

      function moveAt(pageX, pageY) {
        brick.style.left = "".concat(pageX - shiftX, "px");
        brick.style.top = "".concat(pageY - shiftY, "px");
      } // collision detection 


      function detectCollision() {
        var topCollide = brickAreaParams.y1 >= buildingAreaParams.y1 && brickAreaParams.y1 < buildingAreaParams.y2;
        var bottomCollide = brickAreaParams.y2 < buildingAreaParams.y2 && brickAreaParams.y2 >= buildingAreaParams.y1;
        var leftCollide = brickAreaParams.x2 < buildingAreaParams.x2 && brickAreaParams.x2 >= buildingAreaParams.x1;
        var rightCollide = brickAreaParams.x1 >= buildingAreaParams.x1 && brickAreaParams.x1 < buildingAreaParams.x2;
        return (rightCollide || leftCollide) && (topCollide || bottomCollide);
      }

      function onMouseMove(event) {
        brickAreaParams = createNewObject(brick);

        if (detectCollision()) {
          enterDroppable(buildingArea);
          isAreaOvered = true;
        } else {
          leaveDroppable(buildingArea);
          isAreaOvered = false;
        }

        moveAt(event.pageX, event.pageY);
        brick.hidden = true;
        brick.hidden = false;
      }

      document.addEventListener('mousemove', onMouseMove);

      brick.onmouseup = function () {
        if (isAreaOvered) {
          if (brickCount === 0) {
            brickCount = 10;
            building.removeChild(building.childNodes[0]);
            setTimeout(svgLoad(), 1);
          } else {
            brickCount -= 1;
          }

          document.querySelector('.bricks__text--count').textContent = "\u041E\u0441\u0442\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0431\u0440\u0430\u0442\u044C ".concat(brickCount, " \u043A\u0438\u0440\u043F\u0438\u0447\u0430");
          brick.remove();
          createBrick();
        }

        document.removeEventListener('mousemove', onMouseMove);
        brick.onmouseup = null;
        leaveDroppable(buildingArea);
      };
    };

    function enterDroppable(elem) {
      elem.classList.add("hovered");
    }

    function leaveDroppable(elem) {
      elem.classList.remove("hovered");
    }

    brick.ondragstart = function () {
      return false;
    };
  }
}, false);

},{}]},{},[1]);
