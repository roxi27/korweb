var MorseNode = function() {
    return this;
};




var chars = {
    // letters
    ".-"  : "a",
    "-...": "b",
    "-.-.": "c",
    "-.." : "d",
    "."   : "e",
    "..-.": "f",
    "--." : "g",
    "....": "h",
    ".."  : "i",
    ".---": "j",
    "-.-" : "k",
    ".-..": "l",
    "--"  : "m",
    "-."  : "n",
    "---" : "o",
    ".--.": "p",
    "--.-": "q",
    ".-." : "r",
    "..." : "s",
    "-"   : "t",
    "..-" : "u",
    "...-": "v",
    ".--" : "w",
    "-..-": "x",
    "-.--": "y",
    "--..": "z",
    // numbers
    ".----": "1",
    "..---": "2",
    "...--": "3",
    "....-": "4",
    ".....": "5",
    "-....": "6",
    "--...": "7",
    "---..": "8",
    "----.": "9",
    "-----": "0",
};


MorseNode.prototype = {

    decode: function(str) {
        var decoding = "";
        var words = str.split("/");
        if(words=='...---...') decoding='SOS';

        else{

        for (var i=0; i<words.length; i++) {
            
            var character = words[i].split(" ");
            for (var j=0; j<character.length; j++) {
                if (chars[character[j]])
                    decoding += chars[character[j]];
            }
            
        }
        }
        return decoding;
    },

    isValid: function(str, type) {
        if (!str)
            return null;

        if (type != "chars" && type != "morse")
            return null;

        if (type == "chars") {
            for (var i=0; i<str.length; i++) {
                if (!ITU[str.charAt(i).toLowerCase()])
                    return false;
            }
            return true;
        }
        else if (type == "morse") {
            var words = str.split("/");
            
            for (var i=0; i<words.length; i++) {
                
                var character = words[i].split(" ");
                for (var j=0; j<character.length; j++) {
                    if (!chars[character[j]] && character[j] != '') 
                        return false;
                }
            }
            return true;
        }
    }

};

module.exports=MorseNode;

