var size = 16;
var timer;
var direction = "up";
var theblock;
var blocks = new Array();
var segment;
var score = 0;
var locked = false;
var inprogress = false;

function d(id)
{
  var el = document.getElementById(id);
  return el;
}
function drawGrid()
{
    document.getElementById("grid").innerHTML = "";

    for(var i = 0; i < size; i++)
    {
        var row = document.createElement("tr");

        for(var x = 0; x < size; x++)
        {
            var cell = document.createElement("td");
            row.appendChild(cell);
        }
        document.getElementById("grid").appendChild(row);
    }
}

function createBlock()
{
    theblock = {x:size/2, y:size/2, dir: direction};
    drawBlock();
}

function drawBlock()
{
    var parent = document.getElementById("grid");
    parent.rows[theblock.y].cells[theblock.x].style.backgroundColor = "black";
}

function startCountdown()
{
    document.getElementById("btnStart").innerHTML = "Get ready...";
    setTimeout(function(){
        if (inprogress==false)
            start();
    }, 2000);
}

function start()
{
    document.getElementById("score").innerHTML = "";
    document.getElementById("btnStart").style.display = "none";
    blocks = new Array();
    load();
    addBlock();
    document.onkeydown = checkKey;
    timer = setInterval(function(){move();}, 100);
    inprogress=true;
}

// moves the head segment
function move()
{
    locked = true;
    clearBlock(theblock);
    var directionChange = false;
    var directionChangeValue;

    // if direction change
    if (theblock.dir != direction)
    {
        directionChangeValue = {x:theblock.x, y:theblock.y, direction};
        directionChange = true;
        theblock.dir = direction;
    }

    switch(direction)
    {
        case "up":
            theblock.y--;
            break;

        case "down":
            theblock.y++;
            break;

        case "left":
            theblock.x--;
            break;

        case "right":
            theblock.x++;
            break;
    }

    // LOSE CONDITION
    if (theblock.x < 0 || theblock.y < 0 || theblock.x >= size || theblock.y >= size || collision(theblock.x, theblock.y))
    {
        inprogress=false;
        document.getElementById("score").innerHTML = blocks.length;
        document.getElementById("btnRestart").style.display = "block";
        clearInterval(timer);
    }

    else
    {
        drawBlock();
        moveBody();
        checkBlock();
    }

    // its called late so that new segments will also get the direction changes
    if (directionChange)
        addDirections(directionChangeValue);

    locked=false;
}

function moveBody()
{
    var parent = document.getElementById("grid");

    // move all of the snake segments by 1, in the appropriate direction
    for(var i = 0; i < blocks.length; i++)
    {
        parent.rows[blocks[i].y].cells[blocks[i].x].style.backgroundColor = "white";
        blocks[i].dir = getDirection(blocks[i]);

        switch(blocks[i].dir)
        {
            case "up":
                blocks[i].y--;
                break;

            case "down":
                blocks[i].y++;
                break;

            case "left":
                blocks[i].x--;
                break;

            case "right":
                blocks[i].x++;
                break;
        }

        parent.rows[blocks[i].y].cells[blocks[i].x].style.backgroundColor = "black";
    }
}

function collision(x, y)
{
    // collission happens when theBlock occupies the same space as any of the 'blocks'
    // can be used both for new blocks getting added and snake head collisions
    for(var i = 0; i < blocks.length; i++)
    {
        if (x == blocks[i].x && y == blocks[i].y)
            return true;
    }

    return false;
}

function getDirection(blockParam)
{
    // check if block needs to change direction
    for (var i = 0; i < blockParam.dirs.length; i++)
    {
        if (blockParam.x == blockParam.dirs[i].x && blockParam.y == blockParam.dirs[i].y)
        {
            var direction1 = blockParam.dirs[i].direction;
            blockParam.dirs.splice(i, 1);
            return direction1;
        }
    }

    return blockParam.dir;
}

// add directional changes to all blocks
// when a block is done with them, it splices them out
// brand new elements are not getting the correct destination changes that it needs to follow
function addDirections(directionParam)
{
    for(var i = 0; i < blocks.length; i++)
    {
        var dirs = blocks[i].dirs;

        if (typeof dirs !== 'undefined')
        {
            dirs.push(directionParam);
            blocks[i].dirs = dirs;
        }

        else
        {
            var dirs = new Array();
            dirs.push(directionParam);
            blocks[i].dir = dirs;
        }
    }
}

function clearBlock(blockParam)
{
    var parent = document.getElementById("grid");
    parent.rows[blockParam.y].cells[blockParam.x].style.backgroundColor = "white";
}

function checkKey(e) {

    if (inprogress)
        e.preventDefault();

    if (locked==true)
        return;

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        if (blocks.length == 0 || (blocks.length > 0 && direction != "down"))
            direction = "up";
    }
    else if (e.keyCode == '40') {
        // down arrow
        if (blocks.length == 0 || (blocks.length > 0 && direction != "up"))
            direction = "down";
    }
    else if (e.keyCode == '37') {
        // left arrow
        if (blocks.length == 0 || (blocks.length > 0 && direction != "right"))
            direction = "left";
    }
    else if (e.keyCode == '39') {
        // right arrow
        if (blocks.length == 0 || (blocks.length > 0 && direction != "left"))
            direction = "right";
    }
}

function checkBlock()
{
    // check if theBlock has encountered a part of its body
    if (theblock.x == segment.x && theblock.y == segment.y)
    {
        score++;
        appendBlock();
        addBlock();

        document.getElementById('score').innerHTML = score;
    }
}

// add segment to theBlock
function appendBlock()
{
    var b;
    var dirsParam = new Array();

    if (blocks.length == 0)
    {
        // compare with first element
        switch(direction)
        {
            case "up":
                b = {x: theblock.x, y: theblock.y + 1, dir: direction, dirs: dirsParam};
                break;

            case "down":
                b = {x: theblock.x, y: theblock.y - 1, dir: direction, dirs: dirsParam};
                break;

            case "left":
                b = {x: theblock.x + 1, y: theblock.y, dir: direction, dirs: dirsParam};
                break;

            case "right":
                b = {x: theblock.x - 1, y: theblock.y, dir: direction, dirs: dirsParam};
                break;
        }

        blocks.push(b);
    }

    else
    {
        // grab the newest element in the blocks array
        switch(blocks[blocks.length-1].dir)
        {
            case "up":
                b = {x: blocks[blocks.length-1].x, y: blocks[blocks.length-1].y + 1, dir: blocks[blocks.length-1].dir, dirs: copyArray(blocks[blocks.length-1].dirs)};
                break;

            case "down":
                b = {x: blocks[blocks.length-1].x, y: blocks[blocks.length-1].y - 1, dir: blocks[blocks.length-1].dir, dirs: copyArray(blocks[blocks.length-1].dirs)};
                break;

            case "left":
                b = {x: blocks[blocks.length-1].x + 1, y: blocks[blocks.length-1].y, dir: blocks[blocks.length-1].dir, dirs: copyArray(blocks[blocks.length-1].dirs)};
                break;

            case "right":
                b = {x: blocks[blocks.length-1].x - 1, y: blocks[blocks.length-1].y, dir: blocks[blocks.length-1].dir, dirs: copyArray(blocks[blocks.length-1].dirs)};
                break;
        }

        blocks.push(b);
    }

    document.getElementById("grid").rows[b.y].cells[b.x].style.backgroundColor = "purple";
}

function lose()
{
    if (theblock.x < 0 || theblock.y < 0 || theblock.x >= size || theblock.y >= size)
        return true;
    return false;
}

function load()
{
    drawGrid();
    createBlock();
}

// add a random segement to grid
// need to make sure it doesn't get added to an already occupied block
function addBlock()
{
    var x2;
    var y2;
    var done = false;

    while(done == false)
    {
        x2 = Math.floor((Math.random() * size));
        y2 = Math.floor((Math.random() * size));
		
        if (collision(x2, y2) == false && (theblock.x != x2 && theblock.y != y2))
            done = true;
    }

    segment = {x:x2, y:y2};
    var parent = document.getElementById("grid");
    parent.rows[y2].cells[x2].style.backgroundColor = "#555";
}

function pause()
{
    clearInterval(timer);
}

function restart()
{
    score=0;
    document.getElementById("btnRestart").style.display = "none";
    startCountdown();
}

function copyArray(arrayParam)
{
    var array = new Array();
    for(var i = 0; i < arrayParam.length;i++)
    {
        array.push(arrayParam[i]);
    }

    return array;
}

window.addEventListener('load', function(){
    load();
});