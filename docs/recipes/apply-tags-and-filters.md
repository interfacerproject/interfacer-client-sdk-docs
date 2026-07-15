---
layout: page
---

<script setup>
const step1Demo = `import {
  slugifyTagValue, userTag, normalizeUserTagsForSave
} from '@dyne/interfacer-client';

// Raw text from a form input
const rawTags = [
  '3D Printing',
  'IoT Sensor',
  '  Open Source Hardware  ',
  'renewable energy',
];

// Step 1: Normalize — handles whitespace, diacritics, duplicates
const normalized = normalizeUserTagsForSave(rawTags);
console.log('Normalized user tags:');
normalized.forEach(t => console.log(' ', t));
// Result: tag-3d-printing, tag-iot-sensor,
//          tag-open-source-hardware, tag-renewable-energy`;

const step2Demo = `import {
  derivedProductFilterTags,
  REPAIRABILITY_AVAILABLE_TAG,
} from '@dyne/interfacer-client';

// Product metadata from a creation form or DPP
const metadata = {
  categories: ['Electronics'],
  powerCompatibility: ['USB-C', 'Battery Powered'],
  replicability: ['High'],
  recyclabilityPct: 85,
  repairability: true,
  powerRequirementW: 15,
  energyKwh: 30,
  co2Kg: 2.5,
};

// Step 2: Generate all system tags automatically
const sysTags = derivedProductFilterTags(metadata);
console.log('Derived system tags:');
sysTags.forEach(t => console.log(' ', t));

console.log('');
console.log('Total auto-generated: ' + sysTags.length + ' tags');`;

const step3Demo = `import {
  prefixedTag, TAG_PREFIX,
} from '@dyne/interfacer-client';

// References from form selections
const machines = [{ name: '3D Printer Mk3' }];
const materials = [{ name: 'PLA' }, { name: 'ABS' }];

// Step 3: Tag referenced machines and materials
const machineTags = machines
  .map(m => prefixedTag(TAG_PREFIX.MACHINE, m.name))
  .filter(Boolean);

const materialTags = materials
  .map(m => prefixedTag(TAG_PREFIX.MATERIAL, m.name))
  .filter(Boolean);

const licenseTags = [
  prefixedTag(TAG_PREFIX.LICENSE, 'CC-BY-SA-4.0'),
].filter(Boolean);

console.log('Machine tags:', machineTags);
console.log('Material tags:', materialTags);
console.log('License tags:', licenseTags);`;

const fullDemo = `import {
  normalizeUserTagsForSave,
  derivedProductFilterTags,
  mergeTags,
  prefixedTag,
  TAG_PREFIX,
  MANUFACTURABLE_TRUE_TAG,
} from '@dyne/interfacer-client';

// This is the exact pattern from the Interfacer GUI

// 1. User-entered tags
const userTags = normalizeUserTagsForSave([
  '3D Printing', 'IoT Sensor', 'Open Hardware',
]);

// 2. System-derived product filter tags
const filterTags = derivedProductFilterTags({
  categories: ['Electronics'],
  powerCompatibility: ['USB-C'],
  replicability: ['High'],
  recyclabilityPct: 85,
  repairability: true,
  powerRequirementW: 15,
  energyKwh: 30,
  co2Kg: 2.5,
});

// 3. Machine, material, and license tags
const machineTags = [
  prefixedTag(TAG_PREFIX.MACHINE, 'Prusa i3'),
].filter(Boolean);

const materialTags = [
  prefixedTag(TAG_PREFIX.MATERIAL, 'PLA'),
  prefixedTag(TAG_PREFIX.MATERIAL, 'ABS'),
].filter(Boolean);

const licenseTags = [
  prefixedTag(TAG_PREFIX.LICENSE, 'CC-BY-SA-4.0'),
].filter(Boolean);

// 4. Merge all tag arrays (deduplicates)
const tags = mergeTags(
  userTags,
  filterTags,
  machineTags,
  materialTags,
  licenseTags,
);

console.log('Final classifiedAs array:');
tags.forEach(t => console.log(' ', t));
console.log('');
console.log('Total: ' + tags.length + ' tags');
console.log('');
console.log('Ready to pass to:');
console.log('client.resources.createProject({ tags })');`;
</script>

# Apply Tags & Filters

This recipe shows the complete tag assembly pipeline used when creating or updating a project. Each step mirrors the actual flow from the Interfacer GUI.

## Step 1: Normalize User Tags

Raw text from a form input → canonical `tag-{slug}` form:

<Playground label="Normalize" :code="step1Demo" />

## Step 2: Derived Filter Tags

Convert structured product metadata into system classification tags. This is automatic — no manual tag writing needed:

<Playground label="Filter Tags" :code="step2Demo" />

## Step 3: Reference Tags

Tag machines, materials, and licenses used by the project:

<Playground label="Reference Tags" :code="step3Demo" />

## Full Assembly

Here is the complete pipeline — all four tag sources merged into a single `classifiedAs` array:

<Playground label="Full Assembly" :code="fullDemo" />

## Using with createProject

Pass the merged tags directly to `createProject`:

```ts
const project = await client.resources.createProject({
  projectType: ProjectType.PRODUCT,
  name: "Smart Sensor v2",
  note: "Open source environmental monitor",
  tags, // ← the merged classifiedAs array
  repo: "https://github.com/user/smart-sensor",
});
```

## Updating Tags on an Existing Resource

```ts
// Add new user tags while preserving existing ones
const current = extractUserTagValues(existingClassifiedAs);
const updated = normalizeUserTagsForSave([...current, "new-feature"]);
const merged = mergeTags(updated, existingSystemTags);
await client.resources.updateClassifiedAs(resourceId, merged);
```

## Marking a Design as Manufacturable

When someone creates a product/service that cites your design:

```ts
await client.resources.updateClassifiedAs(designId, [MANUFACTURABLE_TRUE_TAG]);
```

## Key Functions Used

| Function | Purpose |
|---|---|
| `normalizeUserTagsForSave` | Canonicalize raw text to `tag-{slug}` |
| `derivedProductFilterTags` | Metadata → system classification tags |
| `derivedServiceFilterTags` | Service metadata → system tags |
| `prefixedTag` | Build `{prefix}-{slug}` for any category |
| `mergeTags` | Combine arrays, deduplicate |
| `extractUserTagValues` | Pull user-visible values from `classifiedAs` |
| `updateClassifiedAs` | Replace a resource's tags on Zenflows |

## Next Steps

- [Tagging System](/guides/tagging-system) — full utility reference
- [Create Resource](/recipes/create-resource) — project creation walkthrough
- [Configuration](/guides/configuration) — setting up your environment
