(function(window) {
    window.game = window.game || {}

    function MainMenu() {
        this.initialize();
    }

    var p = MainMenu.prototype = new createjs.Container();
    p.playBtn;
    p.instructionsBtn;
    p.optionsBtn;
    p.Container_initialize = p.initialize;
    p.initialize = function() {
        this.Container_initialize();
        this.addTitle();
        this.addButton();
    }
    p.addTitle = function() {
        var titleYPos = 200;
        var title = new createjs.Sprite(spritesheet, 'title');
        title.regX = title.getBounds().width / 2;
        title.x = screen_width / 2;
        title.y = -50;
        createjs.Tween.get(title).to({ y: titleYPos }, 1000)
            .call(this.bringTitle, null, this);
        this.addChild(title);
    }
    p.addButton = function() {
        this.playBtn = new ui.SimpleButton('Play Game');
        this.playBtn.on('click', this.playGame, this);
        this.playBtn.regX = this.playBtn.width / 2;
        this.playBtn.x = canvas.width / 2;
        this.playBtn.y = 300;
        this.playBtn.alpha = 0;
        this.playBtn.setButton({ upColor: '#d2354c', color: '#FFF', borderColor: '#FFF', overColor: '#900' });
        this.addChild(this.playBtn);

        this.instructionsBtn = new ui.SimpleButton('Instructions');
        this.instructionsBtn.on('click', this.instructionsScene, this);
        this.instructionsBtn.regX = this.instructionsBtn.width / 2;
        this.instructionsBtn.x = canvas.width / 2;
        this.instructionsBtn.y = 360;
        this.instructionsBtn.alpha = 0;
        this.instructionsBtn.setButton({ upColor: '#d2354c', color: '#FFF', borderColor: '#FFF', overColor: '#900' });
        this.addChild(this.instructionsBtn);

        this.optionsBtn = new ui.SimpleButton('Options');
        this.optionsBtn.on('click', this.optionsScene, this);
        this.optionsBtn.regX = this.optionsBtn.width / 2;
        this.optionsBtn.x = canvas.width / 2;
        this.optionsBtn.y = 420;
        this.optionsBtn.alpha = 0;
        this.optionsBtn.setButton({ upColor: '#d2354c', color: '#FFF', borderColor: '#FFF', overColor: '#900' });
        this.addChild(this.optionsBtn);
    }
    p.bringTitle = function(e) {
        createjs.Tween.get(this.playBtn).to({ alpha: 1 }, 1000);
        createjs.Tween.get(this.instructionsBtn).to({ alpha: 1 }, 1000);
        createjs.Tween.get(this.optionsBtn).to({ alpha: 1 }, 1000);
    }
    p.playGame = function(e) {
        if(window.game.main.playSound)
            createjs.Sound.play(game.assets.EXPLOSION);
        this.dispatchEvent(game.GameStateEvents.GAME);
    }
    p.instructionsScene = function(e) {
        this.dispatchEvent(game.GameStateEvents.INSTRUCTIONS_MENU);
    }
    p.optionsScene = function(e) {
        this.dispatchEvent(game.GameStateEvents.OPTIONS_MENU);
    }
    window.game.MainMenu = MainMenu;


    function InstructionsMenu() {
        this.initialize();
    }

    var p = InstructionsMenu.prototype = new createjs.Container();
    p.mainMenuBtn;
    p.Container_initialize = p.initialize;
    p.initialize = function() {
        this.Container_initialize();
        this.addTitle();
        this.addText();
    }
    p.addTitle = function() {
        var titleYPos = 200;
        var title = new createjs.Sprite(spritesheet, 'title');
        title.regX = title.getBounds().width / 2;
        title.x = screen_width / 2;
        title.y = -50;
        createjs.Tween.get(title).to({ y: titleYPos }, 1000)
            .call(this.bringTitle, null, this);
        this.addChild(title);
    }
    p.addText = function() {
        this.mainMenuBtn = new ui.SimpleButton('Back to Main Menu');
        this.mainMenuBtn.on('click', this.mainMenu, this);
        this.mainMenuBtn.regX = this.mainMenuBtn.width / 2;
        this.mainMenuBtn.x = canvas.width / 2;
        this.mainMenuBtn.y = 550;
        this.mainMenuBtn.alpha = 0;
        this.mainMenuBtn.setButton({ upColor: '#d2354c', color: '#FFF', borderColor: '#FFF', overColor: '#900' });
        this.addChild(this.mainMenuBtn);

        this.text = new createjs.Text("Use your arrow keys to control your car in the highway.\n\nTo shoot enemies coming against you, use the space bar key.\n\n\n\nTry to destroy every enemy possible!", "bold 20px Arial", "white");
        this.text.x = screen_width / 2;
        this.text.y = 400;
        this.text.textAlign = "center";
        this.text.textBaseline = "alphabetic";
        this.addChild(this.text);
    }
    p.bringTitle = function(e) {
        createjs.Tween.get(this.mainMenuBtn).to({ alpha: 1 }, 1000);
    }
    p.mainMenu = function (e) {
        this.dispatchEvent(game.GameStateEvents.MAIN_MENU);
    }
    window.game.InstructionsMenu = InstructionsMenu;


    function OptionsMenu() {
        this.initialize();
    }

    var p = OptionsMenu.prototype = new createjs.Container();
    p.soundBtn;
    p.levelBtn;
    p.mainMenuBtn;
    p.Container_initialize = p.initialize;
    p.initialize = function() {
        this.Container_initialize();
        this.addTitle();
        this.addButton();
    }
    p.addTitle = function() {
        var titleYPos = 200;
        var title = new createjs.Sprite(spritesheet, 'title');
        title.regX = title.getBounds().width / 2;
        title.x = screen_width / 2;
        title.y = -50;
        createjs.Tween.get(title).to({ y: titleYPos }, 1000)
            .call(this.bringTitle, null, this);
        this.addChild(title);
    }
    p.addButton = function() {
        this.soundBtn = new ui.SimpleButton('Sound: ' + (window.game.main.playSound ? 'on' : 'off'));
        this.soundBtn.on('click', this.toggleSound, this);
        this.soundBtn.regX = this.soundBtn.width / 2;
        this.soundBtn.x = canvas.width / 2;
        this.soundBtn.y = 300;
        this.soundBtn.alpha = 0;
        this.soundBtn.setButton({ upColor: '#d2354c', color: '#FFF', borderColor: '#FFF', overColor: '#900' });
        this.addChild(this.soundBtn);

        this.levelBtn = new ui.SimpleButton("Level: " + (window.game.main.gameLevel));
        this.levelBtn.on('click', this.changeLevel, this);
        this.levelBtn.regX = this.levelBtn.width / 2;
        this.levelBtn.x = canvas.width / 2;
        this.levelBtn.y = 360;
        this.levelBtn.alpha = 0;
        this.levelBtn.setButton({ upColor: '#d2354c', color: '#FFF', borderColor: '#FFF', overColor: '#900' });
        this.addChild(this.levelBtn);

        this.mainMenuBtn = new ui.SimpleButton('Back to Main Menu');
        this.mainMenuBtn.on('click', this.mainMenu, this);
        this.mainMenuBtn.regX = this.mainMenuBtn.width / 2;
        this.mainMenuBtn.x = canvas.width / 2;
        this.mainMenuBtn.y = 420;
        this.mainMenuBtn.alpha = 0;
        this.mainMenuBtn.setButton({ upColor: '#d2354c', color: '#FFF', borderColor: '#FFF', overColor: '#900' });
        this.addChild(this.mainMenuBtn);
    }
    p.bringTitle = function(e) {
        createjs.Tween.get(this.soundBtn).to({ alpha: 1 }, 1000);
        createjs.Tween.get(this.levelBtn).to({ alpha: 1 }, 1000);
        createjs.Tween.get(this.mainMenuBtn).to({ alpha: 1 }, 1000);
    }
    p.toggleSound = function (e) {
        window.game.main.playSound = !window.game.main.playSound;
        this.soundBtn.label = "Sound: " + (window.game.main.playSound ? "on" : "off");
        this.soundBtn.drawButton();
        stage.update();
    }
    p.changeLevel = function (e) {
        switch(window.game.main.gameLevel){
            case "EASY": window.game.main.gameLevel = 'MEDIUM'; break;
            case "MEDIUM": window.game.main.gameLevel = 'HARD'; break;
            case "HARD": window.game.main.gameLevel = 'EASY'; break;
        }

        this.levelBtn.label = 'Level: ' + window.game.main.gameLevel;
        this.levelBtn.drawButton();
    }
    p.mainMenu = function (e) {
        this.dispatchEvent(game.GameStateEvents.MAIN_MENU);
    }
    window.game.OptionsMenu = OptionsMenu;
}(window));