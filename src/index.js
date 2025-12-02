"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hunspell_spellchecker_1 = __importDefault(require("hunspell-spellchecker"));
const fs_1 = require("fs");
const path_1 = require("path");
// Configuration constants
const ALL_CHARS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const ACCEPTED_CHARS = 'uni'.split('');
const DENIED_CHARS = 'qwertyopasgcv'.split('');
const WORD_LENGTH = 5;
// Wordle constraints
const knownCharacterPositions = {};
const knownCharacterRejectedPositions = {
    2: 'ui',
    3: 'ni',
    5: 'n',
};
let allResults = [];
/**
 * Generate all possible word combinations recursively
 */
const generateWordCombinations = ({ index, maxLengthOfWord, str, allowedChars, }) => {
    if (index === maxLengthOfWord) {
        allResults.push(str);
        return;
    }
    for (const char of allowedChars) {
        generateWordCombinations({
            index: index + 1,
            maxLengthOfWord,
            str: str + char,
            allowedChars,
        });
    }
};
/**
 * Check if a word contains all required characters
 */
const hasAllRequiredCharacters = (word) => {
    return ACCEPTED_CHARS.every(char => word.includes(char));
};
/**
 * Check if a word has correct characters in known positions
 */
const hasCorrectKnownPositions = (word) => {
    const knownPositionKeys = Object.keys(knownCharacterPositions).map(Number);
    for (const position of knownPositionKeys) {
        if (word.charAt(position - 1) !== knownCharacterPositions[position]) {
            return false;
        }
    }
    return true;
};
/**
 * Check if a word doesn't have rejected characters in specific positions
 */
const hasValidRejectedPositions = (word) => {
    const rejectedPositionKeys = Object.keys(knownCharacterRejectedPositions).map(Number);
    for (const position of rejectedPositionKeys) {
        const rejectedChars = knownCharacterRejectedPositions[position].split('');
        const currentChar = word.charAt(position - 1);
        if (rejectedChars.includes(currentChar)) {
            return false;
        }
    }
    return true;
};
/**
 * Initialize spellchecker with dictionary files
 */
const initializeSpellchecker = () => {
    const spellchecker = new hunspell_spellchecker_1.default();
    try {
        const dictionary = spellchecker.parse({
            aff: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, 'en_EN.aff')),
            dic: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, 'en_EN.dic')),
        });
        spellchecker.use(dictionary);
        return spellchecker;
    }
    catch (error) {
        console.error('Failed to load dictionary files:', error);
        throw new Error('Dictionary files not found. Please ensure en_EN.aff and en_EN.dic are in the src directory.');
    }
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Generating word combinations...');
        // Generate all possible combinations
        generateWordCombinations({
            index: 0,
            maxLengthOfWord: WORD_LENGTH,
            str: '',
            allowedChars: ALL_CHARS.filter(char => !DENIED_CHARS.includes(char)),
        });
        console.log(`Generated ${allResults.length} combinations`);
        // Filter words that contain all required characters
        const wordsWithAllCharacters = allResults.filter(hasAllRequiredCharacters);
        console.log(`${wordsWithAllCharacters.length} words contain all required characters`);
        // Filter words with correct known positions
        const wordsWithCorrectPositions = wordsWithAllCharacters.filter(hasCorrectKnownPositions);
        console.log(`${wordsWithCorrectPositions.length} words have correct known positions`);
        // Filter words with valid rejected positions
        const wordsWithValidPositions = wordsWithCorrectPositions.filter(hasValidRejectedPositions);
        console.log(`${wordsWithValidPositions.length} words have valid rejected positions`);
        // Initialize spellchecker and filter valid words
        const spellchecker = initializeSpellchecker();
        const validWords = wordsWithValidPositions.filter(word => spellchecker.check(word));
        console.log(`\nFound ${validWords.length} valid words:`);
        validWords.forEach(word => console.log(`  → ${word}`));
        if (validWords.length === 0) {
            console.log('\nNo valid words found with the given constraints.');
        }
    }
    catch (error) {
        console.error('Error solving Wordle:', error);
    }
});
main();
