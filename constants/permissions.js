const ROLE_IDS = {
  ADMIN: 1,
  INSTRUCTOR: 2,
  USER: 3,
  VISITOR: 4,
  GUARD: 5
};

const ROLE_NAMES = {
  ADMIN: 'Administrador',
  INSTRUCTOR: 'Instructor',
  USER: 'Aprendiz',
  VISITOR: 'Visitante',
  GUARD: 'Vigilante'
};

const ROLE_ALIASES = {
  [ROLE_IDS.ADMIN]: ROLE_NAMES.ADMIN,
  [ROLE_IDS.INSTRUCTOR]: ROLE_NAMES.INSTRUCTOR,
  [ROLE_IDS.USER]: ROLE_NAMES.USER,
  [ROLE_IDS.VISITOR]: ROLE_NAMES.VISITOR,
  [ROLE_IDS.GUARD]: ROLE_NAMES.GUARD,
  [ROLE_NAMES.ADMIN]: ROLE_NAMES.ADMIN,
  [ROLE_NAMES.INSTRUCTOR]: ROLE_NAMES.INSTRUCTOR,
  [ROLE_NAMES.USER]: ROLE_NAMES.USER,
  [ROLE_NAMES.VISITOR]: ROLE_NAMES.VISITOR,
  [ROLE_NAMES.GUARD]: ROLE_NAMES.GUARD
};

function normalizeRole(input) {
  if (input === undefined || input === null) return null;
  return ROLE_ALIASES[input] || null;
}

module.exports = {
  ROLE_IDS,
  ROLE_NAMES,
  ROLE_ALIASES,
  normalizeRole
};
