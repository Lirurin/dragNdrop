document.addEventListener('DOMContentLoaded', function() {
  // variables
  const bricks = document.querySelectorAll('.bricks__block')
  const buildingArea = document.querySelector('.bricks__droppable');
  const bricksPile = document.querySelector('.bricks__pile');
  const building = document.querySelector('.building');
  let isAreaOvered = false;
  let brickCount = 10;
  let pathsLength = [];
  let paths;

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // svg load
  function svgLoad() {
    const xhr = new XMLHttpRequest;
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
    pathsLength = [];
    paths = document.querySelectorAll('.building svg path');
    pathsLength = Object.values(paths).map(path => path.getTotalLength());
  }

  function dragInit() {
    for (let brick of bricks) {
      dragNdrop(brick)
    }
  }
  
  function addMaterialsToBuilding() {
    Object.values(paths).forEach((path, index) => {
      const currentLength = pathsLength[index];
      Object.assign(path.style, {
        stroke: '#ffffff',
        strokeDasharray: `${currentLength} ${currentLength}`,
        strokeDashoffset: currentLength,
        fill: brickCount > 0 ? 'transparent' : '#ffffff',
      });
      path.getBoundingClientRect();
      if (brickCount > 0) {
        Object.assign(path.style, {
          transition: 'stroke-dashoffset 1s ease-in-out, fill 1s ease',
          strokeDashoffset: `${currentLength - currentLength / brickCount}`,
        });
      } 
    })
  }

  function createBrick() {
    const newBrick = document.createElement("div");
    newBrick.innerHTML = "<div class='bricks__cont'>кирпич</div>";
    newBrick.setAttribute('id', 'brick');
    newBrick.setAttribute('class', 'bricks__block');
    bricksPile.appendChild(newBrick);
    dragNdrop(newBrick)
    addMaterialsToBuilding()
  }

  function createNewObject(node) {
    return Object.create({
      x1: node.getBoundingClientRect().left,
      y1: node.getBoundingClientRect().top,
      x2: node.getBoundingClientRect().left + node.getBoundingClientRect().width,
      y2: node.getBoundingClientRect().top + node.getBoundingClientRect().height,
    })
  }
  
  // dragNdrop
  function dragNdrop(brick) {
    brick.onmousedown = function(event) {
      
      const shiftX = event.clientX - brick.getBoundingClientRect().left;
      const shiftY = event.clientY - brick.getBoundingClientRect().top;
      let buildingAreaParams = createNewObject(buildingArea)
      let brickAreaParams = createNewObject(brick)
  
      brick.style.position = 'absolute';
      brick.style.zIndex = 1000;
      document.body.append(brick);
      moveAt(event.pageX, event.pageY);
      function moveAt(pageX, pageY) {
        brick.style.left = `${pageX - shiftX}px`;
        brick.style.top = `${pageY - shiftY}px`;
      }
      
      // collision detection 
      function detectCollision() {
        const topCollide = brickAreaParams.y1 >= buildingAreaParams.y1 && brickAreaParams.y1 < buildingAreaParams.y2;
        const bottomCollide = brickAreaParams.y2 < buildingAreaParams.y2 && brickAreaParams.y2 >= buildingAreaParams.y1;
        const leftCollide = brickAreaParams.x2 < buildingAreaParams.x2 && brickAreaParams.x2 >= buildingAreaParams.x1;
        const rightCollide = brickAreaParams.x1 >= buildingAreaParams.x1 && brickAreaParams.x1 < buildingAreaParams.x2;
        return (rightCollide || leftCollide) && (topCollide || bottomCollide)
      }

      function onMouseMove(event) {
        brickAreaParams = createNewObject(brick)

        if ( detectCollision() ) {
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
      brick.onmouseup = function() {
        if (isAreaOvered) {
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