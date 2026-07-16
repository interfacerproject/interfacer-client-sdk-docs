---
layout: doc
---

<script setup>
const designDemo = `import { ProjectType } from '@dyne/interfacer-client';

// Create a Design (software, 3D model, schematic)
console.log('const project = await client.resources.createProject({');
console.log('  projectType: ProjectType.DESIGN,');
console.log('  name: "Smart Sensor v2",');
console.log('  note: "Open source environmental monitor",');
console.log('  tags: ["tag-3d-printing", "tag-iot-sensor"],');
console.log('  repo: "https://github.com/user/smart-sensor",');
console.log('  license: "CC-BY-SA-4.0",');
console.log('});');
console.log('// -> { id, name }';

console.log('');
console.log('// A process and location are auto-created');
console.log('// unless you pass pre-created IDs';`;

const productDemo = `import { ProjectType } from '@dyne/interfacer-client';

// Create a Product with machine, material, and filter tags
const product = await client.resources.createProject({
  projectType: ProjectType.PRODUCT,
  name: "Eco Sensor Kit",
  note: "Assembled environmental sensor kit",
  tags: [
    "tag-eco-friendly",
    "category-electronics",
    "powercompat-usb-c",
    "recyclability-ge-80",
    "machine-laser-cutter",
    "material-pla",
  ],
  repo: "https://github.com/user/eco-sensor",
  license: "CC-BY-SA-4.0",
});

console.log('Product created:', product.id);

// Optionally, cite the design it was derived from:
const processId = await client.resources.createProcess(
  "citing reference design"
);
await client.resources.citeResource(designId, processId);`;

const machineDemo = `import { ProjectType } from '@dyne/interfacer-client';

// Create a Machine (manufacturing equipment, tool)
const machine = await client.resources.createMachine({
  name: "Laser Cutter Pro",
  note: "40W CO2 laser cutter, 600x400mm bed",
  metadata: {
    specifications: {
      powerW: 40,
      bedSizeMm: [600, 400],
      laserType: "CO2",
    },
  },
});

console.log('Machine created:', machine.id);`;
</script>

# Create Resource

Resources are the foundation of the Interfacer ecosystem — Designs, Products, Services, Machines, and DPPs. All are created through `client.resources`.

## Project Types

| Type | `ProjectType` | Description |
|------|---------------|-------------|
| Design | `ProjectType.DESIGN` | Blueprint, 3D model, software |
| Product | `ProjectType.PRODUCT` | Manufacturable item |
| Service | `ProjectType.SERVICE` | Offered service |
| Machine | (via `createMachine`) | Manufacturing equipment |
| DPP | (via `createDppResource`) | Digital Product Passport |

## Create a Design

<Playground label="Design" :code="designDemo" />

**Auto-created:** A `Process` (tracking the creation event) and a `Location` (if location params are provided) are created automatically. Pass pre-created IDs via `processId` and `locationId` to avoid duplicates.

## Create a Product

Products reference tags for classification and can cite the design they derive from:

<Playground label="Product" :code="productDemo" />

See [Apply Tags & Filters](/recipes/apply-tags-and-filters) for the full tag assembly pipeline used in production.

## Create a Machine

Machines are created with a separate method and spec:

<Playground label="Machine" :code="machineDemo" />

## Create a DPP-Resource Link

After creating a DPP passport, link it to a Zenflows resource:

```ts
const dpp = await client.dpp.createDpp({ ... });

const dppResource = await client.resources.createDppResource({
  name: `DPP for Smart Sensor`,
  dppUlid: dpp.id,
});
```

## `CreateProjectParams`

| Field | Type | Description |
|-------|------|-------------|
| `projectType` | `ProjectType` | Must be DESIGN, PRODUCT, or SERVICE |
| `name` | `string` | Resource name |
| `note` | `string?` | Description |
| `tags` | `string[]?` | Prefixed classification tags |
| `repo` | `string?` | Source code / design file URL |
| `license` | `string?` | SPDX license ID |
| `images` | `Array?` | Zenflows file descriptors |
| `location` | `Object?` | Geolocation for physical items |
| `locationId` | `string?` | Pre-created location ULID |
| `processId` | `string?` | Pre-created process ULID |
| `metadata` | `Record?` | Arbitrary JSON metadata |

## Relations

Link resources together through the creation process:

```ts
const processId = await client.resources.createProcess("connecting resources");

// Cite: "This design was used"
await client.resources.citeResource(citedId, processId);

// Consume: "This material was consumed"
await client.resources.consumeResource(materialId, processId);

// Contribute: "This person contributed"
await client.resources.contributeToResource(processId, contributionTypeSpecId);
```

## Updating

```ts
// Update metadata
await client.resources.updateMetadata(resourceId, { contributors: [...] });

// Replace tags
await client.resources.updateClassifiedAs(resourceId, ["tag-new-category"]);
```

## Next Steps

- [Apply Tags & Filters](/recipes/apply-tags-and-filters) — full tag assembly
- [Tagging System](/guides/tagging-system) — classification reference
- [DPP Create & Query](/recipes/dpp-create-and-query) — passport lifecycle
