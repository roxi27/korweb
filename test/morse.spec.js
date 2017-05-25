
var expect = require('chai').expect;
var MorseNode = require('../app/models/morse');

describe('MorseNode', function() {

  describe('#decode', function() {
    var morse;

    beforeEach(function() {
      morse = new MorseNode;
    });

    it('given empty string returns zero', function() {
      var result = morse.decode('');
      expect(result).to.eql('');
    });

    it('given a character return the decoded string', function() {
      var result = morse.decode('.-');
      expect(result).to.eql('a');
    });

    it('given word return the decoded word', function() {
      var result = morse.decode('.... . -.--');
      expect(result).to.eql('hey');
    });

    it('given more words return the decoded words', function() {
      var result = morse.decode('.... . -.--   .--- ..- -.. .');
      expect(result).to.eql('heyjude');
    });

    it('given the SOS', function() {
      var result = morse.decode('...---...');
      expect(result).to.eql('SOS');
    });

  });

});