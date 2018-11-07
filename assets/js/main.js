$('#start').click(startGame);

function startGame() {
    /**
     * при старте игры получаем имя героя, скрываем стартовую панель и запускаем канвас
     * */
    //получаем имя
    $('#gameName').text($('#name').val());
    //скрываем панель
    $('.panel').hide(300);
    $('.screen-game').css("background", "none");
    //получаем игровое поле (канвас)
    var canvas = document.getElementById("game_canvas");
    var ctx = canvas.getContext('2d');

    /**
     * игровые перменнные
     * @type {{score: number, hp: number, mp: number, x: number, y: number, width: number, height: number, speed: number}}
     */
    var player = {
        score: 0,
        hp: 100,
        mp: 100,
        x: 0,
        y: 315,
        width: 300,
        height: 400,
        speed: 15
    };
    var animationTupe = 'idle'; // изначальная анимация
    var direction = 'right'; // изначальное направление
    var mpBlockState = 0; // состояние момента потребления маны второй способностью
    var regenState = 0; // состояние момента регенерации здоровья
    var mpRegenState = 0; //состояние момента регенерации маны
    var bgPosition = 9558; //размер фона
    var bgMoveSpeed = 5; //скоро прокрутки фона (при пересечении половины видмой части canvas)
    var width = canvas.width; //ширина canvas
    var stateStand = 0; // состояние момента анимации простоя
    var stateRun = 0; // состояние момента анимации бега
    var stateAttack = 0; // состояние момента анимации атаки
    var stateBlock = 0; // состояние момента анимации блока
    var stateDie = 0; // состояние момента анимации смерти персонажа
    /**
     * background - лес
     * @type {Array}
     */
    var backgroundImg = new Image();
    backgroundImg.onload = function () {
    };
    backgroundImg.src = '../assets/img/bg-game.png';

    /**
     * Player - игрок
     * @type {Array}
     */
    var playerImg = [];
    for (var i = 0; i <= 17; i++) {
        playerImg[i] = new Image();
        playerImg[i].onload = function () {
        };
        playerImg[i].src = '../assets/img/idle/idle000' + i + '.png';
    }
    //бег игрока
    var playerRunImg = [];
    for (var i = 0; i <= 16; i++) {
        playerRunImg[i] = new Image();
        playerRunImg[i].onload = function () {
        };
        playerRunImg[i].src = '../assets/img/run/run000' + i + '.png';
    }
    //первая способность
    var playerAttackImg = [];
    for (var i = 0; i <= 26; i++) {
        playerAttackImg[i] = new Image();
        playerAttackImg[i].onload = function () {
        };
        playerAttackImg[i].src = '../assets/img/attack2/attack200' + i + '.png';
    }
    //вторая способность
    var playerBlock = [];
    for (var i = 0; i <= 23; i++) {
        playerBlock[i] = new Image();
        playerBlock[i].onload = function () {
        };
        playerBlock[i].src = '../assets/img/block/block00' + i + '.png';
    }
    //третья способность
    var playerSword = new Image();
    playerSword.onload = function () {
    };
    playerSword.src = '../assets/img/sword.png';
    //смерть персонажа
    var playerDie = [];
    for (var i = 0; i <= 49; i++) {
        playerDie[i] = new Image();
        playerDie[i].onload = function () {
        };
        playerDie[i].src = '../assets/img/death/death00' + i + '.png';
    }

    /**
     * Противник собака
     */
    var dogImg = [];
    for (var i = 0; i <= 7; i++) {
        dogImg[i] = new Image();
        dogImg[i].onload = function () {
        };
        dogImg[i].src = '../assets/img/dog/' + i + '.png';
    }

    /**
     * Обьекты - собаки
     * @type {Array}
     */
    var dog = [];
    var playerCurrentDirection = null; //это направление дял функции updatePlayer (она будет ниже в коде)

    /**
     * тут мы запускаем игру: запускаем функцию "создания" нового кадра с интервалом
     */
    var gameProcess = setInterval(game, 1000 / 60);
    var timerProcess = setTimeout(timer, 1000);
    var time = 0;

    /**
     * Таймер для левой нижней панели
     */
    function timer() {
        //таймер
        time++;
        var minutes = Math.floor(time / 60);
        var seconds = time % 60;
        var minutesText, secondsText;
        if (minutes < 10)
            minutesText = "0" + minutes;
        else
            minutesText = minutes;
        if (seconds < 10)
            secondsText = "0" + seconds;
        else
            secondsText = seconds;
        $('.timer').text(minutesText + ":" + secondsText);
        timerProcess = setTimeout(timer, 1000);
    }

    /**
     * функция для создания одного кадра
     */
    function game() {
        //сначала делаем всю логику
        generateAll();
        //обновляем нужные нам эллементы
        updateAll();
        //потом рисуем каждый объект на игровом поле
        drawAll();
    }

    /**
     *  создаем объекты, (dog)
     */
    function generateAll() {
        if (dog.length < 10) {
            if (Math.floor(Math.random() * 400) <= 1) { //с шансом в 0.4% в текущем кадре будет создан новая собака (0.4*60 = 24% в секунду)
                //добавляем новый круг
                dog.push({
                    dmgState: 0,
                    dmg: 2,
                    hp: 15,
                    x: Math.floor(Math.random() * (canvas.width - canvas.width / 2 + 1)) + canvas.width / 2 + 150,
                    y: canvas.height,
                    speed: 40,
                    state: 0
                });
            }
        }
    }

    /**
     * вся логика (для каждого кадра) - обновляем координаты передвигаемых объектов и т. п.
     */
    function updateAll() {
        //фон
        updateBackground();
        //позиция игрока
        updatePlayer();
        //позиции объектов
        updateDog();
    }

    //обновление фона
    function updateBackground() {
        if (player.x > (width / 2) - 100 && animationTupe == 'rightRun') {
            for (var i = 0; i < dog.length; i++) {
                dog[i].x -= 2;
            }
            bgPosition -= bgMoveSpeed;
            player.speed = 0;
        }
        else {
            player.speed = 15;
        }
    }

    //обновление состояния персонажа
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
        for (var i = 0; i < dog.length; i++) {
            if (Math.abs(dog[i].x - player.x) < 200) {
                if (Math.floor(dog[i].dmgState) == 60) {
                    player.hp -= 2;
                    dog[i].dmgState = 0;
                }
                dog[i].dmgState += 1;
            }
        }
        if (player.hp < 100) {
            if (Math.floor(regenState) == 60) {
                player.hp += 2;
                regenState = 0;
            }
            regenState += 1;
        }
        if (player.mp < 100) {
            if (Math.floor(mpRegenState) == 60) {
                player.mp += 2;
                mpRegenState = 0;
            }
            mpRegenState += 1;
        }
        if (player.hp <= 0) {
            animationTupe = 'die';
        }
        $('#HP').text(player.hp);
        $('#MP').text(player.mp);
    }

    //обновление состояния собак
    function updateDog() {
        for (var i = 0; i < dog.length; i++) {
            if (dog[i].x < player.x) {
                dog[i].x += dog[i].speed / 60;
            }
            else {
                dog[i].x -= dog[i].speed / 60;
            }
            if (dog[i].x < 0) {
                dog.splice(i, 1); //удаляем объект из массива когда тот зашел за пределы карты
            }
            if (dog[i].hp <= 0) {
                player.score++;
                $('.kills').text("Killed: " + player.score);
                dog.splice(i, 1);
            }
        }
    }

    /**
     * функция для рисования всего на игровом поле
     */
    function drawAll() {
        drawBackground(); // фон
        drawPlayer();// игрок
        drawDog();    // круги
    }

    //рисование фона
    function drawBackground() {
        if (bgPosition == 0) bgPosition = 9558;
        ctx.drawImage(backgroundImg, bgPosition - 9558, -300);
        ctx.drawImage(backgroundImg, bgPosition, -300);
    }

    //рисование игрока
    function drawPlayer() {
        switch (animationTupe) {
            case 'leftRun' :
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(playerRunImg[Math.floor(stateRun)], -player.x - 200, player.y, player.width + 100, player.height + 15);
                ctx.restore();
                stateRun += 0.45;
                if (Math.floor(stateRun) == 15) {
                    stateRun = 0;
                }
                break;
            case 'rightRun' :
                ctx.drawImage(playerRunImg[Math.floor(stateRun)], player.x, player.y, player.width + 100, player.height + 15);
                stateRun += 0.45;
                if (Math.floor(stateRun) == 15) {
                    stateRun = 0;
                }
                break;
            case 'idle' :
                ctx.drawImage(playerImg[Math.floor(stateStand)], player.x, player.y, player.width, player.height);
                stateStand += 0.45;
                if (Math.floor(stateStand) == 17) {
                    stateStand = 0;
                }
                break;
            case 'leftidle' :
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(playerImg[Math.floor(stateStand)], -player.x - 200, player.y, player.width, player.height);
                ctx.restore();
                stateStand += 0.45;
                if (Math.floor(stateStand) == 17) {
                    stateStand = 0;
                }
                break;
            case 'die':
                if (direction == 'right') {
                    ctx.drawImage(playerDie[Math.floor(stateDie)], player.x - 160, player.y - 40, player.width + 250, player.height + 100);
                    stateDie += 0.2;
                    if (Math.floor(stateDie) == 48) {
                        alert("Игра закончена");
                    }
                }
                else if (direction == 'left') {
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.drawImage(playerDie[Math.floor(stateDie)], -player.x - 260, player.y - 40, player.width + 250, player.height + 100);
                    ctx.restore();
                    stateDie += 0.2;
                    if (Math.floor(stateDie) == 48) {
                        alert("Игра закончена");
                    }
                }
                break;
            case 'attack' :
                if (direction == 'right') {
                    ctx.drawImage(playerAttackImg[Math.floor(stateAttack)], player.x - 160, player.y - 140, player.width + 250, player.height + 200);
                    stateAttack += 0.6;
                    if (Math.floor(stateAttack) == 25) {
                        stateAttack = 0;
                        spell('One');
                        animationTupe = 'idle';
                    }
                }
                else if (direction == 'left') {
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.drawImage(playerAttackImg[Math.floor(stateAttack)], -player.x - 360, player.y - 140, player.width + 250, player.height + 200);
                    ctx.restore();
                    stateAttack += 0.6;
                    if (Math.floor(stateAttack) == 25) {
                        stateAttack = 0;
                        spell('One');
                        animationTupe = 'leftidle';
                    }
                }
                break;
            case 'block':
                if (direction == 'right') {
                    ctx.drawImage(playerBlock[Math.floor(stateBlock)], player.x - 10, player.y - 35, player.width + 30, player.height + 30);
                    stateBlock += 0.6;
                    if (Math.floor(stateBlock) == 13) {
                        spell('Two');
                        stateBlock = 12;
                    }
                    if (Math.floor(stateBlock) == 22) {
                        stateBlock = 0;
                        animationTupe = 'idle';
                    }
                }
                if (direction == 'left') {
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.drawImage(playerBlock[Math.floor(stateBlock)], -player.x - 200, player.y - 35, player.width + 30, player.height + 30);
                    ctx.restore();
                    stateBlock += 0.6;
                    if (Math.floor(stateBlock) == 13) {
                        spell('Two');
                        stateBlock = 12;
                    }
                    if (Math.floor(stateBlock) == 22) {
                        stateBlock = 0;
                        animationTupe = 'leftidle';
                    }
                }
                break;
        }
    }

    //рисование собак
    function drawDog() {
        for (var i = 0; i < dog.length; i++) {
            if (player.x + 50 < dog[i].x) {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(dogImg[Math.floor(dog[i].state)], -dog[i].x, 545, 200, 170);
                ctx.restore();
                dog[i].state += 0.334;
                if (Math.floor(dog[i].state) == 7) {
                    dog[i].state = 0;
                }
            }
            else {
                ctx.drawImage(dogImg[Math.floor(dog[i].state)], dog[i].x, 545, 200, 170);
                dog[i].state += 0.334;
                if (Math.floor(dog[i].state) == 7) {
                    dog[i].state = 0;
                }
            }
        }
    }

    /**
     * Добвляем в игру отслеживания нажатия клавиш
     */
    addEventListener('keydown', handler);
    addEventListener('keyup', handlerUp);

    /**
     * функция дял обработки нажатий клавиш клавиатуры
     */
    function handler(event) {
        if (event.keyCode == 37) {
            movePlayer('left');
            animationTupe = 'leftRun';
        } else if (event.keyCode == 39) {
            movePlayer('right');
            animationTupe = 'rightRun';
        } else if (event.keyCode == 49) {
            animationTupe = "attack";
        } else if (event.keyCode == 50) {
            animationTupe = "block";
        }// тут можно добавить еще для других клавиш. коды можно глянуть тут -> http://www.javascriptkeycode.com/
    }

    /**
     * функция для обработки отажтия клавиш клавиатуры
     */
    function handlerUp() {
        if (event.keyCode == 37) {
            animationTupe = 'leftidle';
            direction = 'left';
            player.speed = 15;
        }
        if (event.keyCode == 39) {
            animationTupe = 'idle';
            direction = 'right';
        }
        if (event.keyCode == 50) {
            stateBlock = 14;
            for (var i = 0; i < dog.length; i++) {
                dog[i].speed = 40;
            }
        }
        // тут можно добавить еще для других клавиш. коды можно глянуть тут -> http://www.javascriptkeycode.com/
    }

    /**
     * функция для выполнения способностей персонажа
     */
    function spell(type) {
        if (type == 'One') {
            if (direction == 'right') {
                for (var i = 0; i < dog.length; i++) {
                    if (dog[i].x < player.x + 450 && dog[i].x > player.x) {
                        dog[i].hp -= 15;
                    }
                }
            }
            else {
                for (var i = 0; i < dog.length; i++) {
                    if (dog[i].x > player.x - 450 && dog[i].x < player.x) {
                        dog[i].hp -= 15;
                    }
                }
            }
        }
        if (type == 'Two') {
            if (Math.floor(mpBlockState) == 60) {
                player.mp -= 5;
                mpBlockState = 0;
            }
            mpBlockState += 1;
            if (direction == 'right') {
                for (var i = 0; i < dog.length; i++) {
                    if (dog[i].x - player.x < 400) {
                        dog[i].speed = 0;
                    }
                }
            }
            else {
                for (var i = 0; i < dog.length; i++) {
                    if (Math.abs(dog[i].x - player.x) < 400) {
                        dog[i].speed = 0;
                    }
                }
            }
        }
    }

    /**
     *функция для выполнения передвижения игрока
     */
    function movePlayer(direction) {
        if (direction == 'left') {
            playerCurrentDirection = 'left';
        } else if (direction == 'right') {
            playerCurrentDirection = 'right';
        }
    }
}


