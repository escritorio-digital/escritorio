// js/widgets/tournament-generator.js

/**
 * Widget de Generador de Torneos
 * Crea un cuadro de torneo visual con participantes aleatorios y modo enfoque.
 */
export const tournamentGenerator = {
    html: `
        <div class="flex flex-col h-full">
            <div class="flex items-center gap-2 mb-2">
                <h3 class="text-lg font-semibold flex-grow">Participantes</h3>
                <button class="tg-focus-btn" title="Ver en grande">⤢</button>
            </div>
            <textarea class="tg-names w-full p-2 mb-2" rows="5" placeholder="Un participante por línea"></textarea>
            <button class="tg-generate w-full btn-primary mb-2">Generar Torneo</button>
            <div class="tg-bracket-container overflow-auto flex-grow">
                <div class="tg-bracket"></div>
            </div>
        </div>`,
    initializer: (widget) => {
        const namesArea = widget.querySelector('.tg-names');
        const generateBtn = widget.querySelector('.tg-generate');
        const bracketContainer = widget.querySelector('.tg-bracket-container');
        const focusBtn = widget.querySelector('.tg-focus-btn');
        const bracketDiv = bracketContainer.querySelector('.tg-bracket');

        // --- Lógica para el botón de "Modo Enfoque" ---
        focusBtn.addEventListener('click', () => {
            if (document.querySelector('.tg-overlay')) return;
            const overlay = document.createElement('div');
            overlay.className = 'tg-overlay';
            const bracketClone = bracketContainer.cloneNode(true);
            overlay.appendChild(bracketClone);
            document.body.appendChild(overlay);

            // Re-asigna eventos al clon para que sea interactivo
            const winHandlerClone = (el) => handleWin(el, bracketClone);
            bracketClone.querySelectorAll('.participant:not(.bye)').forEach(p => {
                p.addEventListener('click', () => winHandlerClone(p));
            });
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                }
            });
        });

        // --- Lógica principal del Torneo ---
        
        const generateBracket = () => {
            let participants = namesArea.value.split('\n').filter(p => p.trim() !== '');
            if (participants.length < 2) {
                bracketDiv.innerHTML = `<p class="p-4 text-center">Se necesitan al menos 2 participantes.</p>`;
                return;
            }
            
            // --- ¡AQUÍ ESTÁ LA MAGIA! ---
            // Mezcla aleatoriamente la lista de participantes (Algoritmo Fisher-Yates)
            for (let i = participants.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [participants[i], participants[j]] = [participants[j], participants[i]];
            }
            
            // Llama a la función que dibuja el diagrama con la lista ya mezclada
            renderBracket(bracketDiv, participants);
        };
        
        const renderBracket = (container, participants) => {
            container.innerHTML = '';
            const numParticipants = participants.length;
            const rounds = Math.ceil(Math.log2(numParticipants));
            const bracketSize = Math.pow(2, rounds);
            const byes = bracketSize - numParticipants;
            let currentRoundParticipants = [...participants];
            
            if (byes > 0) {
                for(let i = 0; i < byes; i++) {
                    currentRoundParticipants.splice(i*2 + 1, 0, 'BYE');
                }
            }
            
            let roundDiv = document.createElement('div');
            roundDiv.className = 'round';
            for (let i = 0; i < currentRoundParticipants.length; i += 2) {
                roundDiv.appendChild(createMatch(currentRoundParticipants[i], currentRoundParticipants[i+1]));
            }
            container.appendChild(roundDiv);

            for (let r = 1; r < rounds; r++) {
                roundDiv = document.createElement('div');
                roundDiv.className = 'round';
                const numMatches = Math.pow(2, rounds - (r + 1));
                for (let i = 0; i < numMatches; i++) {
                    roundDiv.appendChild(createMatch('...', '...'));
                }
                container.appendChild(roundDiv);
            }
            
            container.querySelectorAll('.participant.bye').forEach(byeEl => {
                 const match = byeEl.closest('.match');
                 const winner = match.querySelector('.participant:not(.bye)');
                 if (winner) advanceWinner(winner, match);
            });
        };

        const createMatch = (p1, p2) => {
            const matchDiv = document.createElement('div');
            matchDiv.className = 'match';
            matchDiv.innerHTML = `<div class="participant ${p1 === 'BYE' ? 'bye' : ''}">${p1}</div><div class="participant ${p2 === 'BYE' ? 'bye' : ''}">${p2}</div>`;
            matchDiv.querySelectorAll('.participant:not(.bye)').forEach(p => p.addEventListener('click', () => handleWin(p)));
            return matchDiv;
        };
        
        const handleWin = (winnerEl) => {
             const match = winnerEl.closest('.match');
             if (match.classList.contains('decided') || !winnerEl.textContent || winnerEl.textContent === '...') return;
             
             match.classList.add('decided');
             winnerEl.classList.add('winner');
             const loserEl = match.querySelector('.participant:not(.winner)');
             if(loserEl) loserEl.classList.add('loser');
             
             advanceWinner(winnerEl, match);
        };

        const advanceWinner = (winnerEl, match) => {
            const round = match.closest('.round');
            const nextRound = round.nextElementSibling;
            if (!nextRound) return;
            
            const allMatchesInRound = Array.from(round.querySelectorAll('.match'));
            const matchIndex = allMatchesInRound.indexOf(match);
            const nextMatchIndex = Math.floor(matchIndex / 2);
            const nextSlotIndex = matchIndex % 2;
            const nextMatch = nextRound.querySelectorAll('.match')[nextMatchIndex];
            
            if(nextMatch) {
                const nextSlot = nextMatch.querySelectorAll('.participant')[nextSlotIndex];
                nextSlot.textContent = winnerEl.textContent;
            }
        };

        generateBtn.addEventListener('click', generateBracket);
    }
};