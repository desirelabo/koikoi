export class GameState {
  constructor() {
    this.deck = [];
    this.playerHand = [];
    this.aiHand = [];
    this.fieldCards = [];
    this.playerPairedCards = [];
    this.opponentPairedCards = [];
    this.playerScore = 0;
    this.opponentScore = 0;
    this.isPlayerTurn = true;
    this.gameInProgress = false;

    this.selectedHandCard = null;
    this.waitingForFieldSelection = false;
    this.availableFieldCards = [];
    this.decisionPhase = false;
    this.currentRoles = [];
    this.roleModalActive = false;
    this.playerKoikoiDeclared = false;
    this.opponentKoikoiDeclared = false;
    this.pendingPlayerRoles = [];
    this.koikoiMultiplier = 1;
    this.previousRoles = [];
    this.newlyCompletedRoles = [];

    this.roundCount = 0;
    this.currentRoundIndex = 1;
    this.difficultyKey = 'normal';
    this.lastWinner = null;
  }

  reset() {
    this.deck = [];
    this.playerHand = [];
    this.aiHand = [];
    this.fieldCards = [];
    this.playerPairedCards = [];
    this.opponentPairedCards = [];
    this.selectedHandCard = null;
    this.waitingForFieldSelection = false;
    this.availableFieldCards = [];
    this.decisionPhase = false;
    this.currentRoles = [];
    this.roleModalActive = false;
    this.gameInProgress = true;
    this.playerKoikoiDeclared = false;
    this.opponentKoikoiDeclared = false;
    this.pendingPlayerRoles = [];
    this.koikoiMultiplier = 1;
    this.previousRoles = [];
    this.newlyCompletedRoles = [];
    this.currentRoundIndex = this.roundCount + 1;
    this.lastWinner = null;
  }

  resetRound() {
    const currentPlayerScore = this.playerScore;
    const currentOpponentScore = this.opponentScore;
    this.reset();
    this.playerScore = currentPlayerScore;
    this.opponentScore = currentOpponentScore;
  }
}
