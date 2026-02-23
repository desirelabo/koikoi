import { getCurrentDifficulty, getCardValue } from './GameUtils.js';

export class AIEngine {
  constructor(systemController) {
    this.systemController = systemController;
  }

  aiTurn(gameState) {
    if (gameState.aiHand.length === 0) {
      this.systemController.endRound();
      return;
    }

    const difficulty = getCurrentDifficulty(gameState);

    const pairableIndexes = gameState.aiHand
      .map((card, index) => (gameState.fieldCards.some(f => f.name === card.name) ? index : -1))
      .filter(index => index !== -1);

    let handIndex;

    if (pairableIndexes.length > 0 && Math.random() < difficulty.pairPlayChance) {
      const pick = Math.floor(Math.random() * pairableIndexes.length);
      handIndex = pairableIndexes[pick];
    } else {
      handIndex = Math.floor(Math.random() * gameState.aiHand.length);
    }

    const selectedCard = gameState.aiHand[handIndex];
    const matchingFieldIndex = gameState.fieldCards.findIndex(card => card.name === selectedCard.name);

    if (matchingFieldIndex !== -1) {
      const takenHandCard = gameState.aiHand.splice(handIndex, 1)[0];
      const takenFieldCard = gameState.fieldCards.splice(matchingFieldIndex, 1)[0];
      gameState.opponentPairedCards.push(takenHandCard, takenFieldCard);
      this.systemController.uiManager.setMessage(`🤖相手が${selectedCard.name}のペアを取りました`);
    } else {
      const discardedCard = gameState.aiHand.splice(handIndex, 1)[0];
      gameState.fieldCards.push(discardedCard);
      gameState.fieldCards.sort((a, b) => getCardValue(b) - getCardValue(a));
      this.systemController.uiManager.setMessage(`🤖相手が${selectedCard.name}を場に捨てました`);
    }
    this.systemController.uiManager.updateUI(gameState, this.systemController.selectHandCard.bind(this.systemController), this.systemController.selectFieldCard.bind(this.systemController));
    setTimeout(() => {
      this.systemController.drawFromDeck();
    }, 1500);
  }
}
