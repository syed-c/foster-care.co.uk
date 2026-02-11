// SEO Keywords Database - Updated for 2024
const KEYWORDS = {
  primary: [
    "foster care",
    "foster care agencies",
    "fostering agencies",
    "foster care near me",
    "independent fostering agency",
    "UK foster care",
    "foster agency",
    "foster placement"
  ],
  secondary: [
    "become a foster carer",
    "foster carer",
    "foster parenting",
    "child fostering",
    "family foster care",
    "fostering",
    "foster homes",
    "emergency foster care"
  ],
  tertiary: [
    "adoptive services",
    "child welfare",
    "family services",
    "social services",
    "childcare",
    "residential care",
    "kinship care",
    "therapeutic care"
  ],
  locationBased: [
    "foster care london",
    "foster care manchester",
    "foster care birmingham",
    "foster care leeds",
    "foster care glasgow",
    "foster care liverpool",
    "foster care sheffield",
    "foster care bristol",
    "foster care newcastle",
    "foster care nottingham"
  ],
  specialismBased: [
    "emergency fostering",
    "short term fostering",
    "long term fostering",
    "therapeutic fostering",
    "respite fostering",
    "parent and child fostering",
    "sibling group fostering",
    "teenage fostering"
  ],
  processBased: [
    "how to become a foster carer",
    "foster care application",
    "foster carer training",
    "foster care assessment",
    "foster care approval",
    "foster care requirements"
  ],
  financial: [
    "foster care allowance",
    "foster carer pay",
    "fostering payments",
    "foster care benefits",
    "foster carer income",
    "fostering tax",
    "foster care expenses"
  ]
};

// Long-tail keyword combinations
const LONG_TAIL_KEYWORDS = [
  "how to become a foster carer uk 2024",
  "foster care agencies near me with reviews",
  "best independent fostering agencies in england",
  "emergency foster care placement services",
  "therapeutic fostering agencies for complex needs",
  "short term fostering opportunities near me",
  "foster care allowance calculator uk",
  "long term fostering agencies with good reviews",
  "respite fostering services for families",
  "parent and child fostering agencies uk"
];

// Semantic keywords and LSI terms
const SEMANTIC_KEYWORDS = {
  emotions: ["caring", "supportive", "nurturing", "compassionate", "dedicated"],
  process: ["assessment", "training", "approval", "placement", "supervision"],
  benefits: ["rewarding", "meaningful", "impactful", "fulfilling", "purposeful"],
  requirements: ["approved", "qualified", "experienced", "reliable", "responsible"],
  outcomes: ["successful", "positive", "transformative", "life-changing", "stable"]
};

// Competitor analysis keywords
const COMPETITOR_KEYWORDS = [
  "fostering network",
  "fostering people",
  "fostering solutions",
  "national fostering group",
  "independent fostering agencies",
  "foster care providers",
  "childrens services",
  "family care services"
];

// Seasonal and trending keywords
const TRENDING_KEYWORDS = [
  "foster care awareness month",
  "national fostering week",
  "foster care recruitment",
  "fostering shortage uk",
  "foster carer shortage",
  "emergency fostering needed",
  "fostering during covid",
  "virtual fostering assessment"
];

// Negative keywords to avoid
const NEGATIVE_KEYWORDS = [
  "free",
  "cheap",
  "fast approval",
  "no experience required",
  "guaranteed placement",
  "easy money",
  "quick cash"
];

// Keyword clustering function
export function getKeywordClusters(primaryTopic: string) {
  const clusters: Record<string, string[]> = {
    core: [...KEYWORDS.primary],
    location: [...KEYWORDS.locationBased],
    specialism: [...KEYWORDS.specialismBased],
    process: [...KEYWORDS.processBased],
    financial: [...KEYWORDS.financial],
    semantic: [
      ...SEMANTIC_KEYWORDS.emotions,
      ...SEMANTIC_KEYWORDS.process,
      ...SEMANTIC_KEYWORDS.benefits
    ]
  };

  // Add long-tail variations
  clusters.longTail = LONG_TAIL_KEYWORDS.filter(keyword => 
    keyword.includes(primaryTopic.toLowerCase())
  );

  return clusters;
}

// Content optimization helper
export function optimizeContentForKeywords(
  content: string,
  primaryKeyword: string,
  location?: string,
  specialism?: string
) {
  const optimizations = {
    keywordDensity: 0,
    semanticKeywords: [] as string[],
    locationKeywords: [] as string[],
    specialismKeywords: [] as string[],
    titleOptimization: "",
    metaDescription: ""
  };

  // Calculate keyword density
  const words = content.toLowerCase().split(/\s+/);
  const keywordCount = words.filter(word => 
    word.includes(primaryKeyword.toLowerCase().replace(/\s+/g, ''))
  ).length;
  optimizations.keywordDensity = (keywordCount / words.length) * 100;

  // Find semantic keywords
  optimizations.semanticKeywords = Object.values(SEMANTIC_KEYWORDS)
    .flat()
    .filter(semantic => content.toLowerCase().includes(semantic.toLowerCase()));

  // Location-based optimization
  if (location) {
    const locationKeywords = KEYWORDS.locationBased.filter(kw => 
      kw.includes(location.toLowerCase())
    );
    optimizations.locationKeywords = locationKeywords;
  }

  // Specialism-based optimization
  if (specialism) {
    const specialismKeywords = KEYWORDS.specialismBased.filter(kw => 
      kw.includes(specialism.toLowerCase())
    );
    optimizations.specialismKeywords = specialismKeywords;
  }

  // Generate optimized title
  optimizations.titleOptimization = generateOptimizedTitle(
    primaryKeyword,
    location,
    specialism
  );

  // Generate meta description
  optimizations.metaDescription = generateMetaDescription(
    primaryKeyword,
    location,
    specialism
  );

  return optimizations;
}

// Title optimization
function generateOptimizedTitle(
  primaryKeyword: string,
  location?: string,
  specialism?: string
): string {
  const titleParts = [];
  
  if (specialism) {
    titleParts.push(`${specialism.replace(/-/g, ' ')} Fostering`);
  } else {
    titleParts.push(primaryKeyword);
  }
  
  if (location) {
    titleParts.push(`in ${location.replace(/-/g, ' ')}`);
  }
  
  titleParts.push("| Compare 500+ Verified Agencies | Foster Care UK");
  
  return titleParts.join(" ");
}

// Meta description optimization
function generateMetaDescription(
  primaryKeyword: string,
  location?: string,
  specialism?: string
): string {
  const descriptions = [
    `Find the best ${specialism ? specialism.replace(/-/g, ' ') + ' ' : ''}${primaryKeyword} ${location ? 'in ' + location.replace(/-/g, ' ') : 'across the UK'}. Compare 500+ verified agencies, read real reviews, and connect with trusted fostering services.`,
    `Discover ${specialism ? specialism.replace(/-/g, ' ') + ' ' : ''}${primaryKeyword} ${location ? 'in ' + location.replace(/-/g, ' ') : 'throughout the UK'}. Browse our directory of 500+ verified agencies and find the perfect fostering match for your needs.`,
    `Connect with ${specialism ? specialism.replace(/-/g, ' ') + ' ' : ''}${primaryKeyword} ${location ? 'in ' + location.replace(/-/g, ' ') : 'across the UK'}. Compare services, read reviews, and find trusted agencies for your fostering journey.`
  ];
  
  return descriptions[0];
}

// Keyword research helper
export function getKeywordOpportunities(topic: string, location?: string) {
  const opportunities = [];
  
  // Primary keyword combinations
  KEYWORDS.primary.forEach(primary => {
    opportunities.push(primary);
    if (location) {
      opportunities.push(`${primary} ${location}`);
      opportunities.push(`${primary} near ${location}`);
    }
  });
  
  // Specialism combinations
  KEYWORDS.specialismBased.forEach(specialism => {
    opportunities.push(specialism);
    if (location) {
      opportunities.push(`${specialism} ${location}`);
    }
  });
  
  // Process-based combinations
  KEYWORDS.processBased.forEach(process => {
    opportunities.push(process);
    if (location) {
      opportunities.push(`${process} ${location}`);
    }
  });
  
  return opportunities.filter(opp => opp.toLowerCase().includes(topic.toLowerCase()));
}

// Competitor gap analysis
export function getCompetitorGaps(primaryKeyword: string) {
  return COMPETITOR_KEYWORDS.filter(competitor => 
    !primaryKeyword.toLowerCase().includes(competitor.toLowerCase())
  );
}

export { 
  KEYWORDS, 
  LONG_TAIL_KEYWORDS, 
  SEMANTIC_KEYWORDS, 
  COMPETITOR_KEYWORDS, 
  TRENDING_KEYWORDS, 
  NEGATIVE_KEYWORDS 
};