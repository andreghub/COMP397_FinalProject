/*
 * Credits to Brad Manderscheid (book Beginning HTML5 Games with CreateJS)
 */
(function () {

    window.ui = window.ui || {};
    window.game = window.game || {};

    var Preloader = function (fill, stroke) {
        this.fillColor = fill;
        this.strokeColor = stroke;
        this.initialize();
    }
    var p = Preloader.prototype = new createjs.Container();

    p.width = 400;
    p.height = 40;
    p.fillColor;
    p.strokeColor;
    p.bar;

    p.Container_initialize = p.initialize;

    p.initialize = function () {
        this.Container_initialize();
        this.drawPreloader();
    }

    p.drawPreloader = function () {
        var outline = new createjs.Shape();
        outline.graphics.beginStroke(this.strokeColor);
        outline.graphics.drawRect(0, 0, this.width, this.height);
        this.bar = new createjs.Shape();
        this.bar.graphics.beginFill(this.fillColor);
        this.bar.graphics.drawRect(0, 0, this.width, this.height);
        this.bar.scaleX = 0;
        this.addChild(this.bar, outline);
    }

    p.update = function (perc) {
        perc = perc > 1 ? 1 : perc;
        this.bar.scaleX = perc;
    }

    window.ui.Preloader = Preloader;

    var SimpleButton = function (label) {
        this.label = label;
        this.initialize();
    }
    var p = SimpleButton.prototype = new createjs.Container();

    // SimpleButton properties
    p.label;
    p.width;
    p.height;
    p.background;
    p.labelTxt;
    p.fontSize = 24;
    p.borderColor = '#000';
    p.buttonColor = '#ccc';
    p.upColor = '#ccc';
    p.overColor = '#aaa';

    p.Container_initialize = p.initialize;

    p.initialize = function () {
        this.Container_initialize();
        this.drawButton();
        this.setButtonListeners();
    }
    p.drawButton = function(){
        this.removeAllChildren();
        this.labelTxt = new createjs.Text(this.label,this.fontSize + 'px Arial',this.color);
        this.labelTxt.textAlign = 'center';
        this.labelTxt.textBaseline = 'top';
        this.width = this.labelTxt.getMeasuredWidth() + 30;
        this.height = this.labelTxt.getMeasuredHeight() + 20;
        this.labelTxt.x = this.width / 2;
        this.labelTxt.y = 10;
        this.background = new createjs.Shape();
        this.background.graphics.beginStroke(this.borderColor).beginFill(this.buttonColor).drawRect(0,0,this.width,this.height);
        this.addChild(this.background,this.labelTxt);
    }
    p.setButtonListeners = function (){
        this.cursor = 'pointer';
        this.on('rollover',this.onButtonOver);
        this.on('rollout',this.onButtonOut);
    }
    p.onButtonOver = function(){
        this.buttonColor = this.overColor;
        this.drawButton();
    }
    p.onButtonOut = function(){
        this.buttonColor = this.upColor;
        this.drawButton();
    }

    // Set all
    p.setButton = function(obj){
        this.set(obj);
        this.buttonColor = obj.upColor != undefined ? obj.upColor : this.buttonColor;
        this.drawButton();
    }

    // Set individual
    p.setUpColor = function(color){
        this.upColor = color;
        this.buttonColor = color;
        this.drawButton();
    }
    p.setOverColor = function(color){
        this.overColor = color;
    }
    p.setColor = function(color){
        this.color = this.labelTxt.color = color;
    }
    p.setFontSize = function(size){
        this.fontSize = size;
        this.drawButton();
    }

    window.ui.SimpleButton = SimpleButton;

    var AssetManager = function () {
        this.initialize();
    }
    var p = AssetManager.prototype = new createjs.EventDispatcher();

    p.EventDispatcher_initialize = p.initialize;

    //sounds
    p.EXPLOSION = 'explosion';
    p.SOUNDTRACK = 'soundtrack';

    //graphics
    p.GAME_SPRITES = 'game sprites';

    //data
    p.GAME_SPRITES_DATA = 'game sprites data'

    //events
    p.ASSETS_PROGRESS = 'assets progress';
    p.ASSETS_COMPLETE = 'assets complete';

    p.assetsPath = 'assets/';

    p.loadManifest = null;
    p.queue = null;
    p.loadProgress = 0;


    p.initialize = function () {
        this.EventDispatcher_initialize();
        this.loadManifest = [
            {id:this.EXPLOSION, src:this.assetsPath + 'explosion.mp3'},
            {id:this.SOUNDTRACK, src:this.assetsPath + 'dreamRaid1.mp3'},
            {id:this.GAME_SPRITES_DATA, src:this.assetsPath + 'all.json'},
            {id:this.GAME_SPRITES, src:this.assetsPath + 'all.png'}
        ];
    }
    p.preloadAssets = function () {
        createjs.Sound.initializeDefaultPlugins();
        this.queue = new createjs.LoadQueue();
        this.queue.installPlugin(createjs.Sound);
        this.queue.on('complete', this.assetsLoaded, this);
        this.queue.on('progress', this.assetsProgress, this);
        createjs.Sound.alternateExtensions = ["ogg"];
        this.queue.loadManifest(this.loadManifest);
    }

    p.assetsProgress = function (e) {
        this.loadProgress = e.progress;
        var event = new createjs.Event(this.ASSETS_PROGRESS);
        this.dispatchEvent(event);
    }
    p.assetsLoaded = function (e) {
        var event = new createjs.Event(this.ASSETS_COMPLETE);
        this.dispatchEvent(event);
    }
    p.getAsset = function (asset) {
        return this.queue.getResult(asset);
    }

    window.game.AssetManager = AssetManager;

    var SpritePool = function (type, length) {
        this.pool = [];
        var i = length;
        while (--i > -1) {
            this.pool[i] = new type();
        }
    }
    SpritePool.prototype.getSprite = function () {
        if (this.pool.length > 0) {
            return this.pool.pop();
        }
        else {
            throw new Error("You ran out of sprites!");
        }
    }
    SpritePool.prototype.returnSprite = function (sprite) {
        this.pool.push(sprite);
    }

    window.game.SpritePool = SpritePool;

    
    var Utils = {

    }

    Utils.getRandomNumber = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    window.Utils = Utils;

     var GameStates = {
        MAIN_MENU:0,
        OPTIONS_MENU:1,
        INSTRUCTIONS_MENU:2,
        RUN_SCENE:3,
        GAME:10,
        GAME_OVER:20
    }

    var GameStateEvents = {
        MAIN_MENU:'main menu event',
        OPTIONS_MENU:'option menu event',
        INSTRUCTIONS_MENU:'instructions menu event',
        GAME_OVER:'game over event',
        MAIN_MENU_SELECT:'game menu select event',
        GAME:'game event'
    }

    window.game.GameStates = GameStates;
    window.game.GameStateEvents = GameStateEvents;
}());