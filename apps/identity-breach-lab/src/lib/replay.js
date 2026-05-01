import { clone } from "./utils";

export function setReplayPlaying(state, isPlaying) {
  const nextState = clone(state);

  nextState.replay = {
    ...nextState.replay,
    isPlaying,
  };

  return nextState;
}

export function goToReplayStep(state, nextIndex) {
  const nextState = clone(state);
  const steps = nextState.replay?.steps || [];

  if (!steps.length) return nextState;

  const boundedIndex = Math.max(0, Math.min(nextIndex, steps.length - 1));

  nextState.replay = {
    ...nextState.replay,
    currentStepIndex: boundedIndex,
  };

  return nextState;
}

export function nextReplayStep(state) {
  const currentIndex = state.replay?.currentStepIndex ?? -1;
  return goToReplayStep(state, currentIndex + 1);
}

export function previousReplayStep(state) {
  const currentIndex = state.replay?.currentStepIndex ?? -1;
  return goToReplayStep(state, currentIndex - 1);
}

export function resetReplay(state) {
  const nextState = clone(state);

  nextState.replay = {
    ...nextState.replay,
    currentStepIndex: nextState.replay?.steps?.length ? 0 : -1,
    isPlaying: false,
  };

  return nextState;
}

export function setReplaySpeed(state, speed) {
  const nextState = clone(state);

  nextState.replay = {
    ...nextState.replay,
    speed,
  };

  return nextState;
}
