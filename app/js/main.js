document.addEventListener('DOMContentLoaded', function() {
  let buildingArea = document.querySelector('.droppable')
  let areaOvered = false;
  let brickCount = 0;
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
      x2: brick.getBoundingClientRect().left + buildingArea.getBoundingClientRect().width,
      y2: brick.getBoundingClientRect().top + buildingArea.getBoundingClientRect().height,
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
        brickCount += 1;
        document.querySelector('.bricks__text--count').textContent = `Собрано ${brickCount}`;
      }
      document.removeEventListener('mousemove', onMouseMove);
      brick.onmouseup = null;
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
}, false);