// js/widgets/tournament-generator.js

/**
 * Widget de Generador de Torneos
 * Crea un cuadro de torneo de eliminación simple a partir de una lista de participantes.
 */
export const tournamentGenerator = {
    html: `
        <div class="flex flex-col h-full">
            <h3 class="text-lg font-semibold">Participantes</h3>
            <textarea class="tg-names w-full p-2 mb-2" rows="5" placeholder="Un participante por línea"></textarea>
            <button class="tg-generate w-full btn-primary">Generar Torneo</button>
            <div class="tg-bracket mt-2 overflow-auto flex-grow"></div>
        </div>`,
    initializer: (widget) => {
        const namesArea = widget.querySelector('.tg-names');
        const generateBtn = widget.querySelector('.tg-generate');
        const bracketDiv = widget.querySelector('.tg-bracket');

        generateBtn.addEventListener('click', () => {
            const participants = namesArea.value.split('\n').filter(p => p.trim() !== '');
            if (participants.length < 2) {
                bracketDiv.innerHTML = `<p style="color:var(--color-text-dark)">Se necesitan al menos 2 participantes.</p>`;
                return;
            }
            // Shuffle participants
            for (let i = participants.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [participants[i], participants[j]] = [participants[j], participants[i]];
            }
            createBracket(participants);
        });

        function createBracket(participants) {
            let currentParticipants = [...participants];
            const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(currentParticipants.length)));
            const byes = nextPowerOfTwo - currentParticipants.length;
            
            // Distribute BYEs
            for (let i = 0; i < byes; i++) {
                currentParticipants.splice(i * 2 + 1, 0, 'BYE');
            }

            let roundsData = [];
            let roundParticipants = [...currentParticipants];
            while (roundParticipants.length > 1) {
                let matches = [];
                for (let i = 0; i < roundParticipants.length; i += 2) {
                    matches.push({ p1: roundParticipants[i], p2: roundParticipants[i + 1] });
                }
                roundsData.push(matches);
                roundParticipants = new Array(matches.length).fill(null);
            }
            renderBracket(roundsData);
        }

        function renderBracket(roundsData) {
            bracketDiv.innerHTML = '';
            roundsData.forEach((round, roundIndex) => {
                const roundDiv = document.createElement('div');
                roundDiv.className = 'round';
                roundDiv.dataset.round = roundIndex;
                round.forEach((match, matchIndex) => {
                    const matchDiv = document.createElement('div');
                    matchDiv.className = 'match';
                    matchDiv.dataset.match = matchIndex;
                    matchDiv.appendChild(createParticipantDiv(match.p1, roundIndex, matchIndex, 0));
                    matchDiv.appendChild(createParticipantDiv(match.p2, roundIndex, matchIndex, 1));
                    roundDiv.appendChild(matchDiv);
                });
                bracketDiv.appendChild(roundDiv);
            });
            widget.querySelectorAll('.participant.bye').forEach(byeEl => {
                const otherParticipant = byeEl.closest('.match').querySelector('.participant:not(.bye)');
                if (otherParticipant) handleWin(otherParticipant);
            });
        }

        function createParticipantDiv(name, round, match, pIndex) {
            const pDiv = document.createElement('div');
            pDiv.textContent = name || '...';
            pDiv.dataset.round = round;
            pDiv.dataset.match = match;
            pDiv.dataset.pIndex = pIndex;
            if (!name) {
                pDiv.className = 'participant placeholder';
            } else if (name === 'BYE') {
                pDiv.className = 'participant bye';
            } else {
                pDiv.className = 'participant';
                pDiv.addEventListener('click', (e) => handleWin(e.target));
            }
            return pDiv;
        }

        function handleWin(winnerEl) {
            const parentMatch = winnerEl.closest('.match');
            if (!parentMatch || parentMatch.querySelector('.winner')) return;
            
            // Mark winner and loser
            winnerEl.classList.add('winner');
            const loserEl = parentMatch.querySelector(`.participant:not([data-p-index='${winnerEl.dataset.pIndex}'])`);
            if(loserEl) loserEl.classList.add('loser'); // Optional styling for loser

            const { round, match } = winnerEl.dataset;
            const nextRoundDiv = bracketDiv.querySelector(`.round[data-round='${parseInt(round, 10) + 1}']`);
            if (nextRoundDiv) {
                const nextMatchIndex = Math.floor(parseInt(match, 10) / 2);
                const nextPIndex = parseInt(match, 10) % 2;
                const nextParticipantDiv = nextRoundDiv.querySelector(`.match[data-match='${nextMatchIndex}'] .participant[data-p-index='${nextPIndex}']`);
                if (nextParticipantDiv) {
                    nextParticipantDiv.textContent = winnerEl.textContent;
                    nextParticipantDiv.className = 'participant';
                    nextParticipantDiv.addEventListener('click', (e) => handleWin(e.target));
                }
            }
        }
    }
};
