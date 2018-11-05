$('#start').click(startGame);

function startGame() {
    $('#gameName').text($('#name').val());
    $('.panel').hide(300);
    $('.screen-game').css("background", "none");
    //получаем игровое поле (канвас)
    var canvas = document.getElementById("game_canvas");
    var ctx = canvas.getContext('2d');

    //тут можно пихать все нужные переменные
    var player = {
        x: 0,
        y: 500,
        width: 300,
        height: 400,
        speed: 15,
    };
    //Background - лес
    var backgroundImg = new Image();
    backgroundImg.onload = function () {
    };
    backgroundImg.src = '../assets/img/bg-game.png';
    //player - игрок
    var playerImg = [];
    for (var i = 1; i <= 17; i++) {
        playerImg[i] = new Image();
        playerImg[i].onload = function () {
        };
        playerImg[i].src = '../assets/img/idle000' + i + '.png';
        console.log(playerImg[i].src = '../assets/img/idle000' + i + '.png');
    }

    var dogImg = new Image();
    backgroundImg.onload = function () {
    };
    dogImg.src = '../assets/img/dog.gif';

//так можно сделать не только круги, а врагов и прочие объекты
    var circles = [];

    var playerCurrentDirection = null; //это направление дял функции updatePlayer (она будет ниже в коде)


//тут мы запускаем игру: запускаем функцию "создания" нового кадра с интервалом
    var gameProcess = setInterval(game, 1000 / 60);
    console.log(gameProcess);
//тут мы добвляем в игру отслеживания нажатия клавиш
    addEventListener('keydown', handler);

//функция для создания одного кадра
    function game() {
        //сначала делаем всю логику
        generateAll();
        updateAll();
        //потом рисуем каждый объект на игровом поле
        drawAll();
    }

//создаем объекты, в примере это круги (circles)
    function generateAll() {
        if (circles.length < 1) {
            //лучше было бы вынести все это в отдельную функцию, но так как я тут создаю только круги, то пока оставлю это так (как делать правильно смотри в updateAll() )
            if (Math.floor(Math.random() * 100) <= 2) { //с шансом в 2% в текущем кадре будет создан новый круг (2*60 = 120% в секунду, т е в секунду будет создан минимум 1 круг)
                //добавляем новый круг
                circles.push({
                    x: canvas.width,
                    y: Math.floor(Math.random() * canvas.height), //они будут двигаться справа налево
                    speed: 50 + Math.floor(Math.random() * 20) //с рандомной скоростью 30-50
                });
            }
        }
    }

//вся логика (для каждого кадра) - обновляем координаты передвигаемых объектов и т. п.
    function updateAll() {
        //фон
        updateBackground();
        //позиция игрока
        updatePlayer();
        //позиции объектов
        updateCircles();
    }

//функция для рисования всего на игровом поле
    function drawAll() {
        drawBackground(); // фон
        drawPlayer(playerImg);// игрок
        drawCircles();    // круги
    }

//функция дял обработки нажатий клавиш клавиатуры
    function handler(event) {
        if (event.keyCode == 37) {
            movePlayer('left');
        } else if (event.keyCode == 39) {
            movePlayer('right');
        } // тут можно добавить еще для других клавиш. коды можно глянуть тут -> http://www.javascriptkeycode.com/
    }

//функция для выполнения передвижения игрока
    function movePlayer(direction) {
        if (direction == 'left') {
            playerCurrentDirection = 'left';
        } else if (direction == 'right') {
            playerCurrentDirection = 'right';
        }
    }

    function updatePlayer() {
        //если игрока надо двигать, т е если ему задани направление дял движения
        if (playerCurrentDirection != null) {
            if (playerCurrentDirection == 'left') {
                player.x -= player.speed;
                if (player.x < 0) {
                    player.x = 0;
                }
            } else if (playerCurrentDirection == 'right') {
                player.x += player.speed;
                if (player.x > (canvas.width - player.width)) {
                    player.x = (canvas.width - player.width);
                }
            }
            //после того как мы сдвинули игрока, надо обнулить переменную (это получается как костыль)
            playerCurrentDirection = null;
        }
    }

    function updateCircles() {
        for (var i = 0; i < circles.length; i++) {
            if (circles[i].x < player.x) {
                circles[i].x += circles[i].speed / 60;
            }
            else {
                circles[i].x -= circles[i].speed / 60;
            }
            if (circles[i].x < 0) {
                circles.splice(i, 1); //удаляем объект из массива когда тот зашел за пределы карты
            }
        }
    }

    function updateBackground() {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }

    function drawBackground() {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }

    var state = 0;
    function drawPlayer() {
        ctx.drawImage(playerImg[Math.floor(state)], player.x, player.y, player.width, player.height);
        state += 0.334;
        if (Math.floor(state) == 21){
            state = 0
        }
    }

    function drawCircles() {
        for (var i = 0; i < circles.length; i++) {
            ctx.drawImage(dogImg, circles[i].x, 800, 200, 100);
        }
    }
}