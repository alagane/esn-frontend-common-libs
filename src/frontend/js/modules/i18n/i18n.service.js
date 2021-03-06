'use strict';

require('./i18n.constants.js');
require('./i18n-string.service.js');

angular.module('esn.i18n')
  .factory('esnI18nService', function($translate, EsnI18nString, esnConfig, ESN_I18N_DEFAULT_LOCALE, ESN_I18N_DEFAULT_FULL_LOCALE, ESN_I18N_FULL_LOCALE) {
    return {
      getLocale,
      getFullLocale,
      translate,
      isI18nString
    };

    function getLocale() {
      return $translate.use() || $translate.preferredLanguage() || ESN_I18N_DEFAULT_LOCALE;
    }

    function getFullLocale(callback) {
      return esnConfig('core.language', ESN_I18N_DEFAULT_LOCALE)
        .then(function(locale) {
          const fullLocale = ESN_I18N_FULL_LOCALE.hasOwnProperty(locale) ? ESN_I18N_FULL_LOCALE[locale] : ESN_I18N_DEFAULT_FULL_LOCALE;

          return callback && typeof callback === 'function' ? callback(fullLocale) : fullLocale;
        });
    }

    /**
     * Translate a string
     * @param {String} text The text that needs to be translated
     * @param {Object} interpolateParams An object hash for dynamic values
     * @param {Boolean} ignoreSanitizeStrategy Ignore sanitize strategy. Default is false and sanitize strategy is "escape".
     */
    // TODO: Write tests for this (https://github.com/OpenPaaS-Suite/esn-frontend-common-libs/issues/83)
    function translate(text, interpolateParams = {}, ignoreSanitizeStrategy = false) {
      if (!text || text instanceof EsnI18nString) {
        return text;
      }

      if (typeof text === 'string') {
        return new EsnI18nString(text, interpolateParams, ignoreSanitizeStrategy);
      }

      throw new TypeError('The input text must be a string or an EsnI18nString object');
    }

    function isI18nString(text) {
      return text instanceof EsnI18nString;
    }
  })

  /**
   * When the value of a dynamic translated text (%s) is relied on the result of a function
   * We'll watch the translated text when it changed by the `get` method of Object.defineProperty
   * The `get` method should return the updated value
   *
   * @param {Object} object         Base object to add property
   * @param {Object} property       Name of property to watch
   * @param {Function} callback     Function ran every time we get property value
  */
  .factory('watchDynamicTranslatedValue', function() {
    return function(object, propertyName, callback) {
      Object.defineProperty(object, propertyName, {
        get() { return callback(); }
      });
    };
  });
