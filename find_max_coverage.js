const fs = require('fs');
const path = require('path');

// Read the word strength analysis data
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'word-strength-analysis.json'), 'utf-8'));

// Most common letters in English (from the analysis)
const commonLetters = ['E', 'A', 'R', 'O', 'I', 'T', 'N', 'S'];

// Function to count shared letters between two words
function countSharedLetters(word1, word2) {
  const letters1 = new Set(word1.split(''));
  const letters2 = new Set(word2.split(''));
  let sharedCount = 0;
  
  for (const letter of letters1) {
    if (letters2.has(letter)) {
      sharedCount++;
    }
  }
  
  return sharedCount;
}

// Function to count total shared letters among five words
function countTotalSharedLetters(words) {
  const letterSets = words.map(word => new Set(word.split('')));
  let totalShared = 0;
  
  // Count shared letters between all pairs
  for (let i = 0; i < letterSets.length; i++) {
    for (let j = i + 1; j < letterSets.length; j++) {
      for (const letter of letterSets[i]) {
        if (letterSets[j].has(letter)) {
          totalShared++;
        }
      }
    }
  }
  
  return totalShared;
}

// Function to count common letters in a word
function countCommonLetters(word) {
  return word.split('').filter(letter => commonLetters.includes(letter)).length;
}

// Function to calculate coverage score (prioritize unique letters and common letters)
function calculateCoverageScore(words) {
  const allLetters = new Set();
  let commonLetterCount = 0;
  
  words.forEach(word => {
    word.split('').forEach(letter => {
      allLetters.add(letter);
      if (commonLetters.includes(letter)) {
        commonLetterCount++;
      }
    });
  });
  
  // Score based on unique letters (higher is better) and common letters (higher is better)
  // Penalize shared letters (lower is better)
  const sharedLetters = countTotalSharedLetters(words);
  const uniqueLetters = allLetters.size;
  
  // Higher score = better coverage
  // Give much higher weight to common letters to ensure they're included
  return (uniqueLetters * 5) + (commonLetterCount * 20) - (sharedLetters * 1);
}

// Get all words from the analysis (excluding CLXIV/CLXVI)
const allWords = data.wordRankings.allWords.filter(word => 
  word.word !== 'clxiv' && word.word !== 'clxvi'
);

console.log('Finding 5 words with maximum letter coverage including common letters...');
console.log('');

let bestCombination = null;
let maxCoverageScore = 0;

// Try combinations of 5 words from top 100 words
const topWords = allWords.slice(0, 100);

for (let i = 0; i < topWords.length; i++) {
  for (let j = i + 1; j < topWords.length; j++) {
    for (let k = j + 1; k < topWords.length; k++) {
      for (let l = k + 1; l < topWords.length; l++) {
        for (let m = l + 1; m < topWords.length; m++) {
          const words = [
            topWords[i].word,
            topWords[j].word,
            topWords[k].word,
            topWords[l].word,
            topWords[m].word
          ];
          
          const strengths = [
            topWords[i].strength,
            topWords[j].strength,
            topWords[k].strength,
            topWords[l].strength,
            topWords[m].strength
          ];
          
          const coverageScore = calculateCoverageScore(words);
          
          if (coverageScore > maxCoverageScore) {
            maxCoverageScore = coverageScore;
            bestCombination = {
              words: words,
              strengths: strengths,
              coverageScore: coverageScore
            };
          }
        }
      }
    }
  }
}

if (bestCombination) {
  console.log('OPTIMAL 5-WORD COMBINATION FOR MAXIMUM COVERAGE:');
  console.log('');
  
  bestCombination.words.forEach((word, index) => {
    console.log(`${index + 1}. ${word} - Strength: ${bestCombination.strengths[index]}`);
  });
  
  // Calculate detailed metrics
  const allLetters = new Set();
  let commonLetterCount = 0;
  let totalCommonLetters = 0;
  
  bestCombination.words.forEach(word => {
    word.split('').forEach(letter => {
      allLetters.add(letter);
      if (commonLetters.includes(letter)) {
        totalCommonLetters++;
      }
    });
  });
  
  const sharedLetters = countTotalSharedLetters(bestCombination.words);
  const totalStrength = bestCombination.strengths.reduce((sum, strength) => sum + strength, 0);
  
  console.log('');
  console.log(`Total Strength: ${totalStrength.toFixed(2)}`);
  console.log(`Unique Letters Covered: ${allLetters.size}/26 (${((allLetters.size/26)*100).toFixed(1)}%)`);
  console.log(`Common Letters Included: ${totalCommonLetters} occurrences`);
  console.log(`Total Shared Letters: ${sharedLetters}`);
  console.log(`Coverage Score: ${bestCombination.coverageScore}`);
  
  // Show detailed letter analysis
  console.log('');
  console.log('Detailed Letter Analysis:');
  bestCombination.words.forEach((word, index) => {
    const letters = word.split('').join(', ');
    const commonCount = countCommonLetters(word);
    console.log(`${word}: ${letters} (${commonCount} common letters)`);
  });
  
  // Show covered and missing letters
  const coveredLetters = Array.from(allLetters).sort();
  const allAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const missingLetters = allAlphabet.filter(letter => !allLetters.has(letter));
  
  console.log('');
  console.log(`Covered Letters (${coveredLetters.length}): ${coveredLetters.join(', ')}`);
  console.log(`Missing Letters (${missingLetters.length}): ${missingLetters.join(', ')}`);
  
  // Show common letters breakdown
  console.log('');
  console.log('Common Letters Analysis:');
  commonLetters.forEach(letter => {
    const count = bestCombination.words.reduce((sum, word) => {
      return sum + (word.split('').filter(l => l === letter).length);
    }, 0);
    console.log(`${letter}: ${count} occurrences`);
  });
}

// Also show top 10 combinations for reference
console.log('\n' + '='.repeat(70));
console.log('TOP 10 COMBINATIONS (by coverage score):');
console.log('='.repeat(70));

const combinations = [];

// Generate combinations and sort them (limiting to avoid too many combinations)
const maxWords = Math.min(30, topWords.length);
for (let i = 0; i < maxWords; i++) {
  for (let j = i + 1; j < maxWords; j++) {
    for (let k = j + 1; k < maxWords; k++) {
      for (let l = k + 1; l < maxWords; l++) {
        for (let m = l + 1; m < maxWords; m++) {
          const words = [
            topWords[i].word,
            topWords[j].word,
            topWords[k].word,
            topWords[l].word,
            topWords[m].word
          ];
          
          const strengths = [
            topWords[i].strength,
            topWords[j].strength,
            topWords[k].strength,
            topWords[l].strength,
            topWords[m].strength
          ];
          
          const coverageScore = calculateCoverageScore(words);
          const allLetters = new Set();
          let commonLetterCount = 0;
          
          words.forEach(word => {
            word.split('').forEach(letter => {
              allLetters.add(letter);
              if (commonLetters.includes(letter)) {
                commonLetterCount++;
              }
            });
          });
          
          combinations.push({
            words: words,
            strengths: strengths,
            coverageScore: coverageScore,
            uniqueLetters: allLetters.size,
            commonLetters: commonLetterCount
          });
        }
      }
    }
  }
}

// Sort by coverage score (descending)
combinations.sort((a, b) => b.coverageScore - a.coverageScore);

// Show top 10
combinations.slice(0, 10).forEach((combo, index) => {
  console.log(`${index + 1}. ${combo.words.join(', ')}`);
  console.log(`   Strength: ${combo.strengths.map(s => s.toFixed(1)).join(', ')} (Total: ${combo.strengths.reduce((a,b) => a+b, 0).toFixed(1)})`);
  console.log(`   Coverage: ${combo.uniqueLetters}/26 letters, ${combo.commonLetters} common letters, Score: ${combo.coverageScore}`);
  console.log('');
});
