const HOME_SLUG = 'home';
const GAMES_SLUG = 'games';

const SECTION_TYPE_OPTIONS = [
  'featureGrid',
  'timeline',
  'story',
  'values',
  'programs',
  'robots',
  'sponsorTiers',
  'sponsorShowcase',
  'events',
  'eventAtlas',
  'gallery',
  'contact',
  'join',
  'countdown',
  'schedule',
  'speakers',
  'links',
  'teamProfiles',
  'impactPulse',
  'viralLaunch',
  'sponsorConversion'
];

const HOME_HERO_TYPE = 'HomeHeroBlock';
const PAGE_HEADER_TYPE = 'PageHeaderBlock';
const SECTION_BLOCK_TYPE = 'SectionBlock';
const GAMES_CONTENT_TYPE = 'GamesContentBlock';

const isObject = value => value && typeof value === 'object' && !Array.isArray(value);

const asString = value => (typeof value === 'string' ? value : '');

const asArray = value => (Array.isArray(value) ? value : []);

const sortTypeOptions = options => options
  .filter(Boolean)
  .map(value => String(value))
  .sort((left, right) => left.localeCompare(right));

const toJson = value => JSON.stringify(value, null, 2);

const toBlockId = (value, fallback) => {
  const candidate = asString(value).trim();
  return candidate || fallback;
};

const parseJson = (label, value, fallback, errors) => {
  if (!value || !String(value).trim()) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    errors.push(`Invalid JSON for ${label}.`);
    return fallback;
  }
};

const normalizePath = path => {
  if (!path || path === '/') {
    return '/';
  }

  return path.startsWith('/') ? path : `/${path}`;
};

const buildSectionFromProps = props => {
  const errors = [];
  const extras = parseJson('section extras', props.extrasJson, {}, errors);

  return {
    errors,
    section: {
      ...(isObject(extras) ? extras : {}),
      type: asString(props.sectionType) || 'featureGrid',
      eyebrow: asString(props.eyebrow),
      title: asString(props.title),
      body: asString(props.body)
    }
  };
};

const toSectionBlock = (section, index, slug) => {
  const base = isObject(section) ? section : {};
  const {
    type = 'featureGrid',
    eyebrow = '',
    title = '',
    body = '',
    ...rest
  } = base;

  return {
    type: SECTION_BLOCK_TYPE,
    props: {
      id: toBlockId(base._id, `${slug}-section-${index + 1}`),
      sectionType: asString(type) || 'featureGrid',
      eyebrow: asString(eyebrow),
      title: asString(title),
      body: asString(body),
      extrasJson: toJson(rest)
    }
  };
};

const toHomeHeroBlock = home => {
  const hero = isObject(home?.hero) ? home.hero : {};
  const {
    eyebrow = '',
    title = '',
    body = '',
    primaryCta = {},
    secondaryCta = {},
    stats = [],
    ...rest
  } = hero;

  return {
    type: HOME_HERO_TYPE,
    props: {
      id: 'home-hero',
      eyebrow: asString(eyebrow),
      title: asString(title),
      body: asString(body),
      primaryLabel: asString(primaryCta?.label),
      primaryHref: asString(primaryCta?.href),
      secondaryLabel: asString(secondaryCta?.label),
      secondaryHref: asString(secondaryCta?.href),
      statsJson: toJson(asArray(stats)),
      extrasJson: toJson(rest)
    }
  };
};

const toPageHeaderBlock = (page, slug) => {
  const safePage = isObject(page) ? page : {};

  return {
    type: PAGE_HEADER_TYPE,
    props: {
      id: toBlockId(safePage._id, `${slug}-header`),
      title: asString(safePage.title),
      summary: asString(safePage.summary)
    }
  };
};

const toGamesBlock = games => {
  const safeGames = isObject(games) ? games : {};

  return {
    type: GAMES_CONTENT_TYPE,
    props: {
      id: toBlockId(safeGames._id, `${GAMES_SLUG}-content`),
      eyebrow: asString(safeGames.eyebrow),
      title: asString(safeGames.title),
      intro: asString(safeGames.intro),
      classicLabel: asString(safeGames.classicLabel),
      classicDescription: asString(safeGames.classicDescription),
      partyLabel: asString(safeGames.partyLabel),
      partyDescription: asString(safeGames.partyDescription),
      nowPlayingEyebrow: asString(safeGames.nowPlayingEyebrow),
      partyEyebrow: asString(safeGames.partyEyebrow),
      playSurfaceEyebrow: asString(safeGames.playSurfaceEyebrow),
      desktopControlsTitle: asString(safeGames.desktopControlsTitle),
      mobilePlayTitle: asString(safeGames.mobilePlayTitle),
      mobilePlayBody: asString(safeGames.mobilePlayBody),
      bestExperienceTitle: asString(safeGames.bestExperienceTitle),
      bestExperienceBody: asString(safeGames.bestExperienceBody),
      partyResultsTitle: asString(safeGames.partyResultsTitle),
      partyResultsEmpty: asString(safeGames.partyResultsEmpty)
    }
  };
};

export const slugFromPathname = pathname => {
  if (pathname === '/admin/edit') {
    return HOME_SLUG;
  }

  const prefix = '/admin/edit/';

  if (!pathname.startsWith(prefix)) {
    return HOME_SLUG;
  }

  const rawSlug = decodeURIComponent(pathname.slice(prefix.length)).trim();
  return rawSlug || HOME_SLUG;
};

export const getEditablePages = content => {
  const pages = Array.isArray(content?.pages) ? content.pages : [];
  const contentPages = pages.filter(page => asString(page?.slug) !== GAMES_SLUG);

  return [
    {
      slug: HOME_SLUG,
      title: asString(content?.home?.hero?.title) || 'Home',
      summary: asString(content?.home?.hero?.body),
      viewPath: '/',
      editPath: '/admin/edit'
    },
    {
      slug: GAMES_SLUG,
      title: asString(content?.games?.title) || 'Games',
      summary: asString(content?.games?.intro),
      viewPath: '/games',
      editPath: `/admin/edit/${GAMES_SLUG}`
    },
    ...contentPages.map(page => {
      const slug = asString(page?.slug);
      const normalizedSlug = slug || 'untitled';

      return {
        slug: normalizedSlug,
        title: asString(page?.title) || normalizedSlug,
        summary: asString(page?.summary),
        viewPath: normalizePath(normalizedSlug),
        editPath: `/admin/edit/${encodeURIComponent(normalizedSlug)}`
      };
    })
  ];
};

export const createPuckDataForSlug = (content, slug) => {
  if (slug === HOME_SLUG) {
    const home = isObject(content?.home) ? content.home : {};
    const sections = asArray(home.sections).map((section, index) => toSectionBlock(section, index, HOME_SLUG));

    return {
      root: { props: {} },
      content: [toHomeHeroBlock(home), ...sections]
    };
  }

  if (slug === GAMES_SLUG) {
    return {
      root: { props: {} },
      content: [toGamesBlock(content?.games)]
    };
  }

  const page = asArray(content?.pages).find(entry => entry?.slug === slug);

  if (!page) {
    return {
      root: { props: {} },
      content: [toPageHeaderBlock({ title: slug, summary: '' }, slug)]
    };
  }

  const sections = asArray(page.sections).map((section, index) => toSectionBlock(section, index, slug));

  return {
    root: { props: {} },
    content: [toPageHeaderBlock(page, slug), ...sections]
  };
};

const toGamesFromPuck = (blocks, previousGames) => {
  const errors = [];
  const gamesBlock = blocks.find(block => block.type === GAMES_CONTENT_TYPE);

  if (!gamesBlock) {
    errors.push('Games content block is missing.');
  }

  return {
    errors,
    games: {
      ...(isObject(previousGames) ? previousGames : {}),
      eyebrow: asString(gamesBlock?.props?.eyebrow),
      title: asString(gamesBlock?.props?.title),
      intro: asString(gamesBlock?.props?.intro),
      classicLabel: asString(gamesBlock?.props?.classicLabel),
      classicDescription: asString(gamesBlock?.props?.classicDescription),
      partyLabel: asString(gamesBlock?.props?.partyLabel),
      partyDescription: asString(gamesBlock?.props?.partyDescription),
      nowPlayingEyebrow: asString(gamesBlock?.props?.nowPlayingEyebrow),
      partyEyebrow: asString(gamesBlock?.props?.partyEyebrow),
      playSurfaceEyebrow: asString(gamesBlock?.props?.playSurfaceEyebrow),
      desktopControlsTitle: asString(gamesBlock?.props?.desktopControlsTitle),
      mobilePlayTitle: asString(gamesBlock?.props?.mobilePlayTitle),
      mobilePlayBody: asString(gamesBlock?.props?.mobilePlayBody),
      bestExperienceTitle: asString(gamesBlock?.props?.bestExperienceTitle),
      bestExperienceBody: asString(gamesBlock?.props?.bestExperienceBody),
      partyResultsTitle: asString(gamesBlock?.props?.partyResultsTitle),
      partyResultsEmpty: asString(gamesBlock?.props?.partyResultsEmpty)
    }
  };
};

const toHomeFromPuck = (blocks, previousHome) => {
  const errors = [];
  const heroBlock = blocks.find(block => block.type === HOME_HERO_TYPE);

  if (!heroBlock) {
    errors.push('Home page is missing the hero block.');
  }

  const heroExtras = parseJson('hero extras', heroBlock?.props?.extrasJson, {}, errors);
  const stats = parseJson('hero stats', heroBlock?.props?.statsJson, [], errors);

  const hero = {
    ...(isObject(heroExtras) ? heroExtras : {}),
    eyebrow: asString(heroBlock?.props?.eyebrow),
    title: asString(heroBlock?.props?.title),
    body: asString(heroBlock?.props?.body),
    primaryCta: {
      label: asString(heroBlock?.props?.primaryLabel),
      href: asString(heroBlock?.props?.primaryHref)
    },
    secondaryCta: {
      label: asString(heroBlock?.props?.secondaryLabel),
      href: asString(heroBlock?.props?.secondaryHref)
    },
    stats: asArray(stats)
  };

  const sections = blocks
    .filter(block => block.type === SECTION_BLOCK_TYPE)
    .map(block => buildSectionFromProps(block.props));

  sections.forEach(result => {
    errors.push(...result.errors);
  });

  return {
    errors,
    home: {
      ...(isObject(previousHome) ? previousHome : {}),
      hero,
      sections: sections.map(result => result.section)
    }
  };
};

const toPageFromPuck = (slug, blocks, previousPage) => {
  const errors = [];
  const headerBlock = blocks.find(block => block.type === PAGE_HEADER_TYPE);

  if (!headerBlock) {
    errors.push('Page header block is missing.');
  }

  const sections = blocks
    .filter(block => block.type === SECTION_BLOCK_TYPE)
    .map(block => buildSectionFromProps(block.props));

  sections.forEach(result => {
    errors.push(...result.errors);
  });

  return {
    errors,
    page: {
      ...(isObject(previousPage) ? previousPage : {}),
      slug,
      title: asString(headerBlock?.props?.title) || slug,
      summary: asString(headerBlock?.props?.summary),
      sections: sections.map(result => result.section)
    }
  };
};

export const applyPuckDataToContent = (content, slug, puckData) => {
  const blocks = asArray(puckData?.content);

  if (slug === HOME_SLUG) {
    const { home, errors } = toHomeFromPuck(blocks, content?.home);

    if (errors.length > 0) {
      return { content, errors };
    }

    return {
      content: {
        ...content,
        home
      },
      errors: []
    };
  }

  if (slug === GAMES_SLUG) {
    const { games, errors } = toGamesFromPuck(blocks, content?.games);

    if (errors.length > 0) {
      return { content, errors };
    }

    return {
      content: {
        ...content,
        games
      },
      errors: []
    };
  }

  const pages = asArray(content?.pages);
  const existingPage = pages.find(page => page?.slug === slug);
  const { page, errors } = toPageFromPuck(slug, blocks, existingPage);

  if (errors.length > 0) {
    return { content, errors };
  }

  const nextPages = existingPage
    ? pages.map(entry => (entry?.slug === slug ? page : entry))
    : [...pages, page];

  return {
    content: {
      ...content,
      pages: nextPages
    },
    errors: []
  };
};

export const getSectionTypeOptions = content => {
  const dynamicTypes = asArray(content?.pages)
    .flatMap(page => asArray(page?.sections))
    .map(section => asString(section?.type));
  const homeTypes = asArray(content?.home?.sections).map(section => asString(section?.type));

  return sortTypeOptions([...SECTION_TYPE_OPTIONS, ...dynamicTypes, ...homeTypes]);
};

export const types = {
  HOME_HERO_TYPE,
  PAGE_HEADER_TYPE,
  SECTION_BLOCK_TYPE,
  GAMES_CONTENT_TYPE,
  HOME_SLUG,
  GAMES_SLUG
};
