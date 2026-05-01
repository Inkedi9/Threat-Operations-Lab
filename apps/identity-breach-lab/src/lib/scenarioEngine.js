import { createEvent, clone, updateAttackPath } from "./utils";

function generateId(prefix = "id") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function applyUserMutations(users, mutations = []) {
  return users.map((user) => {
    const mutation = mutations.find(
      (entry) => entry.username === user.username,
    );

    if (!mutation) return user;

    return {
      ...user,
      ...clone(mutation.updates),
    };
  });
}

function applySystemMutations(systems, mutations = []) {
  return systems.map((system) => {
    const mutation = mutations.find((entry) => entry.name === system.name);

    if (!mutation) return system;

    return {
      ...system,
      ...clone(mutation.updates),
    };
  });
}

function applySessionMutations(sessions, mutations = []) {
  const nextSessions = mutations.map((session) => ({
    id: generateId("sess"),
    ...clone(session),
  }));

  return [...sessions, ...nextSessions];
}

function appendUsers(users, appendedUsers = []) {
  if (!appendedUsers.length) return users;
  return [...users, ...clone(appendedUsers)];
}

function buildScenarioEvents(events = []) {
  return events.map((event) => createEvent(event));
}

export function applyScenarioDefinition(state, scenario) {
  const nextState = clone(state);

  const { mutations = {}, events = [] } = scenario;

  nextState.users = applyUserMutations(nextState.users, mutations.users);
  nextState.users = appendUsers(nextState.users, mutations.appendUsers);

  nextState.systems = applySystemMutations(
    nextState.systems,
    mutations.systems,
  );
  nextState.sessions = applySessionMutations(
    nextState.sessions,
    mutations.sessions,
  );

  const scenarioEvents = buildScenarioEvents(events);

  nextState.events = [...scenarioEvents, ...nextState.events];
  nextState.timeline = [...scenarioEvents, ...nextState.timeline];
  nextState.attackPath = updateAttackPath(
    nextState.attackPath,
    mutations.attackPathKeys || [],
  );

  return nextState;
}
