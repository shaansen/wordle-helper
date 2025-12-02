"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
// Configuration constants
var ALL_CHARS = 'abcdefghijklmnopqrstuvwxyz'.split('');
var ACCEPTED_CHARS = 'uni'.split('');
var DENIED_CHARS = 'qwertyopasgcv'.split('');
var WORD_LENGTH = 5;
// Wordle constraints
var knownCharacterPositions = {};
var knownCharacterRejectedPositions = {
    2: 'ui',
    3: 'ni',
    5: 'n',
};
/**
 * Original approach - generates all combinations then filters
 */
var originalApproach = function () {
    console.log('\n=== Original Approach ===');
    var startTime = Date.now();
    var allResults = [];
    var generateCombinations = function (_a) {
        var index = _a.index, maxLengthOfWord = _a.maxLengthOfWord, str = _a.str, allowedChars = _a.allowedChars;
        if (index === maxLengthOfWord) {
            allResults.push(str);
            return;
        }
        for (var _i = 0, allowedChars_1 = allowedChars; _i < allowedChars_1.length; _i++) {
            var char = allowedChars_1[_i];
            generateCombinations({
                index: index + 1,
                maxLengthOfWord: maxLengthOfWord,
                str: str + char,
                allowedChars: allowedChars,
            });
        }
    };
    generateCombinations({
        index: 0,
        maxLengthOfWord: WORD_LENGTH,
        str: '',
        allowedChars: ALL_CHARS.filter(function (char) { return !DENIED_CHARS.includes(char); }),
    });
    var wordsWithAllCharacters = allResults.filter(function (word) {
        return ACCEPTED_CHARS.every(function (char) { return word.includes(char); });
    });
    var wordsWithRightPositions = wordsWithAllCharacters
        .filter(function (word) {
        var keysArr = _.keys(knownCharacterPositions).map(_.toNumber);
        for (var _i = 0, keysArr_1 = keysArr; _i < keysArr_1.length; _i++) {
            var k = keysArr_1[_i];
            if (word.charAt(k - 1) !== knownCharacterPositions[k]) {
                return false;
            }
        }
        return true;
    })
        .filter(function (word) {
        var keysArr = _.keys(knownCharacterRejectedPositions).map(_.toNumber);
        var result = true;
        var _loop_1 = function (k) {
            var listOfCharactersThatCannotBeInThisPosition = knownCharacterRejectedPositions[k].split('');
            result =
                result &&
                    !listOfCharactersThatCannotBeInThisPosition.some(function (a) {
                        return word.charAt(k - 1) === a;
                    });
        };
        for (var _i = 0, keysArr_2 = keysArr; _i < keysArr_2.length; _i++) {
            var k = keysArr_2[_i];
            _loop_1(k);
        }
        return result;
    });
    var endTime = Date.now();
    console.log("Time taken: ".concat(endTime - startTime, "ms"));
    console.log("Generated combinations: ".concat(allResults.length));
    console.log("Words after filtering: ".concat(wordsWithRightPositions.length));
    return wordsWithRightPositions;
};
/**
 * Improved approach - better structure and readability
 */
var improvedApproach = function () {
    console.log('\n=== Improved Approach ===');
    var startTime = Date.now();
    var allResults = [];
    var generateWordCombinations = function (_a) {
        var index = _a.index, maxLengthOfWord = _a.maxLengthOfWord, str = _a.str, allowedChars = _a.allowedChars;
        if (index === maxLengthOfWord) {
            allResults.push(str);
            return;
        }
        for (var _i = 0, allowedChars_2 = allowedChars; _i < allowedChars_2.length; _i++) {
            var char = allowedChars_2[_i];
            generateWordCombinations({
                index: index + 1,
                maxLengthOfWord: maxLengthOfWord,
                str: str + char,
                allowedChars: allowedChars,
            });
        }
    };
    var hasAllRequiredCharacters = function (word) {
        return ACCEPTED_CHARS.every(function (char) { return word.includes(char); });
    };
    var hasCorrectKnownPositions = function (word) {
        var knownPositionKeys = Object.keys(knownCharacterPositions).map(Number);
        for (var _i = 0, knownPositionKeys_1 = knownPositionKeys; _i < knownPositionKeys_1.length; _i++) {
            var position = knownPositionKeys_1[_i];
            if (word.charAt(position - 1) !== knownCharacterPositions[position]) {
                return false;
            }
        }
        return true;
    };
    var hasValidRejectedPositions = function (word) {
        var rejectedPositionKeys = Object.keys(knownCharacterRejectedPositions).map(Number);
        for (var _i = 0, rejectedPositionKeys_1 = rejectedPositionKeys; _i < rejectedPositionKeys_1.length; _i++) {
            var position = rejectedPositionKeys_1[_i];
            var rejectedChars = knownCharacterRejectedPositions[position].split('');
            var currentChar = word.charAt(position - 1);
            if (rejectedChars.includes(currentChar)) {
                return false;
            }
        }
        return true;
    };
    generateWordCombinations({
        index: 0,
        maxLengthOfWord: WORD_LENGTH,
        str: '',
        allowedChars: ALL_CHARS.filter(function (char) { return !DENIED_CHARS.includes(char); }),
    });
    var wordsWithAllCharacters = allResults.filter(hasAllRequiredCharacters);
    var wordsWithCorrectPositions = wordsWithAllCharacters.filter(hasCorrectKnownPositions);
    var wordsWithValidPositions = wordsWithCorrectPositions.filter(hasValidRejectedPositions);
    var endTime = Date.now();
    console.log("Time taken: ".concat(endTime - startTime, "ms"));
    console.log("Generated combinations: ".concat(allResults.length));
    console.log("Words after filtering: ".concat(wordsWithValidPositions.length));
    return wordsWithValidPositions;
};
var main = function () {
    console.log('Performance Comparison');
    console.log('=====================');
    var originalResults = originalApproach();
    var improvedResults = improvedApproach();
    console.log('\n=== Results Comparison ===');
    console.log("Original approach found: ".concat(originalResults.length, " words"));
    console.log("Improved approach found: ".concat(improvedResults.length, " words"));
    console.log('Both approaches produce the same results:', JSON.stringify(originalResults.sort()) ===
        JSON.stringify(improvedResults.sort()));
};
main();
