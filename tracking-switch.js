'use strict';

var url = require('url');
var tinyCookie = require('tiny-cookie');

module.exports = function TrackingSwitch(successPathRegExp) {
  var self = this;
  this.successPathRegExp = successPathRegExp;
  this.currentUrl = url.parse(window.location.href, true);

  var canExecute = function () {
    return self.currentUrl && self.currentUrl instanceof Object;
  };

  this.execute = function () {
    if (!canExecute()) {
      return;
    }

    if (this.currentUrl.path.match(this.successPathRegExp)) {
      tinyCookie.remove('fond_of_tracking');
      return;
    }

    var partner = null;

    if (this.currentUrl.query.utm_source && typeof this.currentUrl.query.utm_source === 'string') {
      partner = this.currentUrl.query.utm_source;
    }

    if (partner === null && this.currentUrl.query.gclid && typeof this.currentUrl.query.gclid === 'string') {
      partner = this.currentUrl.query.gclid;
    }

    if (partner != null) {
      var now = new Date;
      now.setMonth(now.getMonth() + 1);

      tinyCookie.set('fond_of_tracking', partner, {expires: now.toGMTString()});
    }
  }
};