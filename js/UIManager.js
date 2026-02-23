import { EmojiSupport } from './EmojiSupport.js';
import { sortHand, getCardTypeClass } from './GameUtils.js';

export class UIManager {
  constructor() {
    this.elements = {
      message: document.getElementById('message'),
      messageSection: document.getElementById('message-section'),
      fieldCardsDiv: document.getElementById('field-cards'),
      opponentHandDiv: document.getElementById('opponent-hand'),
      opponentPairedDiv: document.getElementById('opponent-paired'),
      deckDiv: document.querySelector('.deck'),
      koikoiBtn: document.getElementById('koikoi-btn'),
      winBtn: document.getElementById('win-btn'),
      discardBtn: document.getElementById('discard-btn'),
      resetBtn: document.getElementById('reset-btn'),
      rolesBtn: document.getElementById('roles-btn'),
      playerHandDiv: document.getElementById('player-hand'),
      playerPairedDiv: document.getElementById('player-paired'),
      decisionOverlay: document.getElementById('decision-overlay'),
      playerScoreDiv: document.getElementById('player-score'),
      opponentScoreDiv: document.getElementById('opponent-score'),
      playerScoreBtn: document.getElementById('player-score-btn'),
      opponentScoreBtn: document.getElementById('opponent-score-btn'),
      rolesModalBackdrop: document.getElementById('roles-modal-backdrop'),
      rolesModalIframe: document.getElementById('roles-modal-iframe'),
      rolesModalCloseBtn: document.getElementById('roles-modal-close-btn'),
      gameResultModalBackdrop: document.getElementById('game-result-modal-backdrop'),
      gameResultTitle: document.getElementById('game-result-title'),
      gameResultStats: document.getElementById('game-result-stats'),
      finalPlayerScore: document.getElementById('final-player-score'),
      finalOpponentScore: document.getElementById('final-opponent-score'),
      nextGameBtn: document.getElementById('next-game-btn'),
      endGameBtn: document.getElementById('end-game-btn'),
      goodbyeModalBackdrop: document.getElementById('goodbye-modal-backdrop'),
      goodbyePlayerScore: document.getElementById('goodbye-player-score'),
      goodbyeOpponentScore: document.getElementById('goodbye-opponent-score'),
      seasonToggleBtn: document.getElementById('season-toggle-btn')
    };
  }

  setMessage(msg) {
    if (this.elements.message) {
      this.elements.message.textContent = msg;
    }
    this.updateMessageStyle();
  }

  updateMessageStyle(isPlayerTurn, gameInProgress, roleModalActive, decisionPhase) {
    if (!this.elements.messageSection) return;
    if (isPlayerTurn && gameInProgress && !roleModalActive && !decisionPhase) {
      this.elements.messageSection.classList.add('player-turn');
    } else {
      this.elements.messageSection.classList.remove('player-turn');
    }
  }

  updateUI(gameState, selectHandCardCallback, selectFieldCardCallback) {
    this.updatePlayerHand(gameState, selectHandCardCallback);
    this.updatePlayerPaired(gameState);
    this.updateOpponentHand(gameState);
    this.updateOpponentPaired(gameState);
    this.updateFieldCards(gameState, selectFieldCardCallback);
    this.updateDeck(gameState);
    this.updateScores(gameState);
    this.updateButtons(gameState);
    this.updateHighlights(gameState);
    this.updateMessageStyle(gameState.isPlayerTurn, gameState.gameInProgress, gameState.roleModalActive, gameState.decisionPhase);
  }

  updatePlayerHand(gameState, selectHandCardCallback) {
    if (!this.elements.playerHandDiv) return;
    this.elements.playerHandDiv.innerHTML = '';
    const sortedHand = sortHand(gameState.playerHand);
    sortedHand.forEach((card, index) => {
      const originalIndex = gameState.playerHand.findIndex(c => c.id === card.id);
      const div = this.createCardElement(card, 'hand-card');
      
      if (gameState.isPlayerTurn && 
          gameState.gameInProgress && 
          !gameState.decisionPhase && 
          !gameState.roleModalActive) {
        div.style.cursor = 'pointer';
        div.onclick = () => selectHandCardCallback(originalIndex);
        
        const hasMatch = gameState.fieldCards.some(f => f.name === card.name);
        if (hasMatch) {
          div.classList.add('has-match');
        }
      } else {
        div.style.cursor = 'default';
        div.onclick = null;
      }
      
      this.elements.playerHandDiv.appendChild(div);
    });
  }

  updatePlayerPaired(gameState) {
    if (!this.elements.playerPairedDiv) return;
    this.elements.playerPairedDiv.innerHTML = '';
    const sortedPaired = sortHand(gameState.playerPairedCards);
    sortedPaired.forEach(card => {
      const div = this.createCardElement(card, 'hand-card');
      div.style.cursor = 'default';
      this.elements.playerPairedDiv.appendChild(div);
    });
  }

  updateOpponentHand(gameState) {
    if (!this.elements.opponentHandDiv) return;
    this.elements.opponentHandDiv.innerHTML = '';
    for (let i = 0; i < gameState.aiHand.length; i++) {
      const div = document.createElement('div');
      div.className = 'opponent-card';
      this.elements.opponentHandDiv.appendChild(div);
    }
  }

  updateOpponentPaired(gameState) {
    if (!this.elements.opponentPairedDiv) return;
    this.elements.opponentPairedDiv.innerHTML = '';
    const sortedPaired = sortHand(gameState.opponentPairedCards);
    sortedPaired.forEach(card => {
      const div = this.createCardElement(card, 'opponent-paired-card');
      this.elements.opponentPairedDiv.appendChild(div);
    });
  }

  updateFieldCards(gameState, selectFieldCardCallback) {
    if (!this.elements.fieldCardsDiv) return;
    this.elements.fieldCardsDiv.innerHTML = '';
    gameState.fieldCards.forEach((card, index) => {
      const div = this.createCardElement(card, 'field-card');
      
      if (gameState.isPlayerTurn && gameState.gameInProgress && !gameState.decisionPhase && !gameState.roleModalActive) {
        div.style.cursor = 'pointer';
        div.onclick = () => selectFieldCardCallback(index);
        
        if (gameState.waitingForFieldSelection && gameState.availableFieldCards.includes(index)) {
          div.classList.add('selectable');
        }
      } else {
        div.style.cursor = 'default';
        div.onclick = null;
      }
      
      this.elements.fieldCardsDiv.appendChild(div);
    });
  }

  updateDeck(gameState) {
    if (this.elements.deckDiv) {
      this.elements.deckDiv.textContent = gameState.deck.length.toString();
    }
  }

  updateScores(gameState) {
    if (this.elements.playerScoreDiv) {
      this.elements.playerScoreDiv.textContent = `💰${gameState.playerScore}Pt`;
      if (gameState.playerScore >= 10) {
        this.elements.playerScoreBtn?.classList.add('high-score');
      } else {
        this.elements.playerScoreBtn?.classList.remove('high-score');
      }
    }
    if (this.elements.opponentScoreDiv) {
      this.elements.opponentScoreDiv.textContent = `💰${gameState.opponentScore}Pt`;
      if (gameState.opponentScore >= 10) {
        this.elements.opponentScoreBtn?.classList.add('high-score');
      } else {
        this.elements.opponentScoreBtn?.classList.remove('high-score');
      }
    }
  }

  updateButtons(gameState) {
    if (gameState.decisionPhase && gameState.isPlayerTurn) {
      if (this.elements.koikoiBtn) {
        this.elements.koikoiBtn.disabled = false;
        this.elements.koikoiBtn.classList.add('koikoi-blink');
      }
      if (this.elements.winBtn) {
        this.elements.winBtn.disabled = false;
        this.elements.winBtn.classList.add('win-blink');
      }
      if (this.elements.decisionOverlay) {
        this.elements.decisionOverlay.classList.add('active');
      }
    } else {
      if (this.elements.koikoiBtn) {
        this.elements.koikoiBtn.disabled = true;
        this.elements.koikoiBtn.classList.remove('koikoi-blink');
      }
      if (this.elements.winBtn) {
        this.elements.winBtn.disabled = true;
        this.elements.winBtn.classList.remove('win-blink');
      }
      if (this.elements.decisionOverlay) {
        this.elements.decisionOverlay.classList.remove('active');
      }
    }
  }

  createCardElement(card, className) {
    const div = document.createElement('div');
    div.className = `${className} ${getCardTypeClass(card)}`;
    if (card.iconClass) div.classList.add(card.iconClass);
    div.title = `${card.name}（${card.type}）`;
    return div;
  }

  updateHighlights(gameState) {
    document.querySelectorAll('.can-take, .can-discard, .hover-highlight').forEach(el => {
      el.classList.remove('can-take', 'can-discard', 'hover-highlight');
    });
    if (this.elements.discardBtn) {
      this.elements.discardBtn.style.display = 'none';
    }
    if (gameState.selectedHandCard !== null) {
      const selectedCard = gameState.playerHand[gameState.selectedHandCard];
      if (selectedCard) {
        const matchingFieldCards = gameState.fieldCards
          .map((card, index) => card.name === selectedCard.name ? index : -1)
          .filter(index => index !== -1);
        
        if (matchingFieldCards.length > 0) {
          const sortedHand = sortHand(gameState.playerHand);
          const sortedIndex = sortedHand.findIndex(c => c.id === selectedCard.id);
          if (sortedIndex !== -1 && this.elements.playerHandDiv.children[sortedIndex]) {
            this.elements.playerHandDiv.children[sortedIndex].classList.add('can-take');
          }
          
          matchingFieldCards.forEach(fieldIndex => {
            if (this.elements.fieldCardsDiv.children[fieldIndex]) {
              this.elements.fieldCardsDiv.children[fieldIndex].classList.add('can-take');
            }
          });
        } else {
          const sortedHand = sortHand(gameState.playerHand);
          const sortedIndex = sortedHand.findIndex(c => c.id === selectedCard.id);
          if (sortedIndex !== -1 && this.elements.playerHandDiv.children[sortedIndex]) {
            this.elements.playerHandDiv.children[sortedIndex].classList.add('can-discard');
          }
          
          if (this.elements.discardBtn) {
            this.elements.discardBtn.style.display = 'block';
            this.elements.discardBtn.style.position = 'absolute';
            this.elements.discardBtn.style.bottom = '12px';
            this.elements.discardBtn.style.left = '50%';
            this.elements.discardBtn.style.transform = 'translateX(-50%)';
            this.elements.discardBtn.style.zIndex = '200';
          }
        }
      }
    }
  }

  showGameResultModal(gameState) {
    if (this.elements.gameResultModalBackdrop) {
      const playerWon = gameState.playerScore > gameState.opponentScore;
      const isDrawn = gameState.playerScore === gameState.opponentScore;
      
      if (this.elements.gameResultTitle) {
        if (playerWon) {
          this.elements.gameResultTitle.textContent = '🎉あなたの勝利！';
        } else if (isDrawn) {
          this.elements.gameResultTitle.textContent = '🤝引き分け！';
        } else {
          this.elements.gameResultTitle.textContent = '😱負けちゃった・・・';
        }
      }
      
      if (this.elements.gameResultStats) {
        const statsText = `😯あなた: 💰${gameState.playerScore}点 vs 🤖相手: 💰${gameState.opponentScore}点`;
        
        if (!playerWon && !isDrawn) {
          this.elements.gameResultStats.innerHTML = `\n            ${statsText}<br>\n            <div style="margin-top: 12px; font-size: 0.9rem; color: #e74c3c;">\n              💪続けるときはリセットしてね！\n            </div>\n          `;
        } else {
          this.elements.gameResultStats.innerHTML = statsText;
        }
      }
      
      if (this.elements.finalPlayerScore) {
        this.elements.finalPlayerScore.textContent = `💰${gameState.playerScore}`;
      }
      
      if (this.elements.finalOpponentScore) {
        this.elements.finalOpponentScore.textContent = `💰${gameState.opponentScore}`;
      }
      
      this.elements.gameResultModalBackdrop.style.display = 'flex';
    }
  }

  showGoodbyeModal(gameState) {
    if (this.elements.gameResultModalBackdrop) {
      this.elements.gameResultModalBackdrop.style.display = 'none';
    }
    if (this.elements.goodbyeModalBackdrop) {
      if (this.elements.goodbyePlayerScore) {
        this.elements.goodbyePlayerScore.textContent = `💰${gameState.playerScore}`;
      }
      
      if (this.elements.goodbyeOpponentScore) {
        this.elements.goodbyeOpponentScore.textContent = `💰${gameState.opponentScore}`;
      }
      
      const goodbyeMessageEl = document.getElementById('goodbye-message');
      if (goodbyeMessageEl) {
        if (gameState.playerScore > gameState.opponentScore) {
          goodbyeMessageEl.textContent = '🎉お疲れさまでした！';
        } else if (gameState.playerScore === gameState.opponentScore) {
          goodbyeMessageEl.textContent = '👏いい勝負でした！';
        } else {
          goodbyeMessageEl.innerHTML = '😱また挑戦してね！<br><small style="font-size: 1rem;">💪🔄リセットで再戦可能です</small>';
        }
      }
      
      this.elements.goodbyeModalBackdrop.style.display = 'flex';
      
      setTimeout(() => {
        this.elements.goodbyeModalBackdrop.style.display = 'none';
      }, 4000);
    }
  }

  showRolesModal() {
    if (this.elements.rolesModalBackdrop && this.elements.rolesModalIframe) {
      this.elements.rolesModalIframe.src = 'card.html';
      this.elements.rolesModalBackdrop.style.display = 'flex';
    }
  }

  closeRolesModal() {
    if (this.elements.rolesModalBackdrop && this.elements.rolesModalIframe) {
      this.elements.rolesModalBackdrop.style.display = 'none';
      this.elements.rolesModalIframe.src = '';
    }
  }

  showRoleCelebration(owner, roleName, points, cards) {
    const notification = document.getElementById('role-completion-notification');
    const ownerEl = document.getElementById('celebration-owner');
    const roleNameEl = document.getElementById('celebration-role-name');
    const pointsEl = document.getElementById('celebration-points');
    const cardsEl = document.getElementById('celebration-cards');
    
    ownerEl.textContent = `${owner}　やったね！🎉`;
    roleNameEl.textContent = roleName;
    pointsEl.textContent = `💰${points}ポイント獲得！✨`;
    
    cardsEl.innerHTML = '';
    cards.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = `celebration-card ${getCardTypeClass(card)} role-${roleName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;
      cardEl.style.animationDelay = `${index * 0.1}s`;
      cardEl.textContent = card.emoji;
      
      
      if (card.iconClass) {
        cardEl.classList.add(card.iconClass);
      }
      
      cardsEl.appendChild(cardEl);
    });
    
    this.createCelebrationParticles();
    notification.style.display = 'block';
    setTimeout(() => {
      this.hideCelebration();
    }, 3000);
  }

  createCelebrationParticles() {
    const particles = ['🎊', '✨', '🎉', '💎', '⭐', '🌟', '💫', '🎈'];
    const container = document.querySelector('.container');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'celebration-particle';
      particle.textContent = particles[Math.floor(Math.random() * particles.length)];
      
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 1}s`;
      
      container.appendChild(particle);
      
      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      }, 2000);
    }
  }

  hideCelebration() {
    const notification = document.getElementById('role-completion-notification');
    if (notification) {
      notification.style.display = 'none';
    }
  }

  showRoleMessage(message) {
    const messageEl = document.getElementById('role-completion-message');
    if (messageEl) {
      messageEl.textContent = `🎊${message}`;
      messageEl.style.display = 'block';
    }
  }

  hideRoleMessage() {
    const messageEl = document.getElementById('role-completion-message');
    if (messageEl) {
      messageEl.style.display = 'none';
    }
  }

  animateScoreIncrease(scoreElement) {
    scoreElement.classList.add('score-increased');
    setTimeout(() => {
      scoreElement.classList.remove('score-increased');
    }, 600);
  }

  observeScoreChanges(selector) {
    const targets = document.querySelectorAll(selector);
    targets.forEach(target => {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'characterData' || mutation.type === 'childList') {
            const newValue = target.textContent.match(/\d+/);
            const oldValue = target.getAttribute('data-previous-score') || '0';
            
            if (newValue && parseInt(newValue[0]) > parseInt(oldValue)) {
              this.animateScoreIncrease(target);
            }
            
            target.setAttribute('data-previous-score', newValue ? newValue[0] : '0');
          }
        });
      });
      observer.observe(target, { 
        characterData: true, 
        childList: true, 
        subtree: true 
      });
    });
  }
}
