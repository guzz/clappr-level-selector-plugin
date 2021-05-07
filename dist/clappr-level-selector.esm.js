import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import { template, Events, Styler, UICorePlugin } from '@clappr/core';

var pluginHtml = "<button data-level-selector-button>\n  Auto\n</button>\n<ul>\n  <% if (title) { %>\n  <li data-title><%= title %></li>\n  <% }; %>\n  <li><a href=\"#\" data-level-selector-select=\"-1\">AUTO</a></li>\n  <% for (var i = 0; i < levels.length; i++) { %>\n    <li><a href=\"#\" data-level-selector-select=\"<%= levels[i].id %>\"><%= levels[i].label %></a></li>\n  <% }; %>\n</ul>\n";

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".level_selector[data-level-selector] {\n  float: right;\n  position: relative;\n  height: 100%; }\n  .level_selector[data-level-selector] button {\n    background-color: transparent;\n    color: #fff;\n    font-family: Roboto,\"Open Sans\",Arial,sans-serif;\n    -webkit-font-smoothing: antialiased;\n    border: none;\n    font-size: 12px;\n    height: 100%; }\n    .level_selector[data-level-selector] button:hover {\n      color: #c9c9c9; }\n    .level_selector[data-level-selector] button.changing {\n      -webkit-animation: pulse 0.5s infinite alternate; }\n  .level_selector[data-level-selector] > ul {\n    overflow-x: hidden;\n    overflow-y: auto;\n    list-style-type: none;\n    position: absolute;\n    bottom: 100%;\n    display: none;\n    background-color: rgba(28, 28, 28, 0.9);\n    white-space: nowrap; }\n  .level_selector[data-level-selector] li {\n    font-size: 12px;\n    color: #eee; }\n    .level_selector[data-level-selector] li[data-title] {\n      background-color: #333;\n      padding: 8px 25px; }\n    .level_selector[data-level-selector] li a {\n      color: #eee;\n      padding: 5px 18px;\n      display: block;\n      text-decoration: none; }\n      .level_selector[data-level-selector] li a:hover {\n        background-color: rgba(255, 255, 255, 0.1);\n        color: #fff; }\n        .level_selector[data-level-selector] li a:hover a {\n          color: #fff;\n          text-decoration: none; }\n    .level_selector[data-level-selector] li.current a {\n      color: #2ecc71; }\n\n@-webkit-keyframes pulse {\n  0% {\n    color: #fff; }\n  50% {\n    color: #ff0101; }\n  100% {\n    color: #B80000; } }\n";
styleInject(css_248z);

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var AUTO = -1;

var LevelSelector = /*#__PURE__*/function (_UICorePlugin) {
  _inherits(LevelSelector, _UICorePlugin);

  var _super = _createSuper(LevelSelector);

  function LevelSelector() {
    _classCallCheck(this, LevelSelector);

    return _super.apply(this, arguments);
  }

  _createClass(LevelSelector, [{
    key: "name",
    get: function get() {
      return 'level_selector';
    }
  }, {
    key: "template",
    get: function get() {
      return template(pluginHtml);
    }
  }, {
    key: "attributes",
    get: function get() {
      return {
        'class': this.name,
        'data-level-selector': ''
      };
    }
  }, {
    key: "events",
    get: function get() {
      return {
        'click [data-level-selector-select]': 'onLevelSelect',
        'click [data-level-selector-button]': 'onShowLevelSelectMenu'
      };
    }
  }, {
    key: "container",
    get: function get() {
      return this.core.activeContainer ? this.core.activeContainer : this.core.mediaControl.container;
    }
  }, {
    key: "playback",
    get: function get() {
      return this.core.activePlayback ? this.core.activePlayback : this.core.getCurrentPlayback();
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      this.listenTo(this.core, Events.CORE_READY, this.bindPlaybackEvents);
      if (Events.CORE_ACTIVE_CONTAINER_CHANGED) this.listenTo(this.core, Events.CORE_ACTIVE_CONTAINER_CHANGED, this.reload);else this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this.reload);
      this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this.render);
      this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_HIDE, this.hideSelectLevelMenu);
    }
  }, {
    key: "bindPlaybackEvents",
    value: function bindPlaybackEvents() {
      if (!this.playback) return;
      this.listenTo(this.playback, Events.PLAYBACK_LEVELS_AVAILABLE, this.fillLevels);
      this.listenTo(this.playback, Events.PLAYBACK_LEVEL_SWITCH_START, this.startLevelSwitch);
      this.listenTo(this.playback, Events.PLAYBACK_LEVEL_SWITCH_END, this.stopLevelSwitch);
      this.listenTo(this.playback, Events.PLAYBACK_BITRATE, this.updateCurrentLevel);
      var playbackLevelsAvailableWasTriggered = this.playback.levels && this.playback.levels.length > 0;
      playbackLevelsAvailableWasTriggered && this.fillLevels(this.playback.levels);
    }
  }, {
    key: "reload",
    value: function reload() {
      this.stopListening(); // Ensure it stop listening before rebind events (avoid duplicate events)

      this.bindEvents();
      this.bindPlaybackEvents();
    }
  }, {
    key: "shouldRender",
    value: function shouldRender() {
      if (!this.container || !this.playback) return false;
      var respondsToCurrentLevel = this.playback.currentLevel !== undefined; // Only care if we have at least 2 to choose from

      var hasLevels = !!(this.levels && this.levels.length > 1);
      return respondsToCurrentLevel && hasLevels;
    }
  }, {
    key: "render",
    value: function render() {
      if (this.shouldRender()) {
        var style = Styler.getStyleFor(css_248z, {
          baseUrl: this.core.options.baseUrl
        });
        this.$el.html(this.template({
          'levels': this.levels,
          'title': this.getTitle()
        }));
        this.$el.append(style);
        this.core.mediaControl.$('.media-control-right-panel').append(this.el);
        this.$('.level_selector ul').css('max-height', this.core.el.offsetHeight * 0.8);
        this.highlightCurrentLevel();
      }

      return this;
    }
  }, {
    key: "fillLevels",
    value: function fillLevels(levels) {
      var initialLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : AUTO;
      if (this.selectedLevelId === undefined) this.selectedLevelId = initialLevel;
      var onLevelsAvailable = this.core.options && this.core.options.levelSelectorConfig && this.core.options.levelSelectorConfig.onLevelsAvailable;

      if (onLevelsAvailable) {
        if (typeof onLevelsAvailable === 'function') levels = onLevelsAvailable(levels.slice());else throw new TypeError('onLevelsAvailable must be a function');
      }

      this.levels = levels;
      this.configureLevelsLabels();
      this.render();
    }
  }, {
    key: "configureLevelsLabels",
    value: function configureLevelsLabels() {
      if (this.core.options.levelSelectorConfig === undefined) return;
      var labelCallback = this.core.options.levelSelectorConfig.labelCallback;
      if (labelCallback && typeof labelCallback !== 'function') throw new TypeError('labelCallback must be a function');
      var hasLabels = this.core.options.levelSelectorConfig.labels;
      var labels = hasLabels ? this.core.options.levelSelectorConfig.labels : {};

      if (labelCallback || hasLabels) {
        var level;
        var label;

        for (var levelId in this.levels) {
          level = this.levels[levelId];
          label = labels[level.id];
          if (labelCallback) level.label = labelCallback(level, label);else if (label) level.label = label;
        }
      }
    }
  }, {
    key: "findLevelBy",
    value: function findLevelBy(id) {
      var foundLevel;
      this.levels.forEach(function (level) {
        if (level.id === id) foundLevel = level;
      });
      return foundLevel;
    }
  }, {
    key: "onLevelSelect",
    value: function onLevelSelect(event) {
      this.selectedLevelId = parseInt(event.target.dataset.levelSelectorSelect, 10);
      if (this.playback.currentLevel == this.selectedLevelId) return false;
      this.playback.currentLevel = this.selectedLevelId;
      this.toggleContextMenu();
      event.stopPropagation();
      return false;
    }
  }, {
    key: "onShowLevelSelectMenu",
    value: function onShowLevelSelectMenu() {
      this.toggleContextMenu();
    }
  }, {
    key: "hideSelectLevelMenu",
    value: function hideSelectLevelMenu() {
      this.$('.level_selector ul').hide();
    }
  }, {
    key: "toggleContextMenu",
    value: function toggleContextMenu() {
      this.$('.level_selector ul').toggle();
    }
  }, {
    key: "buttonElement",
    value: function buttonElement() {
      return this.$('.level_selector button');
    }
  }, {
    key: "levelElement",
    value: function levelElement(id) {
      return this.$('.level_selector ul a' + (!isNaN(id) ? '[data-level-selector-select="' + id + '"]' : '')).parent();
    }
  }, {
    key: "getTitle",
    value: function getTitle() {
      return (this.core.options.levelSelectorConfig || {}).title;
    }
  }, {
    key: "startLevelSwitch",
    value: function startLevelSwitch() {
      this.buttonElement().addClass('changing');
    }
  }, {
    key: "stopLevelSwitch",
    value: function stopLevelSwitch() {
      this.buttonElement().removeClass('changing');
    }
  }, {
    key: "updateText",
    value: function updateText(level) {
      if (level === AUTO) this.buttonElement().text(this.currentLevel ? 'AUTO (' + this.currentLevel.label + ')' : 'AUTO');else this.buttonElement().text(this.findLevelBy(level).label);
    }
  }, {
    key: "updateCurrentLevel",
    value: function updateCurrentLevel(info) {
      var level = this.findLevelBy(info.level);
      this.currentLevel = level ? level : null;
      this.highlightCurrentLevel();
    }
  }, {
    key: "highlightCurrentLevel",
    value: function highlightCurrentLevel() {
      this.levelElement().removeClass('current');
      this.currentLevel && this.levelElement(this.currentLevel.id).addClass('current');
      this.updateText(this.selectedLevelId);
    }
  }], [{
    key: "version",
    get: function get() {
      return VERSION;
    }
  }]);

  return LevelSelector;
}(UICorePlugin);

export default LevelSelector;
