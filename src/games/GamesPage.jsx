import { startTransition, useMemo, useState } from 'react';
import { DEFAULT_GAME_ID, GAME_CATALOG } from './gameCatalog';
import { useArcadeGame } from './useArcadeGame';
import { usePartyMode } from './usePartyMode';

const queuePresetCounts = [6, 8, 12];

export const GamesPage = () => {
  const [selectedGameId, setSelectedGameId] = useState(DEFAULT_GAME_ID);
  const [experienceMode, setExperienceMode] = useState('classic');
  const { canvasRef, meta } = useArcadeGame(selectedGameId);
  const selectedGame = useMemo(
    () => GAME_CATALOG.find(game => game.id === selectedGameId) || GAME_CATALOG[0],
    [selectedGameId]
  );
  const party = usePartyMode(selectedGame.party.stations);

  return (
    <div className="games-page">
      <section className="content-section games-section">
        <div className="section-intro">
          <p className="eyebrow">Experience Builder</p>
          <h2>Choose the game, then choose how you want to run it.</h2>
          <p>Switch between direct play and host-ready party orchestration without leaving the page or reloading the game canvas.</p>
        </div>

        <div className="games-picker-grid">
          {GAME_CATALOG.map(game => (
            <button
              key={game.id}
              type="button"
              className={game.id === selectedGameId ? 'game-mode-card is-active' : 'game-mode-card'}
              onClick={() => startTransition(() => setSelectedGameId(game.id))}
            >
              <span className="game-mode-chip">{game.players}</span>
              <h3>{game.title}</h3>
              <p>{game.summary}</p>
              <div className="game-mode-meta">
                <span>{game.intensity}</span>
                <span>{game.objective}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="games-mode-switcher" role="tablist" aria-label="Game experience mode">
          <button
            type="button"
            className={experienceMode === 'classic' ? 'games-mode-pill is-active' : 'games-mode-pill'}
            onClick={() => setExperienceMode('classic')}
          >
            Classic Play
            <span>Jump straight into the game with the default control sheet.</span>
          </button>
          <button
            type="button"
            className={experienceMode === 'party' ? 'games-mode-pill is-active' : 'games-mode-pill'}
            onClick={() => setExperienceMode('party')}
          >
            Party Mode
            <span>Run a live queue, rotate players, and track winners from one host surface.</span>
          </button>
        </div>
      </section>

      <section className="content-section games-section">
        <div className="games-stage-shell">
          <div className="games-stage-copy">
            {experienceMode === 'classic' ? (
              <>
                <p className="eyebrow">Now Playing</p>
                <h2>{selectedGame.title}</h2>
                <p>{selectedGame.tagline}</p>
                <div className="games-control-panel">
                  <div className="games-control-card">
                    <span>Objective</span>
                    <strong>{selectedGame.objective}</strong>
                  </div>
                  <div className="games-control-card">
                    <span>Intensity</span>
                    <strong>{selectedGame.intensity}</strong>
                  </div>
                </div>
                <div className="games-instructions">
                  <h3>Controls</h3>
                  <ul>
                    {meta.controls.map(line => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <p className="eyebrow">Party Host Panel</p>
                <h2>{selectedGame.title} Party Mode</h2>
                <p>{selectedGame.party.quickTip}</p>

                <div className="party-panel-grid">
                  <div className="party-card">
                    <span className="party-label">Quick setup</span>
                    <div className="party-chip-row">
                      {queuePresetCounts.map(count => (
                        <button
                          key={count}
                          type="button"
                          className="party-chip-button"
                          onClick={() => party.setPlayerCount(count)}
                        >
                          {count} players
                        </button>
                      ))}
                    </div>
                    <div className="party-action-row">
                      <button type="button" className="button dark" onClick={party.shuffleQueue}>Shuffle Queue</button>
                      <button type="button" className="button dark" onClick={party.resetSession}>Reset Session</button>
                    </div>
                  </div>

                  <div className="party-card">
                    <span className="party-label">Rotation format</span>
                    <div className="party-format-stack">
                      {party.formats.map(format => (
                        <button
                          key={format.id}
                          type="button"
                          className={party.format === format.id ? 'party-format-button is-active' : 'party-format-button'}
                          onClick={() => party.setFormat(format.id)}
                        >
                          <strong>{format.label}</strong>
                          <span>{format.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="party-station-grid">
                  {party.activePlayers.map(player => (
                    <article key={player.id} className="party-station-card">
                      <span>{player.station}</span>
                      <strong>{player.name}</strong>
                      <small>{player.wins} wins • {player.plays} heats</small>
                      <button type="button" className="button primary" onClick={() => party.reportWinner(player.id)}>
                        Record Win
                      </button>
                    </article>
                  ))}
                </div>

                <div className="party-action-row">
                  <button type="button" className="button dark" onClick={party.rotateHeat}>Rotate Heat</button>
                </div>

                <div className="party-surface-grid">
                  <div className="party-card">
                    <span className="party-label">Queue</span>
                    <ul className="party-queue-list">
                      {party.queuedPlayers.map(player => (
                        <li key={player.id}>
                          <span>{player.name}</span>
                          <small>{player.wins}W / {player.plays}P</small>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="party-card">
                    <span className="party-label">Leaderboard</span>
                    <ol className="party-standings-list">
                      {party.standings.map(player => (
                        <li key={player.id}>
                          <span>{player.name}</span>
                          <strong>{player.wins}</strong>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="party-card">
                  <span className="party-label">Editable roster</span>
                  <div className="party-roster-grid">
                    {party.players.map(player => (
                      <label key={player.id} className="party-roster-field">
                        <span>{player.id.replace('player-', 'Player ')}</span>
                        <input
                          type="text"
                          value={player.name}
                          onChange={event => party.renamePlayer(player.id, event.target.value)}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="games-instructions party-history">
                  <h3>Recent results</h3>
                  <ul>
                    {party.history.length > 0 ? party.history.map(item => (
                      <li key={item.id}>{item.winnerName} won a {item.format.replace('-', ' ')} heat.</li>
                    )) : <li>Start the first heat and results will appear here.</li>}
                  </ul>
                </div>
              </>
            )}
          </div>

          <div className="games-canvas-card">
            <canvas
              ref={canvasRef}
              className="games-canvas"
              width="960"
              height="600"
              aria-label={`${selectedGame.title} playable area`}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
