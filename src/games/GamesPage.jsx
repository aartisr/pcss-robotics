import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_GAME_ID, GAME_CATALOG } from './gameCatalog';
import { useArcadeGame } from './useArcadeGame';
import { usePartyMode } from './usePartyMode';
import { useContent } from '../data/ContentContext';

const queuePresetCounts = [6, 8, 12];

const MOBILE_STATIONS = [
  {
    id: 'p1',
    title: 'Station One',
    keys: [
      { id: 'up', label: 'Up', key: 'w', className: 'is-up' },
      { id: 'left', label: 'Left', key: 'a', className: 'is-left' },
      { id: 'action', label: 'Action', key: 'f', className: 'is-action' },
      { id: 'right', label: 'Right', key: 'd', className: 'is-right' },
      { id: 'down', label: 'Down', key: 's', className: 'is-down' }
    ]
  },
  {
    id: 'p2',
    title: 'Station Two',
    keys: [
      { id: 'up', label: 'Up', key: 'arrowup', className: 'is-up' },
      { id: 'left', label: 'Left', key: 'arrowleft', className: 'is-left' },
      { id: 'action', label: 'Action', key: 'enter', className: 'is-action' },
      { id: 'right', label: 'Right', key: 'arrowright', className: 'is-right' },
      { id: 'down', label: 'Down', key: 'arrowdown', className: 'is-down' }
    ]
  }
];

const preventTouchScroll = event => {
  event.preventDefault();
};

export const GamesPage = () => {
  const { content } = useContent();
  const [selectedGameId, setSelectedGameId] = useState(DEFAULT_GAME_ID);
  const [experienceMode, setExperienceMode] = useState('classic');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef(null);
  const { canvasRef, meta, setVirtualKey } = useArcadeGame(selectedGameId);
  const selectedGame = useMemo(
    () => GAME_CATALOG.find(game => game.id === selectedGameId) || GAME_CATALOG[0],
    [selectedGameId]
  );
  const copy = content?.games || {};
  const party = usePartyMode(selectedGame.party.stations);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === stageRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!stageRef.current) {
      return;
    }

    if (document.fullscreenElement === stageRef.current) {
      await document.exitFullscreen();
      return;
    }

    await stageRef.current.requestFullscreen();
  };

  const bindTouchControl = key => ({
    onPointerDown: event => {
      event.preventDefault();
      setVirtualKey(key, true);
    },
    onPointerUp: () => setVirtualKey(key, false),
    onPointerLeave: () => setVirtualKey(key, false),
    onPointerCancel: () => setVirtualKey(key, false),
    onTouchStart: preventTouchScroll,
    onTouchMove: preventTouchScroll
  });

  return (
    <div className="games-page">
      <section className="content-section games-section">
        <div className="section-intro">
          <p className="eyebrow">{copy.eyebrow || 'Experience Builder'}</p>
          <h2>{copy.title || 'Choose the game, then choose how you want to run it.'}</h2>
          <p>{copy.intro || 'Switch between direct play and host-ready party orchestration without leaving the page or reloading the game canvas.'}</p>
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
            {copy.classicLabel || 'Classic Play'}
            <span>{copy.classicDescription || 'Jump straight into the game with the default control sheet.'}</span>
          </button>
          <button
            type="button"
            className={experienceMode === 'party' ? 'games-mode-pill is-active' : 'games-mode-pill'}
            onClick={() => setExperienceMode('party')}
          >
            {copy.partyLabel || 'Party Mode'}
            <span>{copy.partyDescription || 'Run a live queue, rotate players, and track winners from one host surface.'}</span>
          </button>
        </div>
      </section>

      <section className="content-section games-section">
        <div className="games-stage-shell">
          <div className="games-stage-copy">
            {experienceMode === 'classic' ? (
              <>
                <p className="eyebrow">{copy.nowPlayingEyebrow || 'Now Playing'}</p>
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
                  <h3>{copy.desktopControlsTitle || 'Desktop Controls'}</h3>
                  <ul>
                    {meta.controls.map(line => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div className="games-mobile-help">
                  <div className="games-control-card">
                    <span>{copy.mobilePlayTitle || 'Mobile Play'}</span>
                    <strong>{copy.mobilePlayBody || 'Use the touch pads below the game on phones or tablets.'}</strong>
                  </div>
                  <div className="games-control-card">
                    <span>{copy.bestExperienceTitle || 'Best Experience'}</span>
                    <strong>{copy.bestExperienceBody || 'Tap fullscreen and rotate to landscape for easier same-device multiplayer.'}</strong>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="eyebrow">{copy.partyEyebrow || 'Party Host Panel'}</p>
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
                  <h3>{copy.partyResultsTitle || 'Recent results'}</h3>
                  <ul>
                    {party.history.length > 0 ? party.history.map(item => (
                      <li key={item.id}>{item.winnerName} won a {item.format.replace('-', ' ')} heat.</li>
                    )) : <li>{copy.partyResultsEmpty || 'Start the first heat and results will appear here.'}</li>}
                  </ul>
                </div>
              </>
            )}
          </div>

          <div ref={stageRef} className={isFullscreen ? 'games-player-shell is-fullscreen' : 'games-player-shell'}>
            <div className="games-player-toolbar">
              <div>
                <p className="eyebrow">{copy.playSurfaceEyebrow || 'Play Surface'}</p>
                <strong>{selectedGame.title}</strong>
              </div>
              <button type="button" className="button dark games-fullscreen-button" onClick={toggleFullscreen}>
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
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

            {experienceMode === 'classic' && (
              <div className="games-touch-shell" aria-label="Mobile touch controls">
                {MOBILE_STATIONS.map(station => (
                  <section key={station.id} className="games-touch-station">
                    <header>
                      <span>{station.title}</span>
                      <strong>{station.id === 'p1' ? 'Left team controls' : 'Right team controls'}</strong>
                    </header>
                    <div className="games-touch-grid">
                      {station.keys.map(control => (
                        <button
                          key={`${station.id}-${control.id}`}
                          type="button"
                          className={`games-touch-button ${control.className}`}
                          aria-label={`${station.title} ${control.label}`}
                          {...bindTouchControl(control.key)}
                        >
                          {control.label}
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
