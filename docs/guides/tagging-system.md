---
layout: page
---

<script setup>
const slugifyDemo = `// Tags are stored as lowercase kebab-case slugs
// Special chars are stripped, diacritics normalized
import { slugifyTagValue } from '@dyne/interfacer-client';

const raw = ['3D Printing', 'Open Source Hardware', 'IoT', '  HANDMADE  '];
const slugs = raw.map(slugifyTagValue);

console.log('Input      → Slug');
console.log('──────────   ─────────────────');
raw.forEach((r, i) => console.log(r.padEnd(12) + '→ ' + slugs[i]));`;

const userTagDemo = `import {
  userTag, isUserTag, stripUserTagPrefix
} from '@dyne/interfacer-client';

// Raw user input gets prefixed with 'tag-'
const t1 = userTag('3D Printing');
const t2 = userTag('Open Hardware');

console.log('userTag output:', t1, t2);
console.log('');
console.log('isUserTag("tag-open-hardware"):', isUserTag(t2));
console.log('stripUserTagPrefix("tag-open-hardware"):',
  stripUserTagPrefix(t2));
console.log('isUserTag("category-electronics"):',
  isUserTag('category-electronics'));`;

const extractDemo = `import {
  extractUserTagValues, isSystemTag
} from '@dyne/interfacer-client';

// A resource's classifiedAs array — mix of user and system tags
const classifiedAs = [
  'tag-3d-printing',
  'tag-open-hardware',
  'category-electronics',
  'powercompat-usb-c',
  'recyclability-ge-80',
  'recyclability-le-100',
  'manufacturable-true',
];

const userValues = extractUserTagValues(classifiedAs);
console.log('User-visible tags:', userValues);

console.log('');
classifiedAs.forEach(t => {
  console.log(t.padEnd(26) + '→ ' +
    (isSystemTag(t) ? 'system' : 'user'));
});`;

const normalizeDemo = `import { normalizeUserTagsForSave } from '@dyne/interfacer-client';

// User types raw text — normalize ensures canonical form
const raw = [
  '3D Printing',
  '  Open Source  ',    // whitespace trimmed
  'tag-iot',            // already canonical
  'category-bogus',     // system prefix → dropped
];

const clean = normalizeUserTagsForSave(raw);
console.log('Normalized:', clean);`;

const rangeDemo = `import { monotonicRangeTags } from '@dyne/interfacer-client';

// Power requirement thresholds
const POWER_REQ = [0,10,25,50,75,100,150,200,250,300,500,750,1000];

// A device rated at 60W
const tags = monotonicRangeTags('powerreq', 60, POWER_REQ);

console.log('Power tags for 60W:');
tags.forEach(t => console.log(' ', t));
// Result: powerreq-ge-10, powerreq-ge-25, powerreq-ge-50,
//          powerreq-le-75, powerreq-le-100 ...
// → ">= all thresholds ≤ 60W, AND ≤ all thresholds ≥ 60W"`;

const derivedDemo = `import { derivedProductFilterTags } from '@dyne/interfacer-client';

// Product filter metadata from DPP/creation form
const filters = {
  categories: ['Electronics'],
  powerCompatibility: ['USB-C'],
  replicability: ['High'],
  recyclabilityPct: 85,
  repairability: true,
  powerRequirementW: 60,
  energyKwh: 200,
  co2Kg: 5,
};

const tags = derivedProductFilterTags(filters);
console.log('Derived system tags:');
tags.forEach(t => console.log(' ', t));
console.log('\\nTotal: ' + tags.length + ' tags generated automatically');`;

const mergeDemo = `import {
  normalizeUserTagsForSave,
  derivedProductFilterTags,
  mergeTags,
  prefixedTag,
  TAG_PREFIX,
} from '@dyne/interfacer-client';

// Step 1: User-entered tags
const userTags = normalizeUserTagsForSave(
  ['3D Printing', 'IoT', 'Open Hardware']
);

// Step 2: Machine references
const machineTags = [
  prefixedTag(TAG_PREFIX.MACHINE, 'Laser Cutter'),
  prefixedTag(TAG_PREFIX.MATERIAL, 'PLA'),
].filter(Boolean);

// Step 3: Product filter tags
const filterTags = derivedProductFilterTags({
  categories: ['Electronics'],
  powerCompatibility: ['USB-C'],
  recyclabilityPct: 85,
});

// Step 4: Merge all
const allTags = mergeTags(userTags, machineTags, filterTags);

console.log('Final classifiedAs array:');
allTags.forEach(t => console.log(' ', t));
console.log('\\nTotal: ' + allTags.length + ' tags');
console.log('Ready for client.resources.createProject({ tags: allTags })');`;
</script>

# Tagging System

The SDK includes a comprehensive classification system that powers search, filtering, and discovery across all resources. Tags are stored as prefixed slug strings in each resource's `classifiedAs` array on Zenflows.

## Why Tagging Matters

Every project, machine, and resource on Interfacer is classified via tags. This drives:

- **Search & discovery** — filter by category, replicability, power requirements
- **Environmental scoring** — recyclability, CO₂, energy use
- **Compatibility matching** — power, materials, service types
- **User-generated metadata** — free-form tags alongside structured ones

The tagging utilities are fully client-side — no API calls needed.

## Tag Format

All tags use `prefix-value` format in lowercase kebab-case:

```
tag-3d-printing          — user tag
category-electronics      — product category
powercompat-usb-c         — power compatibility
recyclability-ge-80       — recyclability ≥ 80%
powerreq-le-75            — power requirement ≤ 75W
manufacturable-true       — special flag
```

## Core Utilities

### `slugifyTagValue`

Normalizes any text into a canonical tag slug:

<Playground label="Slugify" :code="slugifyDemo" />

### User Tags: `userTag`, `isUserTag`, `stripUserTagPrefix`

User-entered tags are wrapped with the `tag-` prefix to distinguish them from system-generated metadata:

<Playground label="User Tags" :code="userTagDemo" />

### Extracting & Identifying Tags

Given a resource's `classifiedAs` array, you need to know which tags are user-visible and which are system-derived:

<Playground label="Extract & Identify" :code="extractDemo" />

### Normalizing for Save

Before saving user input, normalize it to canonical form. System-prefixed entries are dropped:

<Playground label="Normalize" :code="normalizeDemo" />

## Numeric Range Tags

The most powerful feature — numeric values are converted into bounded range tags for inequality-based queries.

Given a device rated at **60W**:

<Playground label="Range Tags" :code="rangeDemo" />

This produces **ge-** (greater-or-equal) tags for all thresholds ≤ 60W, and **le-** (less-or-equal) tags for all thresholds ≥ 60W. A search for `powerreq-le-75` matches everything consuming ≤ 75W. A search for `powerreq-ge-50` matches everything consuming ≥ 50W. Combine both for exact ranges.

## Derived Filter Tags

When a user fills in product/service filter metadata, `derivedProductFilterTags` generates all system tags automatically:

<Playground label="Derived Tags" :code="derivedDemo" />

Each field maps to the appropriate prefix using constants:
- `categories[]` → `category-{slug}`
- `powerCompatibility[]` → `powercompat-{slug}`
- `replicability[]` → `replicability-{slug}`
- `recyclabilityPct` → `recyclability-ge/le-{pct}`
- `repairability: true` → `repairability-available`
- `powerRequirementW` → `powerreq-ge/le-{value}`
- `energyKwh` → `env-energy-ge/le-{value}`
- `co2Kg` → `env-co2-ge/le-{value}`

## Putting It All Together

Here's the actual pattern used when creating a project — merging user tags, machine/material references, and derived filter tags into a single `classifiedAs` array:

<Playground label="Full Merge" :code="mergeDemo" />

## Tag Prefix Reference

| Prefix | Constant | Type | Description |
|--------|----------|------|-------------|
| `tag-` | `TAG_PREFIX.USER` | User | Free-form user-entered tags |
| `category-` | `TAG_PREFIX.CATEGORY` | Product | Product category (Electronics, Tools, etc.) |
| `powercompat-` | `TAG_PREFIX.POWER_COMPAT` | Product | Power compatibility (USB-C, 120V AC, etc.) |
| `powerreq-` | `TAG_PREFIX.POWER_REQ` | Range | Power requirement in watts |
| `replicability-` | `TAG_PREFIX.REPLICABILITY` | Product | How replicable (High/Medium/Low) |
| `recyclability-` | `TAG_PREFIX.RECYCLABILITY` | Range | Recyclability percentage |
| `repairability-` | `TAG_PREFIX.REPAIRABILITY` | Flag | Repairability available flag |
| `env-energy-` | `TAG_PREFIX.ENV_ENERGY` | Range | Energy consumption in kWh |
| `env-co2-` | `TAG_PREFIX.ENV_CO2` | Range | CO₂ footprint in kg |
| `servicetype-` | `TAG_PREFIX.SERVICE_TYPE` | Service | Service type (Fabrication, etc.) |
| `availability-` | `TAG_PREFIX.AVAILABILITY` | Service | Availability (Available Now, etc.) |
| `license-` | `TAG_PREFIX.LICENSE` | Both | Open source license |
| `machine-` | `TAG_PREFIX.MACHINE` | Both | Referenced machines |
| `material-` | `TAG_PREFIX.MATERIAL` | Both | Referenced materials |
| `manufacturable-` | `TAG_PREFIX.MANUFACTURABLE` | Flag | Design is manufacturable |

## Threshold Constants

Use these when constructing filter queries or deriving range tags:

| Constant | Values |
|----------|--------|
| `RECYCLABILITY_THRESHOLDS_PCT` | 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 |
| `POWER_REQUIREMENT_THRESHOLDS_W` | 0, 10, 25, 50, 75, 100, 150, 200, 250, 300, 500, 750, 1000, 1500, 2000 |
| `ENERGY_THRESHOLDS_KWH` | 0, 10, 20, 30, 50, 100, 200, 300, 500, 750, 1000, 1500, 2000 |
| `CO2_THRESHOLDS_KG` | 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 5, 7.5, 10, 15, 20 |

## Option Constants

| Constant | Options |
|----------|---------|
| `PRODUCT_CATEGORY_OPTIONS` | Electronics, Tools, Furniture, Home renovation, Energy, Wearables, Medical, Sustainability, Education |
| `POWER_COMPATIBILITY_OPTIONS` | 120V AC, 220-240V AC, 12V DC, 24V DC, Battery Powered, USB-C |
| `REPLICABILITY_OPTIONS` | High, Medium, Low |
| `SERVICE_TYPE_OPTIONS` | Fabrication, Learning & Education, Space Access |
| `AVAILABILITY_OPTIONS` | Available Now, Booking Required, Weekdays Only, Weekends Available |

## API Reference

See [TaggingClient](/api/classes/TaggingClient) for the full class API and [Variables](/api/variables/TAG_PREFIX) for all constants.
