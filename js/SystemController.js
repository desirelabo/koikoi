import { GameState } from './RecordManager.js';
import { cardData, shuffleArray, getCardValue, applySeason, applySeasonByTime, currentSeasonIndex, SEASONS } from './GameUtils.js';
import { UIManager } from './UIManager.js';
import { HyperJudge } from './HyperJudge.js';
import { AIEngine } from './AIEngine.js';
import { SoundEngine } from './SoundEngine.js';

export class SystemController {
  constructor() {
    this.gameState = new GameState();
    this.uiManager = new UIManager();
    this.hyperJudge = new HyperJudge();
    this.aiEngine = new AIEngine(this);
    this.soundEngine = new SoundEngine();
  }

  initializeGame() {
    this.gameState.reset();
    this.gameState.deck = shuffleArray(cardData);
    this.gameState.playerHand = this.gameState.deck.splice(0, 8);
    this.gameState.aiHand = this.gameState.deck.splice(0, 8);
    this.gameState.fieldCards = this.gameState.deck.splice(0, 8);
    this.gameState.fieldCards.sort((a, b) => getCardValue(b) - getCardValue(a));
    this.gameState.gameInProgress = true;
    this.gameState.isPlayerTurn = true;
    this.updateUI();
    this.uiManager.setMessage('🎯ゲーム開始！手札からカードを選んでください');
  }

  updateUI() {
    this.uiManager.updateUI(this.gameState, this.selectHandCard.bind(this), this.selectFieldCard.bind(this));
  }

  selectHandCard(handIndex) {
    if (!this.gameState.gameInProgress || !this.gameState.isPlayerTurn || this.gameState.decisionPhase || this.gameState.roleModalActive) {
      return;
    }
    if (handIndex < 0 || handIndex >= this.gameState.playerHand.length) {
      return;
    }
    if (this.gameState.selectedHandCard === handIndex) {
      this.gameState.selectedHandCard = null;
      this.gameState.waitingForFieldSelection = false;
      this.gameState.availableFieldCards = [];
      this.uiManager.setMessage('👆手札からカードを選んでください');
    } else {
      this.gameState.selectedHandCard = handIndex;
      const selectedCard = this.gameState.playerHand[handIndex];
      
      const matchingFieldCards = this.gameState.fieldCards
        .map((card, index) => card.name === selectedCard.name ? index : -1)
        .filter(index => index !== -1);
      
      if (matchingFieldCards.length > 1) {
        this.gameState.waitingForFieldSelection = true;
        this.gameState.availableFieldCards = matchingFieldCards;
        this.uiManager.setMessage(`🎯${selectedCard.name}が複数あります。取る札をクリックしてください`);
      } else if (matchingFieldCards.length === 1) {
        this.gameState.waitingForFieldSelection = true;
        this.gameState.availableFieldCards = matchingFieldCards;
        this.uiManager.setMessage(`✨${selectedCard.name}と同じ札があります。クリックして取ってください`);
      } else {
        this.gameState.waitingForFieldSelection = false;
        this.gameState.availableFieldCards = [];
        this.uiManager.setMessage(`🗑️${selectedCard.name}と同じ札がありません。「札をすてる」ボタンを押してください`);
      }
    }
    this.updateUI();
  }

  selectFieldCard(fieldIndex) {
    if (!this.gameState.gameInProgress || !this.gameState.isPlayerTurn || this.gameState.selectedHandCard === null) {
      return;
    }
    const selectedCard = this.gameState.playerHand[this.gameState.selectedHandCard];
    const fieldCard = this.gameState.fieldCards[fieldIndex];
    if (selectedCard.name !== fieldCard.name) {
      return;
    }
    if (this.gameState.waitingForFieldSelection && !this.gameState.availableFieldCards.includes(fieldIndex)) {
      return;
    }
    const takenHandCard = this.gameState.playerHand.splice(this.gameState.selectedHandCard, 1)[0];
    const takenFieldCard = this.gameState.fieldCards.splice(fieldIndex, 1)[0];
    this.gameState.playerPairedCards.push(takenHandCard, takenFieldCard);
    this.gameState.selectedHandCard = null;
    this.gameState.waitingForFieldSelection = false;
    this.gameState.availableFieldCards = [];
    this.uiManager.setMessage(`🎉${takenHandCard.name}のペアを取りました！`);
    this.updateUI();
    setTimeout(() => {
      this.drawFromDeck();
    }, 1000);
  }

  discardCard() {
    if (!this.gameState.gameInProgress || !this.gameState.isPlayerTurn || this.gameState.selectedHandCard === null) {
      return;
    }
    const discardedCard = this.gameState.playerHand.splice(this.gameState.selectedHandCard, 1)[0];
    this.gameState.fieldCards.push(discardedCard);
    this.gameState.fieldCards.sort((a, b) => getCardValue(b) - getCardValue(a));
    this.gameState.selectedHandCard = null;
    this.gameState.waitingForFieldSelection = false;
    this.gameState.availableFieldCards = [];
    this.uiManager.setMessage(`🗑️${discardedCard.name}を場に捨てました`);
    this.updateUI();
    setTimeout(() => {
      this.drawFromDeck();
    }, 1000);
  }

  drawFromDeck() {
    if (this.gameState.deck.length === 0) {
      this.endRound();
      return;
    }
    const drawnCard = this.gameState.deck.shift();
    const matchingFieldIndex = this.gameState.fieldCards.findIndex(card => card.name === drawnCard.name);
    if (matchingFieldIndex !== -1) {
      const matchedCard = this.gameState.fieldCards.splice(matchingFieldIndex, 1)[0];
      
      if (this.gameState.isPlayerTurn) {
        this.gameState.playerPairedCards.push(drawnCard, matchedCard);
        this.uiManager.setMessage(`🎴山札から${drawnCard.name}を引いてペアを取りました！`);
      } else {
        this.gameState.opponentPairedCards.push(drawnCard, matchedCard);
        this.uiManager.setMessage(`🤖相手が山札から${drawnCard.name}を引いてペアを取りました`);
      }
    } else {
      this.gameState.fieldCards.push(drawnCard);
      this.gameState.fieldCards.sort((a, b) => getCardValue(b) - getCardValue(a));
      this.uiManager.setMessage(`🎴山札から${drawnCard.name}を引いて場に置きました`);
    }
    this.updateUI();
    setTimeout(() => {
      this.checkForRoles();
    }, 1000);
  }

  checkForRoles() {
    const currentPlayerCards = this.gameState.isPlayerTurn ? this.gameState.playerPairedCards : this.gameState.opponentPairedCards;
    const roles = this.hyperJudge.calculateRoles(currentPlayerCards);
    
    if (roles.length > 0) {
      const previousRoleNames = this.gameState.previousRoles.map(r => r.name);
      const newRoles = roles.filter(role => !previousRoleNames.includes(role.name));
      
      this.gameState.currentRoles = roles;
      this.gameState.newlyCompletedRoles = newRoles;
      
      if (this.gameState.isPlayerTurn) {
        const priorityRole = newRoles.length > 0 ? newRoles[0] : roles[0];
        const totalPoints = roles.reduce((sum, role) => sum + role.points, 0);
        
        this.uiManager.showRoleCelebration('😯じぶん', priorityRole.name, totalPoints, priorityRole.cards);
        
        const newRoleNames = newRoles.map(r => r.name).join('、');
        const allRoleNames = roles.map(r => r.name).join('、');
        
        if (newRoles.length > 0) {
          this.uiManager.showRoleMessage(`${newRoleNames}完成！💰${totalPoints}ポイント獲得可能`);
        } else {
          this.uiManager.showRoleMessage(`${allRoleNames}継続中！💰${totalPoints}ポイント獲得可能`);
        }
        
        setTimeout(() => {
          this.gameState.decisionPhase = true;
          const roleNames = newRoles.length > 0 ? newRoleNames : allRoleNames;
          this.uiManager.setMessage(`🎯${roleNames}ができました！🎲こいこいか👋勝負を選んでください`);
          this.updateUI();
        }, 1000);
        return;
      } else {
        this.handleOpponentRoles(roles);
        return;
      }
    }
    
    if (this.gameState.playerHand.length === 0 || this.gameState.aiHand.length === 0) {
      this.endRound();
      return;
    }
    this.nextTurn();
  }

  handleOpponentRoles(roles) {
    const points = roles.reduce((sum, role) => sum + role.points, 0);
    const mainRole = roles[0];
    const allCards = roles.flatMap(role => role.cards);
    this.uiManager.showRoleCelebration('🤖あいて', mainRole.name, points, allCards);
    setTimeout(() => {
      if (this.gameState.playerKoikoiDeclared) {
        this.uiManager.setMessage(`😱相手が${roles.map(role => role.name).join('、')}で💰${points}点獲得！🎲こいこい宣言が無効になりました`);
        this.gameState.opponentScore += points;
        this.gameState.playerKoikoiDeclared = false;
        this.gameState.pendingPlayerRoles = [];
        this.gameState.koikoiMultiplier = 1;
      } else {
        this.uiManager.setMessage(`🤖相手が${roles.map(role => role.name).join('、')}で💰${points}点獲得！`);
        this.gameState.opponentScore += points;
      }
      this.updateUI();
      setTimeout(() => {
        this.endRound();
      }, 2000);
    }, 3500);
  }

  koikoiSelected() {
    if (!this.gameState.decisionPhase) return;
    
    this.uiManager.hideRoleMessage();
    const roleNames = this.gameState.newlyCompletedRoles.length > 0 
      ? this.gameState.newlyCompletedRoles.map(role => role.name).join('、')
      : this.gameState.currentRoles.map(role => role.name).join('、');
    
    this.gameState.playerKoikoiDeclared = true;
    this.gameState.pendingPlayerRoles = [...this.gameState.currentRoles];
    this.gameState.previousRoles = [...this.gameState.currentRoles];
    this.gameState.koikoiMultiplier = 2;
    this.gameState.decisionPhase = false;
    this.gameState.currentRoles = [];
    this.gameState.newlyCompletedRoles = [];
    
    this.uiManager.setMessage(`🎲こいこい宣言！${roleNames}でゲーム続行（リスクあり）`);
    this.updateUI();
    
    setTimeout(() => {
      this.nextTurn();
    }, 2000);
  }

  winSelected() {
    if (!this.gameState.decisionPhase) return;
    this.uiManager.hideRoleMessage();
    const basePoints = this.gameState.currentRoles.reduce((sum, role) => sum + role.points, 0);
    const finalPoints = this.gameState.playerKoikoiDeclared ? basePoints * this.gameState.koikoiMultiplier : basePoints;
    this.gameState.playerScore += finalPoints;
    this.gameState.decisionPhase = false;
    const multiplierText = this.gameState.playerKoikoiDeclared ? `（🎲こいこい倍点で💰${finalPoints}点）` : '';
    this.uiManager.setMessage(`👋勝負！💰${basePoints}点獲得${multiplierText}でラウンド終了`);
    this.updateUI();
    setTimeout(() => {
      this.endRound();
    }, 2000);
  }

  endRound() {
    this.gameState.gameInProgress = false;
    const playerFinalScore = this.hyperJudge.calculateFinalScore(this.gameState.playerPairedCards);
    const opponentFinalScore = this.hyperJudge.calculateFinalScore(this.gameState.opponentPairedCards);
    this.gameState.playerScore += playerFinalScore;
    this.gameState.opponentScore += opponentFinalScore;

    if (playerFinalScore > opponentFinalScore) {
      this.gameState.lastWinner = 'player';
    } else if (playerFinalScore < opponentFinalScore) {
      this.gameState.lastWinner = 'opponent';
    } else {
      this.gameState.lastWinner = 'draw';
    }
    this.gameState.roundCount += 1;

    const scoreLead = this.gameState.playerScore - this.gameState.opponentScore;
    if (this.gameState.roundCount <= 1) {
      this.gameState.difficultyKey = 'easy';
    } else if (scoreLead >= 10) {
      this.gameState.difficultyKey = 'hard';
    } else if (scoreLead <= -10) {
      this.gameState.difficultyKey = 'easy';
    } else {
      this.gameState.difficultyKey = 'normal';
    }

    this.updateUI();

    currentSeasonIndex = (currentSeasonIndex + 1) % SEASONS.length;
    applySeason(currentSeasonIndex);

    setTimeout(() => {
      this.uiManager.showGameResultModal(this.gameState);
    }, 1000);
  }

  startNewRound() {
    this.uiManager.elements.gameResultModalBackdrop.style.display = 'none';
    const currentPlayerScore = this.gameState.playerScore;
    const currentOpponentScore = this.gameState.opponentScore;
    this.gameState.resetRound();
    this.gameState.playerScore = currentPlayerScore;
    this.gameState.opponentScore = currentOpponentScore;
    this.gameState.deck = shuffleArray(cardData);
    this.gameState.playerHand = this.gameState.deck.splice(0, 8);
    this.gameState.aiHand = this.gameState.deck.splice(0, 8);
    this.gameState.fieldCards = this.gameState.deck.splice(0, 8);
    this.gameState.fieldCards.sort((a, b) => getCardValue(b) - getCardValue(a));
    this.gameState.isPlayerTurn = !this.gameState.isPlayerTurn;
    if (this.gameState.isPlayerTurn) {
      this.uiManager.setMessage('🔄新しいラウンド開始！😯あなたの番です');
    } else {
      this.uiManager.setMessage('🔄新しいラウンド開始！🤖相手の番です');
      setTimeout(() => {
        this.aiEngine.aiTurn(this.gameState);
      }, 1000);
    }
    this.updateUI();
  }

  resetGame() {
    this.gameState.playerScore = 0;
    this.gameState.opponentScore = 0;
    this.gameState.gameInProgress = false;
    this.gameState.isPlayerTurn = true;
    this.gameState.selectedHandCard = null;
    this.gameState.waitingForFieldSelection = false;
    this.gameState.availableFieldCards = [];
    this.gameState.decisionPhase = false;
    this.gameState.currentRoles = [];
    this.gameState.roleModalActive = false;
    this.gameState.playerKoikoiDeclared = false;
    this.gameState.opponentKoikoiDeclared = false;
    this.gameState.pendingPlayerRoles = [];
    this.gameState.koikoiMultiplier = 1;
    this.gameState.previousRoles = [];
    this.gameState.newlyCompletedRoles = [];
    this.uiManager.hideRoleMessage();
    this.initializeGame();
  }

  nextTurn() {
    if (this.gameState.playerHand.length === 0 || this.gameState.aiHand.length === 0 || this.gameState.deck.length === 0) {
      this.endRound();
      return;
    }
    this.gameState.isPlayerTurn = !this.gameState.isPlayerTurn;
    if (this.gameState.isPlayerTurn) {
      this.uiManager.setMessage('😯あなたの番です。手札からカードを選んでください');
    } else {
      this.uiManager.setMessage('🤖相手の番です');
      setTimeout(() => {
        this.aiEngine.aiTurn(this.gameState);
      }, 1000);
    }
    this.updateUI();
  }

  attachEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      applySeasonByTime();

      if (this.uiManager.elements.koikoiBtn) {
        this.uiManager.elements.koikoiBtn.addEventListener('click', this.koikoiSelected.bind(this));
      }
      if (this.uiManager.elements.winBtn) {
        this.uiManager.elements.winBtn.addEventListener('click', this.winSelected.bind(this));
      }
      if (this.uiManager.elements.discardBtn) {
        this.uiManager.elements.discardBtn.addEventListener('click', this.discardCard.bind(this));
      }
      if (this.uiManager.elements.resetBtn) {
        this.uiManager.elements.resetBtn.addEventListener('click', () => {
          if (confirm('🔄ゲームをリセットしますか？')) {
            this.resetGame();
          }
        });
      }
      if (this.uiManager.elements.seasonToggleBtn) {
        this.uiManager.elements.seasonToggleBtn.addEventListener('click', () => {
          currentSeasonIndex = (currentSeasonIndex + 1) % SEASONS.length;
          applySeason(currentSeasonIndex);
        });
      }
      if (this.uiManager.elements.rolesBtn) {
        this.uiManager.elements.rolesBtn.addEventListener('click', () => this.uiManager.showRolesModal());
      }
      if (this.uiManager.elements.rolesModalCloseBtn) {
        this.uiManager.elements.rolesModalCloseBtn.addEventListener('click', () => this.uiManager.closeRolesModal());
      }
      if (this.uiManager.elements.nextGameBtn) {
        this.uiManager.elements.nextGameBtn.addEventListener('click', this.startNewRound.bind(this));
      }
      if (this.uiManager.elements.endGameBtn) {
        this.uiManager.elements.endGameBtn.addEventListener('click', () => this.uiManager.showGoodbyeModal(this.gameState));
      }
      if (this.uiManager.elements.rolesModalBackdrop) {
        this.uiManager.elements.rolesModalBackdrop.addEventListener('click', (e) => {
          if (e.target === this.uiManager.elements.rolesModalBackdrop) {
            this.uiManager.closeRolesModal();
          }
        });
      }
      this.uiManager.observeScoreChanges('.score-button');
      this.initializeGame();
    });
  }
}

const systemController = new SystemController();
systemController.attachEventListeners();