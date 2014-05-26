"use strict";

describe('Read tokens from xml url', function(){
  var sentence1Url = 'http://services.perseids.org/llt-data/1999.02.0002.2.1.1.xml';
  var sentence2Url = 'http://services.perseids.org/llt-data/1999.02.0002.2.1.2.xml';
  beforeEach(function() {
    browser.get('/app/#/staging');

  });

  describe('Sentence 1', function() {
    beforeEach(function() {
      element(by.model('query')).sendKeys(sentence1Url);
      element(by.buttonText('Search')).click();
    });

    it('changes the url', function() {
      // change %3A to : because angular doesn't encode it
      var expectedParameterUrl = encodeURIComponent(sentence1Url).replace("%3A", ":");
      expect(browser.getCurrentUrl()).toContain("?doc=" + expectedParameterUrl);
    });

    it('displays the data from the given xml', function() {
      expect(element(by.css("token")).getText()).toEqual("Cum");
    });
  });

  describe('Sentence 2', function() {
    beforeEach(function() {
      element(by.model('query')).sendKeys(sentence2Url + '\n');
    });

    it('displays the data from the given xml', function() {
      expect(element(by.css("token")).getText()).toEqual("Coniurandi");
    });
 });
});
