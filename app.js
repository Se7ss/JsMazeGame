

//generate a maze 

//Grid Array to keep track of visited cell 
// false = not visited , true = visted

//initialise grid array with false values

//another way to initialise the grid



//randomise array of neigbours cells
const { Engine, Render, Runner, World, Bodies, Body, Events
    // MouseConstraint, Mouse
} = Matter;



const engine = Engine.create();
engine.world.gravity.y = 0  // disable gravity on by default
const { world } = engine;

// const cells = 10;
const width = 400;
const height = 400;

const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width,
        height,
        wireframes: false,
    }

});


Render.run(render);
Runner.run(Runner.create(), engine);


walls = [

    Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true, }),
    Bodies.rectangle(width / 2, height, width, 2, { isStatic: true, }),
    Bodies.rectangle(width, height / 2, 2, height, { isStatic: true, }),
    Bodies.rectangle(0, height / 2, 2, height, { isStatic: true, }),
];

World.add(world, walls);


const shuffle = (arr) => {
    let counter = arr.length;

    while (counter > 0) {

        const index = Math.floor(Math.random() * counter)
        counter--;
        let temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;

    }
    return arr;

};

const form = document.getElementById('mazeSize');

form.addEventListener('submit', (event) => {
    // stop form submission
    event.preventDefault();
    //console.log(event);


    //clear matter js 

    World.clear(world);
    engine.world.gravity.y = 0;
    // Engine.clear(engine);
    // Render.stop(render);
    // Runner.stop(runner);
    // render.canvas.remove();
    // render.canvas = null;
    // render.context = null;
    // render.textures = {};

    if (!document.querySelector(".winner").classList.contains("hidden")) {
        document.querySelector(".winner").classList.add("hidden");
    }

    walls = [

        Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true, }),
        Bodies.rectangle(width / 2, height, width, 2, { isStatic: true, }),
        Bodies.rectangle(width, height / 2, 2, height, { isStatic: true, }),
        Bodies.rectangle(0, height / 2, 2, height, { isStatic: true, }),
    ];

    World.add(world, walls);
    //************************************* */




    let cells = parseInt(form.elements["rowX"].value)
    const unitLength = width / cells;





    const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));
    // console.log(cells)
    // console.log(grid)
    const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false));

    const horizontals = Array(cells - 1).fill(null).map(() => Array(cells).fill(false));


    //generate a random starting point in grid

    startRow = Math.floor((Math.random() * cells));
    startCol = Math.floor((Math.random() * cells));

    // console.log('Row = ' + startRow + '\n' + 'Col = ' + startCol + '\n');




    const stepThroughCell = (row, col) => {
        //if i have visited the cell at [row ,column] then return
        if (grid[row][col]) {
            return;
        }

        //Mark cell as visited
        grid[row][col] = true;

        //randomly create ordered list of neighbors
        const neighbors = shuffle([
            [row - 1, col, 'up'],
            [row + 1, col, 'down'],
            [row, col - 1, 'left'],
            [row, col + 1, 'right'],

        ]);




        // console.log(neighbors);

        //For Each Neighbor

        for (let neighbor of neighbors) {

            const [nextRow, nextColumn, direction] = neighbor;

            //See if that neighbor outside of bounds
            if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
                continue;
            }

            // if we have visited that Neighbor continue to next neighbor
            if (grid[nextRow][nextColumn]) {
                continue;
            }

            //Remove a wall from either horizontal or vertical array
            if (direction === 'left') {
                verticals[row][col - 1] = true;
            } else if (direction === 'right') {
                verticals[row][col] = true;
            } else if (direction === 'up') {
                horizontals[row - 1][col] = true;
            } else if (direction === 'down') {
                horizontals[row][col] = true;
            }

            stepThroughCell(nextRow, nextColumn);
        }
        //Visit that next Cell


    };


    stepThroughCell(startRow, startCol);
    // stepThroughCell(1, 1);

    // console.log(horizontals);
    // console.log(verticals);

    //draw walls 
    horizontals.forEach((row, rowIndex) => {
        row.forEach((open, colIndex) => {

            if (open) {
                return;
            }

            const wall = Bodies.rectangle(

                colIndex * unitLength + unitLength / 2,
                rowIndex * unitLength + unitLength,
                unitLength, 5, {
                isStatic: true,
                label: 'wall'
            }
            );

            World.add(world, wall);

        });

    });


    verticals.forEach((row, rowIndex) => {
        row.forEach((open, colIndex) => {

            if (open) {
                return;
            }

            const wall = Bodies.rectangle(

                colIndex * unitLength + unitLength,
                rowIndex * unitLength + unitLength / 2,
                5, unitLength, {
                isStatic: true,
                label: 'wall'
            }

            );

            World.add(world, wall);


        });
    });





    //Goal
    const goal = Bodies.rectangle(
        width - unitLength / 2,
        height - unitLength / 2,
        unitLength * .7,
        unitLength * .7, {

        isStatic: true,
        label: 'goal',
        render: {
            fillStyle: 'green',
            strokeStyle: 'blue',
            lineWidth: 3
        }
    }


    );

    World.add(world, goal);


    //Ball

    const ball = Bodies.circle(unitLength / 2, unitLength / 2, unitLength / 4, {
        isStatic: false,
        label: 'ball',

    });

    World.add(world, ball);

    //movement
    document.addEventListener('keydown', event => {

        ;
        // console.log(event);
        const { x, y } = ball.velocity
        if (event.keyCode === 37) {

            // console.log("Move Ball left!");
            Body.setVelocity(ball, { x: x - 3, y: y });
        }

        //Move UP
        if (event.keyCode === 38) {

            // console.log("Move Ball Up!");
            Body.setVelocity(ball, { x: x, y: -3 });
        }

        if (event.keyCode === 39) {

            // console.log("Move Ball Right!");
            Body.setVelocity(ball, { x: x + 5, y: y });
        }
        if (event.keyCode === 40) {

            // console.log("Move Ball Down!");
            Body.setVelocity(ball, { x: x, y: y + 5 });
        }
        //            
    });




    //collision detection for ball and goal

    //WIN CONDITION
    Events.on(engine, 'collisionStart', event => {

        event.pairs.forEach(collision => {
            // console.log(collision);

            const labels = ['ball', 'goal'];

            if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
                console.log('User WON!!!')
                winningDiv = document.querySelector(".winner").classList.remove("hidden");

                world.gravity.y = 1
                world.bodies.forEach(body => {

                    if (body.label === 'wall') {

                        Body.setStatic(body, false);
                    }

                });

            }



        });
    });

});

// World.add(world, MouseConstraint.create(engine, {

//     mouse: Mouse.create(render.canvas)
// }));

// const shape = Bodies.rectangle(200, 200, 50, 50, {
//     isStatic: false,

// });

// World.add(world, shape) //can also take an array of shapes for example wall =[]


// const recBorderLeft = Bodies.rectangle(0, 0, 50, 801, {
//     isStatic: true,

// });

// World.add(world, recBorderLeft);

// const recBorderBot = Bodies.rectangle(0, 400, 801, 50, {
//     isStatic: true,

// });

// World.add(world, recBorderBot);

// const recBorderRight = Bodies.rectangle(400, 400, 50, 801, {
//     isStatic: true,

// });
// World.add(world, recBorderRight);

// const recBorderTop = Bodies.rectangle(400, 0, 801, 50, {
//     isStatic: true,

// });
// World.add(world, recBorderTop);


// //Random Shapes

// for (let i = 0; i < 10; i++) {

//     ran1 = Math.floor(Math.random() * 200);
//     width = Math.floor(Math.random() * 50);
//     length = Math.floor(Math.random() * 50);


//     World.add(world, Bodies.rectangle(ran1, 200, width, length, {
//         isStatic: false

//     }));

//     World.add(world, Bodies.circle(ran1, 200, Math.random() * 35, {
//         render: {
//             fillStyle: 'red'
//         }
//     }));


// }




//generate a maze 
//Grid 2d array
//Vertical and Horizantal walls  using arrays

// 3x3 Grid 
// grid= [ [1,2,3,4],
//         [3,4,5,4] ],

// row[0][1]


// let width = 50;
// let height = 50;
// let x = 50;
// let y = 50;
// let recBorderTop = null;
// let grid = [];
// for (let row = 0; row < 5; row++) {

//     grid[row] = [];

//     for (let col = 0; col < 5; col++) {


//         grid[row][col] = Bodies.rectangle(x, y, 50, 50, {
//             isStatic: true,
//         });

//         World.add(world, grid[row][col]);

//         x = x + 50;
//     }
//     y += 50;
//     x = 50;







// }

