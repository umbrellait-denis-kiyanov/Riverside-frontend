import * as Handsontable from 'handsontable';

/**
 * @plugin External plugin skeleton.
 * Note: keep in mind, that Handsontable instance creates one instance of the plugin class.
 *
 * @param hotInstance
 * @constructor
 */
export function FormulaPlugin(hotInstance) {

  // Call the BasePlugin constructor.
  // @ts-ignore
  Handsontable.plugins.BasePlugin.call(this, hotInstance);

  this._superClass = Handsontable.plugins.BasePlugin;

  // Initialize all your public properties in the class' constructor.
  /**
   * yourProperty description.
   *
   * @type {String}
   */
  this.yourProperty = '';
  /**
   * anotherProperty description.
   * @type {Array}
   */
  this.anotherProperty = [];
}

// Inherit the BasePlugin prototype.
// @ts-ignore
FormulaPlugin.prototype = Object.create(Handsontable.plugins.BasePlugin.prototype, {
  constructor: {
    writable: true,
    configurable: true,
    value: FormulaPlugin
  },
});

/**
 * Checks if the plugin is enabled in the settings.
 */
FormulaPlugin.prototype.isEnabled = function() {
  return !!this.hot.getSettings().FormulaPlugin;
};

/**
 * The enablePlugin method is triggered on the beforeInit hook. It should contain your initial plugin setup, along with
 * the hook connections.
 * Note, that this method is run only if the statement in the isEnabled method is true.
 */
FormulaPlugin.prototype.enablePlugin = function() {
  this.yourProperty = 'Your Value';

  // Add all your plugin hooks here. It's a good idea to make use of the arrow functions to keep the context consistent.
  this.addHook('afterChange', this.onAfterChange.bind(this));

  // https://codepen.io/vfx/pen/ZpvpAg
  // https://www.npmjs.com/package/hot-formula-parser

  this.addHook('beforeRender', (isForced: boolean, skipRender: object) => {
    console.log(this.hot.getData());
  });

  // this.addHook('beforeValueRender', (value: any, cellProperties: object) => {
  //   console.log(this.hot.getData());
  //   console.log(value, cellProperties);
  // });

  // The super class' method assigns the this.enabled property to true, which can be later used to check if plugin is already enabled.
  this._superClass.prototype.enablePlugin.call(this);
};

/**
 * The disablePlugin method is used to disable the plugin. Reset all of your classes properties to their default values here.
 */
FormulaPlugin.prototype.disablePlugin = function() {
  this.yourProperty = '';
  this.anotherProperty = [];

  // The super class' method takes care of clearing the hook connections and assigning the 'false' value to the 'this.enabled' property.
  this._superClass.prototype.disablePlugin.call(this);
};

/**
 * The updatePlugin method is called on the afterUpdateSettings hook (unless the updateSettings method turned the plugin off).
 * It should contain all the stuff your plugin needs to do to work properly after the Handsontable instance settings were modified.
 */
FormulaPlugin.prototype.updatePlugin = function() {

  // The updatePlugin method needs to contain all the code needed to properly re-enable the plugin. In most cases simply disabling and enabling the plugin should do the trick.
  this.disablePlugin();
  this.enablePlugin();

  this._superClass.prototype.updatePlugin.call(this);
};

/**
 * The afterChange hook callback.
 *
 * @param {Array} changes Array of changes.
 * @param {String} source Describes the source of the change.
 */
FormulaPlugin.prototype.onAfterChange = function(changes, source) {
  // afterChange callback goes here.
};

/**
 * The destroy method should de-assign all of your properties.
 */
FormulaPlugin.prototype.destroy = function() {
  // The super method takes care of de-assigning the event callbacks, plugin hooks and clearing all the plugin properties.
  this._superClass.prototype.destroy.call(this);
};

// You need to register your plugin in order to use it within Handsontable.
// @ts-ignore
Handsontable.plugins.registerPlugin('formulaPlugin', FormulaPlugin);