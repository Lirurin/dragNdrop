document.addEventListener('DOMContentLoaded', function() {
  // variables
  let bricks = document.querySelectorAll('.bricks__block')
  let buildingArea = document.querySelector('.droppable');
  let bricksPile = document.querySelector('.bricks__pile');
  let building = document.querySelector('.building');
  let areaOvered = false;
  let brickCount = 10;
  let pathsLength = [];
  let path;

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  //svg load
  function svgLoad() {
    let xhr = new XMLHttpRequest;
    xhr.open('get',`../img/${ getRandomInt(0, 3)}.svg`,true);
    xhr.onreadystatechange = function(){
      if (xhr.readyState != 4) return;
      let svg = xhr.responseXML.documentElement;
      svg = document.importNode(svg,true);
      building.appendChild(svg);
      getSvgPath()
      dragInit()
    };
    xhr.send();
  }
  svgLoad()

  function getSvgPath() {
    path = document.querySelectorAll('.building svg path');
    pathsLength = [];
    for (let i = 0; i < path.length; i++) {
      pathsLength.push(path[i].getTotalLength())
    }
  }

  function dragInit() {
    for (let i = 0; i<bricks.length; i++) {
      dragNdrop(bricks[i])
    }
  }
  
  function addMaterialsToBuilding() {
     for (let i = 0; i < path.length; i++) {
      let currentLength = pathsLength[i];
      path[i].style.stroke = '#000000',
      path[i].style.strokeDasharray = currentLength + ' ' + currentLength;
      path[i].style.strokeDashoffset = currentLength;
      path[i].getBoundingClientRect();
      path[i].style.transition = path[i].style.WebkitTransition =
        'stroke-dashoffset 1s ease-in-out';
      if (brickCount !== 0) {
        path[i].style.strokeDashoffset = `${currentLength - currentLength/brickCount}`;
      } else {
        path[i].style.transition = path[i].style.WebkitTransition = 'fill 1s ease ';
        path[i].style.fill = '#000000'
      }
      console.log('path', path)
      console.log('currentLength', currentLength - currentLength/10*brickCount)
    }
  }

  function createBrick() {
    let newBrick = document.createElement("div");
    newBrick.innerHTML = "<div class='bricks__cont'>кирпич</div>";
    newBrick.setAttribute('id', 'brick');
    newBrick.setAttribute('class', 'bricks__block');
    bricksPile.appendChild(newBrick);
    dragNdrop(newBrick)
    addMaterialsToBuilding()
  }

  // dragNdrop
  function dragNdrop(brick) {
    brick.onmousedown = function(event) {
      let shiftX = event.clientX - brick.getBoundingClientRect().left;
      let shiftY = event.clientY - brick.getBoundingClientRect().top;
      let buildingAreaParams = {
        x1: buildingArea.getBoundingClientRect().left,
        y1: buildingArea.getBoundingClientRect().top,
        x2: buildingArea.getBoundingClientRect().left + buildingArea.getBoundingClientRect().width,
        y2: buildingArea.getBoundingClientRect().top + buildingArea.getBoundingClientRect().height,
      }
      let brickAreaParams = {
        x1: brick.getBoundingClientRect().left,
        y1: brick.getBoundingClientRect().top,
        x2: brick.getBoundingClientRect().left + brick.getBoundingClientRect().width,
        y2: brick.getBoundingClientRect().top + brick.getBoundingClientRect().height,
      }
  
      brick.style.position = 'absolute';
      brick.style.zIndex = 1000;
      document.body.append(brick);
      moveAt(event.pageX, event.pageY);
      function moveAt(pageX, pageY) {
        brick.style.left = pageX - shiftX + 'px';
        brick.style.top = pageY - shiftY + 'px';
      }
  
      function onMouseMove(event) {
        brickAreaParams = {
          x1: brick.getBoundingClientRect().left,
          y1: brick.getBoundingClientRect().top,
          x2: brick.getBoundingClientRect().left + brick.getBoundingClientRect().width,
          y2: brick.getBoundingClientRect().top + brick.getBoundingClientRect().height,
        }

        // collision detection 
        if (((brickAreaParams.x1 >= buildingAreaParams.x1 && brickAreaParams.x1 < buildingAreaParams.x2) 
        || (brickAreaParams.x2 < buildingAreaParams.x2 && brickAreaParams.x2 >= buildingAreaParams.x1))
        && ((brickAreaParams.y1 >= buildingAreaParams.y1 && brickAreaParams.y1 < buildingAreaParams.y2) 
        || (brickAreaParams.y2 < buildingAreaParams.y2 && brickAreaParams.y2 >= buildingAreaParams.y1))) {
          enterDroppable(buildingArea);
          areaOvered = true;
        } else {
          leaveDroppable(buildingArea);
          areaOvered = false;
        }
        moveAt(event.pageX, event.pageY);
        brick.hidden = true;
        brick.hidden = false;
      }
  
      document.addEventListener('mousemove', onMouseMove);
      brick.onmouseup = function() {
        if (areaOvered) {
          if (brickCount === 0) {
            brickCount = 10;
            building.removeChild(building.childNodes[0])
            setTimeout(svgLoad(), 1)
          } else {
             brickCount -= 1;
          }
         
          document.querySelector('.bricks__text--count').textContent = `Осталось собрать ${brickCount} кирпича`;
          brick.remove()
          createBrick()
        }
        document.removeEventListener('mousemove', onMouseMove);
        brick.onmouseup = null;
        leaveDroppable(buildingArea);
      };
    };
  
    function enterDroppable(elem) {
      elem.classList.add("hovered")
    }
  
    function leaveDroppable(elem) {
      elem.classList.remove("hovered")
    }
  
    brick.ondragstart = function() {
      return false;
    };
  }

}, false);