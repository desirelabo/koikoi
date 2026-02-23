const cardData = [
  {id:0,name:
'松',type:
'光',emoji:
'🌲🦢',iconClass:
'icon-glow', attribute: 'wood'},
  {id:1,name:
'松',type:
'赤短',emoji:
'🌲🔴',iconClass:
'icon-ribbon', attribute: 'wood'},
  {id:2,name:
'松',type:
'カス1',emoji:
'🌲🍂',iconClass:
'icon-chaff', attribute: 'wood'},
  {id:3,name:
'松',type:
'カス2',emoji:
'🌲🍃',iconClass:
'icon-chaff', attribute: 'wood'},
  {id:4,name:
'梅',type:
'種',emoji:
'🍑🐦',iconClass:
'icon-seed', attribute: 'flower'},
  {id:5,name:
'梅',type:
'赤短',emoji:
'🍑🔴',iconClass:
'icon-ribbon', attribute: 'flower'},
  {id:6,name:
'梅',type:
'カス1',emoji:
'🍑🍂',iconClass:
'icon-chaff', attribute: 'flower'},
  {id:7,name:
'梅',type:
'カス2',emoji:
'🍑🍃',iconClass:
'icon-chaff', attribute: 'flower'},
  {id:8,name:
'桜',type:
'光',emoji:
'🌸🎪',iconClass:
'icon-glow', attribute: 'wood'},
  {id:9,name:
'桜',type:
'赤短',emoji:
'🌸🔴',iconClass:
'icon-ribbon', attribute: 'wood'},
  {id:10,name:
'桜',type:
'カス1',emoji:
'🌸🍂',iconClass:
'icon-chaff', attribute: 'wood'},
  {id:11,name:
'桜',type:
'カス2',emoji:
'🌸🍃',iconClass:
'icon-chaff', attribute: 'wood'},
  {id:12,name:
'藤',type:
'種',emoji:
'🌿🐦',iconClass:
'icon-seed', attribute: 'vine'},
  {id:13,name:
'藤',type:
'赤短',emoji:
'🌿🔴',iconClass:
'icon-ribbon', attribute: 'vine'},
  {id:14,name:
'藤',type:
'カス1',emoji:
'🌿🍂',iconClass:
'icon-chaff', attribute: 'vine'},
  {id:15,name:
'藤',type:
'カス2',emoji:
'🌿🍃',iconClass:
'icon-chaff', attribute: 'vine'},
  {id:16,name:
'菖蒲',type:
'種',emoji:
'🪻🌉',iconClass:
'icon-seed', attribute: 'water'},
  {id:17,name:
'菖蒲',type:
'赤短',emoji:
'🪻🔴',iconClass:
'icon-ribbon', attribute: 'water'},
  {id:18,name:
'菖蒲',type:
'カス1',emoji:
'🪻🍂',iconClass:
'icon-chaff', attribute: 'water'},
  {id:19,name:
'菖蒲',type:
'カス2',emoji:
'🪻🍃',iconClass:
'icon-chaff', attribute: 'water'},
  {id:20,name:
'牡丹',type:
'種',emoji:
'🌹🦋',iconClass:
'icon-seed', attribute: 'flower'},
  {id:21,name:
'牡丹',type:
'青短',emoji:
'🌹🔵',iconClass:
'icon-ribbon', attribute: 'flower'},
  {id:22,name:
'牡丹',type:
'カス1',emoji:
'🌹🍂',iconClass:
'icon-chaff', attribute: 'flower'},
  {id:23,name:
'牡丹',type:
'カス2',emoji:
'🌹🍃',iconClass:
'icon-chaff', attribute: 'flower'},
  {id:24,name:
'萩',type:
'種',emoji:
'💐🐗',iconClass:
'icon-seed', attribute: 'grass'},
  {id:25,name:
'萩',type:
'赤短',emoji:
'💐🔴',iconClass:
'icon-ribbon', attribute: 'grass'},
  {id:26,name:
'萩',type:
'カス1',emoji:
'💐🍂',iconClass:
'icon-chaff', attribute: 'grass'},
  {id:27,name:
'萩',type:
'カス2',emoji:
'💐🍃',iconClass:
'icon-chaff', attribute: 'grass'},
  {id:28,name:
'芒',type:
'光',emoji:
'🌾🌝',iconClass:
'icon-glow', attribute: 'grass'},
  {id:29,name:
'芒',type:
'種',emoji:
'🌾🦆',iconClass:
'icon-seed', attribute: 'grass'},
  {id:30,name:
'芒',type:
'カス1',emoji:
'🌾🍂',iconClass:
'icon-chaff', attribute: 'grass'},
  {id:31,name:
'芒',type:
'カス2',emoji:
'🌾🍃',iconClass:
'icon-chaff', attribute: 'grass'},
  {id:32,name:
'菊',type:
'種',emoji:
'🌻🍶',iconClass:
'icon-seed', attribute: 'flower'},
  {id:33,name:
'菊',type:
'青短',emoji:
'🌻🔵',iconClass:
'icon-ribbon', attribute: 'flower'},
  {id:34,name:
'菊',type:
'カス1',emoji:
'🌻🍂',iconClass:
'icon-chaff', attribute: 'flower'},
  {id:35,name:
'菊',type:
'カス2',emoji:
'🌻🍃',iconClass:
'icon-chaff', attribute: 'flower'},
  {id:36,name:
'紅葉',type:
'種',emoji:
'🍁🦌',iconClass:
'icon-seed', attribute: 'leaf'},
  {id:37,name:
'紅葉',type:
'青短',emoji:
'🍁🔵',iconClass:
'icon-ribbon', attribute: 'leaf'},
  {id:38,name:
'紅葉',type:
'カス1',emoji:
'🍁🍂',iconClass:
'icon-chaff', attribute: 'leaf'},
  {id:39,name:
'紅葉',type:
'カス2',emoji:
'🍁🍃',iconClass:
'icon-chaff', attribute: 'leaf'},
  {id:40,name:
'柳',type:
'光',emoji:
'🌵☔',iconClass:
'icon-glow', attribute: 'water'},
  {id:41,name:
'柳',type:
'種',emoji:
'🌵🐦',iconClass:
'icon-seed', attribute: 'water'},
  {id:42,name:
'柳',type:
'赤短',emoji:
'🌵🔴',iconClass:
'icon-ribbon', attribute: 'water'},
  {id:43,name:
'柳',type:
'カス',emoji:
'🌵🍂',iconClass:
'icon-chaff', attribute: 'water'},
  {id:44,name:
'桐',type:
'光',emoji:
'🎋🦚',iconClass:
'icon-glow', attribute: 'wood'},
  {id:45,name:
'桐',type:
'カス1',emoji:
'🎋🍂',iconClass:
'icon-chaff', attribute: 'wood'},
  {id:46,name:
'桐',type:
'カス2',emoji:
'🎋🍃',iconClass:
'icon-chaff', attribute: 'wood'},
  {id:47,name:
'桐',type:
'カス3',emoji:
'🎋🍀',iconClass:
'icon-chaff', attribute: 'wood'}
];

export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getCardValue(card) {
  const monthOrder = [
'松', '梅', '桜', '藤', '菖蒲', '牡丹', '萩', '芒', '菊', '紅葉', '柳', '桐'];
  const monthValue = monthOrder.indexOf(card.name);
  if (card.type === 
'光') return 1000 + monthValue;
  if (card.type === 
'種') return 800 + monthValue;
  if (card.type === 
'赤短' || card.type === 
'青短') return 600 + monthValue;
  return 400 + monthValue;
}

export function sortHand(hand) {
  return hand.slice().sort((a, b) => getCardValue(b) - getCardValue(a));
}

export function getCardTypeClass(card) {
  if (card.type === 
'光') return 
'card-light';
  if (card.type === 
'赤短' || card.type === 
'青短') return 
'card-ribbon';
  if (card.type === 
'種') return 
'card-seed';
  return 
'card-chaff';
}

export const SEASONS = [
'season-1', 
'season-2', 
'season-3', 
'season-4', 
'season-5'];
export let currentSeasonIndex = 0;

export const DIFFICULTY_PRESETS = {
  easy: {
    pairPlayChance: 0.6,
  },
  normal: {
    pairPlayChance: 0.85,
  },
  hard: {
    pairPlayChance: 1.0,
  }
};

export function getCurrentDifficulty(gameState) {
  return DIFFICULTY_PRESETS[gameState.difficultyKey] || DIFFICULTY_PRESETS.normal;
}

export function applySeason(index) {
  const body = document.body;
  if (!body) return;
  SEASONS.forEach(cls => body.classList.remove(cls));
  const seasonClass = SEASONS[index % SEASONS.length];
  body.classList.add(seasonClass);
}

export function applySeasonByTime() {
  const now = new Date();
  const month = now.getMonth();
  if (month === 2 || month === 3) currentSeasonIndex = 0;
  else if (month >= 4 && month <= 7) currentSeasonIndex = 1;
  else if (month >= 8 && month <= 10) currentSeasonIndex = 2;
  else currentSeasonIndex = 3;
  applySeason(currentSeasonIndex);
}
