import { getCardValue, cardData } from './GameUtils.js';

export class HyperJudge {
  calculateRoles(pairedCards) {
    const roles = [];
    
    const lightCards = pairedCards.filter(c => c.type === '光');
    const ribbonCards = pairedCards.filter(c => c.type === '赤短' || c.type === '青短');
    const redRibbonCards = pairedCards.filter(c => c.type === '赤短');
    const blueRibbonCards = pairedCards.filter(c => c.type === '青短');
    const seedCards = pairedCards.filter(c => c.type === '種');
    const chaffCards = pairedCards.filter(c => c.type.includes('カス'));

    // 既存の光札の役判定
    if (lightCards.length >= 5) {
      roles.push({name: '五光', points: 15, cards: lightCards});
    } else if (lightCards.length >= 4) {
      const hasRainMan = lightCards.some(c => c.name === '柳');
      if (hasRainMan) {
        roles.push({name: '雨四光', points: 8, cards: lightCards});
      } else {
        roles.push({name: '四光', points: 10, cards: lightCards});
      }
    } else if (lightCards.length >= 3) {
      roles.push({name: '三光', points: 5, cards: lightCards});
    }

    // 既存の猪鹿蝶、月見酒、花見酒の役判定
    const boarCard = pairedCards.find(c => c.name === '萩' && c.type === '種');
    const deerCard = pairedCards.find(c => c.name === '紅葉' && c.type === '種');
    const butterflyCard = pairedCards.find(c => c.name === '牡丹' && c.type === '種');
    
    if (boarCard && deerCard && butterflyCard) {
      roles.push({
        name: '猪鹿蝶', 
        points: 5, 
        cards: [boarCard, deerCard, butterflyCard]
      });
    }

    const moonCard = pairedCards.find(c => c.name === '芒' && c.type === '光');
    const sakeCard = pairedCards.find(c => c.name === '菊' && c.type === '種');
    
    if (moonCard && sakeCard) {
      roles.push({
        name: '月見酒', 
        points: 5, 
        cards: [moonCard, sakeCard]
      });
    }

    const curtainCard = pairedCards.find(c => c.name === '桜' && c.type === '光');
    
    if (curtainCard && sakeCard) {
      roles.push({
        name: '花見酒', 
        points: 5, 
        cards: [curtainCard, sakeCard]
      });
    }

    // 既存の赤短、青短の役判定
    const redShortCards = ['松', '梅', '桜'];
    const completedRedShort = redShortCards.filter(month => 
      redRibbonCards.some(c => c.name === month)
    );
    
    if (completedRedShort.length === 3) {
      const redShortRoleCards = completedRedShort.map(month => 
        redRibbonCards.find(c => c.name === month)
      );
      roles.push({
        name: '赤短', 
        points: 5, 
        cards: redShortRoleCards
      });
    }

    const blueShortCards = ['牡丹', '菊', '紅葉'];
    const completedBlueShort = blueShortCards.filter(month => 
      blueRibbonCards.some(c => c.name === month)
    );
    
    if (completedBlueShort.length === 3) {
      const blueShortRoleCards = completedBlueShort.map(month => 
        blueRibbonCards.find(c => c.name === month)
      );
      roles.push({
        name: '青短', 
        points: 5, 
        cards: blueShortRoleCards
      });
    }

    // 既存の短冊、種、カス札の役判定
    if (ribbonCards.length >= 5) {
      roles.push({name: '短冊', points: ribbonCards.length - 4, cards: ribbonCards});
    }

    if (seedCards.length >= 5) {
      roles.push({name: '種', points: seedCards.length - 4, cards: seedCards});
    }

    if (chaffCards.length >= 10) {
      roles.push({name: 'カス', points: chaffCards.length - 9, cards: chaffCards});
    }

    // 新しい属性オーブの役判定
    const attributes = {};
    pairedCards.forEach(card => {
        if (card.attribute) {
            attributes[card.attribute] = (attributes[card.attribute] || []).concat(card);
        }
    });

    for (const attr in attributes) {
        if (attributes[attr].length >= 3) {
            roles.push({name: `${attr}の加護`, points: 3, cards: attributes[attr]});
        }
    }

    return roles;
  }

  calculateFinalScore(pairedCards) {
    let score = 0;
    pairedCards.forEach(card => {
      if (card.type === '光') score += 3;
      else if (card.type === '種') score += 2;
      else if (card.type === '赤短' || card.type === '青短') score += 1;
    });
    return score;
  }
}
