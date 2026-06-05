import { useMemo, useReducer } from 'react';

export const PARTY_FORMATS = [
  {
    id: 'winner-stays',
    label: 'Winner Stays',
    description: 'Keep momentum high by letting the winner hold station while the challenger rotates in.'
  },
  {
    id: 'full-rotation',
    label: 'Full Rotation',
    description: 'Move everyone through evenly by sending both active players to the back after each heat.'
  },
  {
    id: 'ladder',
    label: 'Ladder Queue',
    description: 'Promote players by wins so the live station naturally becomes a mini leaderboard.'
  }
];

const DEFAULT_PLAYER_COUNT = 6;

const createPlayer = index => ({
  id: `player-${index + 1}`,
  name: `Player ${index + 1}`,
  wins: 0,
  plays: 0
});

const createPlayers = count =>
  Array.from({ length: count }, (_, index) => createPlayer(index));

const resetScoreboard = players =>
  players.map(player => ({
    ...player,
    wins: 0,
    plays: 0
  }));

const clampPlayerCount = count => Math.min(16, Math.max(2, count));

const rotateOrder = (order, seats) => {
  if (order.length <= seats) {
    return order;
  }

  return [...order.slice(seats), ...order.slice(0, seats)];
};

const computeLadderOrder = (players, previousOrder) => {
  const priorRank = previousOrder.reduce((map, id, index) => {
    map[id] = index;
    return map;
  }, {});

  return [...previousOrder].sort((leftId, rightId) => {
    const left = players.find(player => player.id === leftId);
    const right = players.find(player => player.id === rightId);

    if (right.wins !== left.wins) {
      return right.wins - left.wins;
    }

    if (left.plays !== right.plays) {
      return left.plays - right.plays;
    }

    return (priorRank[leftId] ?? 0) - (priorRank[rightId] ?? 0);
  });
};

const makeInitialState = () => {
  const players = createPlayers(DEFAULT_PLAYER_COUNT);

  return {
    format: PARTY_FORMATS[0].id,
    players,
    order: players.map(player => player.id),
    history: []
  };
};

const replacePlayerCount = (state, count) => {
  const nextCount = clampPlayerCount(count);
  const nextPlayers = resetScoreboard(createPlayers(nextCount));

  return {
    ...state,
    players: nextPlayers,
    order: nextPlayers.map(player => player.id),
    history: []
  };
};

const reorderAfterResult = (state, winnerId, seats) => {
  const currentIds = state.order.slice(0, seats);
  const benchIds = state.order.slice(seats);
  const loserIds = currentIds.filter(id => id !== winnerId);

  switch (state.format) {
    case 'full-rotation':
      return [...benchIds, ...currentIds];
    case 'ladder':
      return computeLadderOrder(state.players, state.order);
    case 'winner-stays':
    default:
      return [winnerId, ...benchIds, ...loserIds];
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'set_format':
      return {
        ...state,
        format: action.format,
        order: action.format === 'ladder' ? computeLadderOrder(state.players, state.order) : state.order
      };
    case 'set_player_count':
      return replacePlayerCount(state, action.count);
    case 'rename_player':
      return {
        ...state,
        players: state.players.map(player => (
          player.id === action.playerId
            ? { ...player, name: action.name }
            : player
        ))
      };
    case 'shuffle_queue': {
      const nextOrder = [...state.order];
      for (let index = nextOrder.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [nextOrder[index], nextOrder[swapIndex]] = [nextOrder[swapIndex], nextOrder[index]];
      }

      return {
        ...state,
        order: nextOrder,
        history: []
      };
    }
    case 'rotate_heat':
      return {
        ...state,
        order: rotateOrder(state.order, action.seats)
      };
    case 'report_winner': {
      const players = state.players.map(player => (
        action.activeIds.includes(player.id)
          ? {
              ...player,
              wins: player.id === action.winnerId ? player.wins + 1 : player.wins,
              plays: player.plays + 1
            }
          : player
      ));
      const updatedState = { ...state, players };
      const winnerName = players.find(player => player.id === action.winnerId)?.name || 'Winner';

      return {
        ...updatedState,
        order: reorderAfterResult(updatedState, action.winnerId, action.seats),
        history: [
          {
            id: `${action.winnerId}-${Date.now()}`,
            winnerName,
            format: state.format
          },
          ...state.history
        ].slice(0, 8)
      };
    }
    case 'reset_session': {
      const players = resetScoreboard(state.players);
      return {
        ...state,
        players,
        order: players.map(player => player.id),
        history: []
      };
    }
    default:
      return state;
  }
};

export const usePartyMode = stations => {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialState);
  const seatCount = stations.length;

  const playersById = useMemo(
    () => state.players.reduce((map, player) => {
      map[player.id] = player;
      return map;
    }, {}),
    [state.players]
  );

  const activePlayers = state.order.slice(0, seatCount).map((playerId, index) => ({
    station: stations[index],
    ...playersById[playerId]
  }));

  const queuedPlayers = state.order.slice(seatCount).map(playerId => playersById[playerId]);

  const standings = [...state.players].sort((left, right) => {
    if (right.wins !== left.wins) {
      return right.wins - left.wins;
    }

    if (left.plays !== right.plays) {
      return left.plays - right.plays;
    }

    return left.name.localeCompare(right.name);
  });

  return {
    formats: PARTY_FORMATS,
    format: state.format,
    players: state.players,
    activePlayers,
    queuedPlayers,
    standings,
    history: state.history,
    setFormat: format => dispatch({ type: 'set_format', format }),
    setPlayerCount: count => dispatch({ type: 'set_player_count', count }),
    renamePlayer: (playerId, name) => dispatch({ type: 'rename_player', playerId, name }),
    shuffleQueue: () => dispatch({ type: 'shuffle_queue' }),
    rotateHeat: () => dispatch({ type: 'rotate_heat', seats: seatCount }),
    reportWinner: winnerId => dispatch({
      type: 'report_winner',
      winnerId,
      activeIds: state.order.slice(0, seatCount),
      seats: seatCount
    }),
    resetSession: () => dispatch({ type: 'reset_session' })
  };
};
