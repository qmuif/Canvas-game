$('#start').click(startGame);

function startGame() {
    /**
     * при старте игры получаем имя героя, скрываем стартовую панель и запускаем канвас
     * */
        //получаем имя
    var Name = $('#name').val();
    $('#gameName').text(Name);
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
    var bgPosition = -1; //размер фона
    var bgMoveSpeed = 5; //скорость прокрутки фона (при пересечении половины видмой части canvas)
    var width = canvas.width; //ширина canvas
    var stateStand = 0; // состояние момента анимации простоя
    var stateRun = 0; // состояние момента анимации бега
    var stateAttack = 0; // состояние момента анимации атаки
    var stateBlock = 0; // состояние момента анимации блока
    var stateDie = 0; // состояние момента анимации смерти персонажа
    var swords; //мечи
    var drawSword = false; //режим отрисовки мечей
    var updateSword = false;//режим обновления мечей
    var cooldownThreeSpell; //состояние перезарядки третьей способности
    var cooldownThreeTime; //перезарядка третьей способности
    var aoe; //четвертая способность
    var stateAoe = 0; //состояние отрисовки
    var drawAoe = false; //режим отрисовки четветрой способности
    var cooldownFourSpell; //состояние перезарядки четвертой способности
    var cooldownFourTime; //перезарядка четвертой способности
    var gamePaused = false;
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
    //четвертая способность
    var playerAoe = [];
    for (var i = 0; i <= 26; i++) {
        playerAoe[i] = new Image();
        playerAoe[i].onload = function () {
        };
        playerAoe[i].src = '../assets/img/swordRain/' + i + '.png';
    }
    //смерть персонажа
    var playerDie = [];
    for (var i = 0; i <= 49; i++) {
        playerDie[i] = new Image();
        playerDie[i].onload = function () {
        };
        playerDie[i].src = '../assets/img/death/death00' + i + '.png';
    }

    /**
     * противник собака
     */
    var dogImg = [];
    for (var i = 0; i <= 7; i++) {
        dogImg[i] = new Image();
        dogImg[i].onload = function () {
        };
        dogImg[i].src = '../assets/img/dog/' + i + '.png';
    }

    /**
     * противник эльф
     */
    var elfRunImg = [];
    for (var i = 0; i <= 19; i++) {
        elfRunImg[i] = new Image();
        elfRunImg[i].onload = function () {
        };
        elfRunImg[i].src = '../assets/img/elf/Run/Run_0' + i + '.png';
    }
    //атака эльфа
    var elfAttack = [];
    for (var i = 0; i <= 19; i++) {
        elfAttack[i] = new Image();
        elfAttack[i].onload = function () {
        };
        elfAttack[i].src = '../assets/img/elf/Attack2/Attack2_0' + i + '.png';
    }
    //смерть эльфа
    var elfDie = [];
    for (var i = 0; i <= 19; i++) {
        elfDie[i] = new Image();
        elfDie[i].onload = function () {
        };
        elfDie[i].src = '../assets/img/elf/DIe/Die_0' + i + '.png';
    }
    /**
     * противник гринч (сильный эльф)
     */
    var greenchRunImg = [];
    for (var i = 0; i <= 19; i++) {
        greenchRunImg[i] = new Image();
        greenchRunImg[i].onload = function () {
        };
        greenchRunImg[i].src = '../assets/img/greench/Run/Run_0' + i + '.png';
    }
    //атака сильного эльфа
    var greenchAttack = [];
    for (var i = 0; i <= 19; i++) {
        greenchAttack[i] = new Image();
        greenchAttack[i].onload = function () {
        };
        greenchAttack[i].src = '../assets/img/greench/Attack2/Attack2_0' + i + '.png';
    }
    //смерть сильного эльфа
    var greenchDie = [];
    for (var i = 0; i <= 19; i++) {
        greenchDie[i] = new Image();
        greenchDie[i].onload = function () {
        };
        greenchDie[i].src = '../assets/img/greench/DIe/Die_0' + i + '.png';
    }

    /**
     * Обьекты - враги
     * @type {Array}
     */
    var opponents = [];
    var playerCurrentDirection = null; //это направление дял функции updatePlayer (она будет ниже в коде)

    /**
     * тут мы запускаем игру:
     * запускаем функцию "создания" нового кадра с интервалом
     */
    var gameProcess = setInterval(game, 1000 / 60);
    var timerProcess = setTimeout(timer, 1000);
    var time = 0;

    /**
     * игровая пауза
     */
    function gamePause() {
        if (!gamePaused) {
            clearInterval(gameProcess);
            clearInterval(timerProcess);
            gamePaused = true;
        }
        else {
            gameProcess = setInterval(game, 1000 / 60);
            timerProcess = setTimeout(timer, 1000);
            gamePaused = false;
        }
    }

    function gameEnd() {
        $('.panel').show(300);
        $('#type').text("Победа!");
        $('#startInfo').css("display", "none");
        $('#name').hide(300);
        $('#name').value = Name;
        $('#start').val("Еще раз!");
        minutes = Math.floor(time / 60);
        seconds = time % 60;
        /**
         * Вот тут должен быть ajax апрос
         */
        $.ajax({
            type: "POST",
            url: "../../register.php",
            data: {
                username : Name,
                score: player.score,
                time : minutes+":"+seconds
            },
            success: function(msg){
                alert( "Прибыли данные: " + msg );
            }
        });
    }

    /**
     * Таймер для левой нижней панели
     * а так же перезарядки способностей
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
        if ((cooldownThreeTime + 3) == time) {
            cooldownThreeSpell = false;
        }
        if ((cooldownFourTime + 15) == time) {
            cooldownFourSpell = false;
        }
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
     *  создаем объекты, (opponents)
     */
    function generateAll() {
        if (opponents.length < 10) {
            if (Math.floor(Math.random() * 100) <= 1) { //с шансом в 0.4% в текущем кадре будет создан новый враг (0.4*60 = 24% в секунду)
                //добавляем нового врага
                var rand = Math.floor(Math.random() * 100);
                if (rand < 33) {
                    var type = 'dog';
                }
                else if (rand > 66) {
                    var type = 'elf';
                } else {
                    var type = 'greench';
                }
                if (type == 'dog') {
                    opponents.push({
                        type: 'dog',
                        dmgState: 0,
                        dmg: 2,
                        hp: 15,
                        x: Math.floor(Math.random() * (canvas.width - canvas.width / 2 + 1)) + canvas.width / 2 + 150,
                        y: canvas.height,
                        speed: 40,
                        state: 0
                    });
                }
                if (type == 'elf') {
                    opponents.push({
                        type: 'elf',
                        animation: 'run',
                        dieState: 0,
                        attState: 0,
                        dmgState: 0,
                        dmg: 5,
                        hp: 30,
                        x: Math.floor(Math.random() * (canvas.width - canvas.width / 2 + 1)) + canvas.width / 2 + 150,
                        y: canvas.height,
                        speed: 40,
                        state: 0
                    });
                }
                if (type == 'greench') {
                    opponents.push({
                        type: 'greench',
                        animation: 'run',
                        dieState: 0,
                        attState: 0,
                        dmgState: 0,
                        dmg: 10,
                        hp: 60,
                        x: Math.floor(Math.random() * (canvas.width - canvas.width / 2 + 1)) + canvas.width / 2 + 150,
                        y: canvas.height,
                        speed: 40,
                        state: 0
                    });
                }
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
        updateOpponents();
        //полет мечей
        if (updateSword) {
            updateThreeSpell();
        }
    }

    //обновление фона
    function updateBackground() {
        if (player.x > (width / 2) - 100 && animationTupe == 'rightRun' && (bgPosition > 0)) {
            for (var i = 0; i < opponents.length; i++) {
                opponents[i].x -= 2;
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
        for (var i = 0; i < opponents.length; i++) {
            if (Math.abs(opponents[i].x - player.x) < 200) {
                if (opponents[i].type == 'dog') {
                    if (Math.floor(opponents[i].dmgState) == 60) {
                        player.hp -= 2;
                        opponents[i].dmgState = 0;
                    }
                    opponents[i].dmgState += 1;
                }
                if (opponents[i].type == 'elf' || opponents[i].type == 'greench') {
                    opponents[i].animation = 'attack';
                    if (Math.floor(opponents[i].dmgState) == 60) {
                        player.hp -= opponents[i].dmg;
                        opponents[i].dmgState = 0;
                    }
                    opponents[i].dmgState += 1;
                }
            }
        }
        if (player.hp < 100) {
            if (Math.floor(regenState) == 60) {
                player.hp += 200;
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

    //обновление состояния противников
    function updateOpponents() {
        for (var i = 0; i < opponents.length; i++) {
            if (opponents[i].x < player.x) {
                opponents[i].x += opponents[i].speed / 60;
            }
            else {
                opponents[i].x -= opponents[i].speed / 60;
            }
            if (opponents[i].x < 0) {
                opponents.splice(i, 1); //удаляем объект из массива когда тот зашел за пределы карты
            }
            if (opponents[i].hp <= 0) {
                if (opponents[i].type == 'elf' || opponents[i].type == 'greench') {
                    opponents[i].dmg = 0;
                    opponents[i].speed = 0;
                    opponents[i].animation = 'die';
                }
                if (opponents[i].type == 'dog') {
                    opponents.splice(i, 1);
                    player.score++;
                }
            }
            $('.kills').text("Killed: " + player.score);
        }
    }

    //обновление состояние мечей
    function updateThreeSpell() {
        if (swords.direction == 'right') {
            swords.x += swords.speed;
            if (swords.x > width) {
                updateSword = false; //удаляем объект  когда тот зашел за пределы карты
                drawSword = false; //удаляем объект  когда тот зашел за пределы карты
                for (var i = 0; i < opponents.length; i++) {
                    opponents[i].hp -= 40;
                }
            }
        }
        else if (swords.direction == 'left') {
            swords.x -= swords.speed;
            if (swords.x < 0) {
                updateSword = false; //удаляем объект  когда тот зашел за пределы карты
                drawSword = false; //удаляем объект  когда тот зашел за пределы карты
                for (var i = 0; i < opponents.length; i++) {
                    opponents[i].hp -= 40;
                }
            }
        }
    }

    /**
     * функция для рисования всего на игровом поле
     */
    function drawAll() {
        drawBackground(); // фон
        drawPlayer();// игрок
        drawOpponents();    // круги
        if (drawSword) {
            drawThreeSpell() //мечи
        }
        if (drawAoe) {
            drawFourSpell() //четвертая способность
        }
    }

    //рисование фона
    function drawBackground() {
        if (bgPosition < 0 && player.x >= 1200) {
            gamePause();
            gameEnd();
        }
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

    //рисование противников
    function drawOpponents() {
        for (var i = 0; i < opponents.length; i++) {
            if (opponents[i].type == 'dog') {
                if (player.x + 50 < opponents[i].x) {
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.drawImage(dogImg[Math.floor(opponents[i].state)], -opponents[i].x, 545, 170, 170);
                    ctx.restore();
                    opponents[i].state += 0.334;
                    if (Math.floor(opponents[i].state) == 7) {
                        opponents[i].state = 0;
                    }
                }
                else {
                    ctx.drawImage(dogImg[Math.floor(opponents[i].state)], opponents[i].x, 545, 170, 170);
                    opponents[i].state += 0.334;
                    if (Math.floor(opponents[i].state) == 7) {
                        opponents[i].state = 0;
                    }
                }
            }else if (opponents[i].type == 'elf') {
                if (opponents[i].animation == 'run') {
                    if (player.x + 50 < opponents[i].x) {
                        ctx.save();
                        ctx.scale(-1, 1);
                        ctx.drawImage(elfRunImg[Math.floor(opponents[i].state)], -opponents[i].x, 320, 200, 400);
                        ctx.restore();
                        opponents[i].state += 0.334;
                        if (Math.floor(opponents[i].state) == 18) {
                            opponents[i].state = 0;
                        }
                    }
                    else {
                        ctx.drawImage(elfRunImg[Math.floor(opponents[i].state)], opponents[i].x, 320, 200, 400);
                        opponents[i].state += 0.334;
                        if (Math.floor(opponents[i].state) == 18) {
                            opponents[i].state = 0;
                        }
                    }
                }
                if (opponents[i].animation == 'attack') {
                    if (player.x + 50 < opponents[i].x) {
                        ctx.save();
                        ctx.scale(-1, 1);
                        ctx.drawImage(elfAttack[Math.floor(opponents[i].attState)], -opponents[i].x, 320, 200, 400);
                        ctx.restore();
                        opponents[i].attState += 0.334;
                        if (Math.floor(opponents[i].attState) == 17) {
                            opponents[i].attState = 0;
                            opponents[i].animation = 'run';
                        }
                    }
                    else {
                        ctx.drawImage(elfAttack[Math.floor(opponents[i].attState)], opponents[i].x, 320, 200, 400);
                        opponents[i].attState += 0.334;
                        if (Math.floor(opponents[i].attState) == 17) {
                            opponents[i].attState = 0;
                            opponents[i].animation = 'run';
                        }
                    }
                }
                if (opponents[i].animation == 'die') {
                    if (player.x + 50 < opponents[i].x) {
                        ctx.save();
                        ctx.scale(-1, 1);
                        ctx.drawImage(elfDie[Math.floor(opponents[i].dieState)], -opponents[i].x - 250, 330, 400, 400);
                        ctx.restore();
                        opponents[i].dieState += 0.334;
                        if (Math.floor(opponents[i].dieState) == 18) {
                            opponents[i].dieState = 0;
                            player.score++;
                            opponents.splice(i, 1);
                        }
                    }
                    else {
                        ctx.drawImage(elfDie[Math.floor(opponents[i].dieState)], opponents[i].x - 250, 320, 400, 400);
                        opponents[i].dieState += 0.334;
                        if (Math.floor(opponents[i].dieState) == 18) {
                            opponents[i].dieState = 0;
                            player.score++;
                            opponents.splice(i, 1);
                        }
                    }
                }
            }else if (opponents[i].type == 'greench') {
                if (opponents[i].animation == 'run') {
                    if (player.x + 50 < opponents[i].x) {
                        ctx.save();
                        ctx.scale(-1, 1);
                        ctx.drawImage(greenchRunImg[Math.floor(opponents[i].state)], -opponents[i].x, 320, 200, 400);
                        ctx.restore();
                        opponents[i].state += 0.334;
                        if (Math.floor(opponents[i].state) == 18) {
                            opponents[i].state = 0;
                        }
                    }
                    else {
                        ctx.drawImage(greenchRunImg[Math.floor(opponents[i].state)], opponents[i].x, 320, 200, 400);
                        opponents[i].state += 0.334;
                        if (Math.floor(opponents[i].state) == 18) {
                            opponents[i].state = 0;
                        }
                    }
                }
                if (opponents[i].animation == 'attack') {
                    if (player.x + 50 < opponents[i].x) {
                        ctx.save();
                        ctx.scale(-1, 1);
                        ctx.drawImage(greenchAttack[Math.floor(opponents[i].attState)], -opponents[i].x, 320, 200, 400);
                        ctx.restore();
                        opponents[i].attState += 0.334;
                        if (Math.floor(opponents[i].attState) == 17) {
                            opponents[i].attState = 0;
                            opponents[i].animation = 'run';
                        }
                    }
                    else {
                        ctx.drawImage(greenchAttack[Math.floor(opponents[i].attState)], opponents[i].x, 320, 200, 400);
                        opponents[i].attState += 0.334;
                        if (Math.floor(opponents[i].attState) == 17) {
                            opponents[i].attState = 0;
                            opponents[i].animation = 'run';
                        }
                    }
                }
                if (opponents[i].animation == 'die') {
                    if (player.x + 50 < opponents[i].x) {
                        ctx.save();
                        ctx.scale(-1, 1);
                        ctx.drawImage(greenchDie[Math.floor(opponents[i].dieState)], -opponents[i].x - 250, 330, 400, 400);
                        ctx.restore();
                        opponents[i].dieState += 0.6;
                        if (Math.floor(opponents[i].dieState) == 18) {
                            opponents[i].dieState = 0;
                            player.score++;
                            opponents.splice(i, 1);
                        }
                    }
                    else {
                        ctx.drawImage(greenchDie[Math.floor(opponents[i].dieState)], opponents[i].x - 250, 320, 400, 400);
                        opponents[i].dieState += 0.6;
                        if (Math.floor(opponents[i].dieState) == 18) {
                            opponents[i].dieState = 0;
                            player.score++;
                            opponents.splice(i, 1);
                        }
                    }
                }
            }
        }
    }

    //рисование третьей способности
    function drawThreeSpell() {
        if (swords.direction == 'right') {
            ctx.drawImage(playerSword, swords.x, swords.y, swords.width, swords.height);
        }
        else {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(playerSword, -swords.x - 100, swords.y, swords.width, swords.height);
            ctx.restore();
        }
    }

    //рисование четветрой способности
    function drawFourSpell() {
        ctx.drawImage(playerAoe[Math.floor(stateAoe)], aoe.x, aoe.y, aoe.width, aoe.height);
        stateAoe += 0.334;
        if (Math.floor(stateAoe) > 25) {
            stateAoe = 0;
            drawAoe = false;
        }
    }

    /**
     * Добвляем в игру отслеживания нажатия клавиш
     */
    addEventListener('keydown', handler);
    addEventListener('keyup', handlerUp);

    /**
     * функция для обработки нажатий клавиш клавиатуры
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
            if (player.mp > 5) {
                animationTupe = "block";
            }
        } else if (event.keyCode == 27) {
            gamePause();
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
            for (var i = 0; i < opponents.length; i++) {
                opponents[i].speed = 40;
            }
        }
        if (event.keyCode == 51) {
            if (player.mp > 10) {
                if (!cooldownThreeSpell) {
                    cooldownThreeSpell = true;
                    cooldownThreeTime = time;
                    swords = {
                        x: player.x + 100,
                        y: player.y + 150,
                        speed: 20,
                        width: 300,
                        height: 150,
                        direction: 0,
                    };
                    if (direction == 'left') {
                        swords.direction = 'left';
                    }
                    else {
                        swords.direction = 'right'
                    }
                    spell('Three');
                }
            }
        }
        if (event.keyCode == 52) {
            if (player.mp > 30) {
                if (!cooldownFourSpell) {
                    cooldownFourSpell = true;
                    cooldownFourTime = time;
                    aoe = {
                        x: player.x + 100,
                        y: player.y + 50,
                        width: 600,
                        height: 350,
                        direction: 'right'
                    };
                    if (direction == 'left') {
                        aoe.x = player.x - 600;
                        aoe.direction = 'left'
                    }
                    spell('Four');
                }
            }
        }
        // тут можно добавить еще для других клавиш. коды можно глянуть тут -> http://www.javascriptkeycode.com/
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

    /**
     * функция для выполнения способностей персонажа
     */
    function spell(type) {
        if (type == 'One') {
            if (direction == 'right') {
                for (var i = 0; i < opponents.length; i++) {
                    if (opponents[i].x < player.x + 450 && opponents[i].x > player.x) {
                        opponents[i].hp -= 15;
                    }
                }
            }
            else {
                for (var i = 0; i < opponents.length; i++) {
                    if (opponents[i].x > player.x - 450 && opponents[i].x < player.x) {
                        opponents[i].hp -= 15;
                    }
                }
            }
        }
        if (type == 'Two') {
            if (player.mp > 5) {
                if (Math.floor(mpBlockState) == 60) {
                    player.mp -= 5;
                    mpBlockState = 0;
                }
                mpBlockState += 1;
                if (direction == 'right') {
                    for (var i = 0; i < opponents.length; i++) {
                        if (opponents[i].x - player.x < 400) {
                            opponents[i].speed = 0;
                        }
                    }
                }
                else {
                    for (var i = 0; i < opponents.length; i++) {
                        if (Math.abs(opponents[i].x - player.x) < 400) {
                            opponents[i].speed = 0;
                        }
                    }
                }
            }
            else {
                animationTupe = 'idle';
            }
        }
        if (type == 'Three') {
            drawSword = true;
            updateSword = true;
            player.mp -= 10;
        }
        if (type == 'Four') {
            drawAoe = true;
            player.mp -= 30;
            for (var i = 0; i < opponents.length; i++) {
                if (aoe.direction == 'right') {
                    if (opponents[i].x < player.x + 650 && opponents[i].x > player.x) {
                        opponents[i].hp -= 100;
                    }
                }
                else {
                    if (opponents[i].x > player.x - 650 && opponents[i].x < player.x) {
                        opponents[i].hp -= 100;
                    }
                }
            }
        }
    }
}


