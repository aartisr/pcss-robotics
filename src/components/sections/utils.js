export const iconNames = ['wrench', 'cpu', 'code', 'users', 'shield', 'rocket'];

export const asArray = value => Array.isArray(value) ? value : [];

export const resolveVariant = source => {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return source;
  }

  const activeVariant = typeof source.activeVariant === 'string' ? source.activeVariant.trim() : '';
  const variants = source.variants && typeof source.variants === 'object' && !Array.isArray(source.variants)
    ? source.variants
    : {};

  if (!activeVariant || !variants[activeVariant] || typeof variants[activeVariant] !== 'object' || Array.isArray(variants[activeVariant])) {
    return source;
  }

  const { variants: _variants, activeVariant: _activeVariant, ...base } = source;
  return {
    ...base,
    ...variants[activeVariant],
    activeVariant,
    variants
  };
};

export const formatEventDate = value => {
  const parsedDate = new Date(`${value}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};
