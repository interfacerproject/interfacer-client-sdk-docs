# Create Resource

Create projects, machines, and DPP-linked resources.

## Design Project

```ts
const design = await client.resources.createProject({
  projectType: "DESIGN",
  name: "My Open Source Design",
  note: "A community-driven hardware design",
  tags: ["open-source", "3d-printing"],
  license: "CERN-OHL-S-2.0",
  repo: "https://github.com/user/repo",
  metadata: { version: "1.0.0" },
});
```

## Product Project

```ts
const product = await client.resources.createProject({
  projectType: "PRODUCT",
  name: "3D Printed Enclosure",
  note: "Snap-fit enclosure for IoT boards",
  tags: ["enclosure", "pla"],
  license: "CERN-OHL-P-2.0",
  metadata: { material: "PLA", printTime: "4h" },
});
```

## Service Project

```ts
const service = await client.resources.createProject({
  projectType: "SERVICE",
  name: "PCB Assembly",
  note: "Professional PCB assembly, 2-week turnaround",
  tags: ["pcb", "assembly"],
  metadata: { turnaroundDays: 14 },
});
```

## Machine

```ts
const machine = await client.resources.createMachine({
  name: "Bambu Lab X1 Carbon",
  note: "Multi-material 3D printer",
  metadata: { buildVolume: "256x256x256mm" },
});
```

## DPP Resource

```ts
const dppResource = await client.resources.createDppResource({
  name: "Smart Home Hub DPP",
  dppUlid: "01J...", // From DPP service
});
```

## With Location

```ts
const location = await client.resources.createLocation({
  name: "Fab Lab Barcelona",
  address: "Carrer de Pujades, 102, 08005 Barcelona",
  lat: 41.4015,
  lng: 2.1986,
});

const project = await client.resources.createProject({
  projectType: "DESIGN",
  name: "Design with Location",
  location: { name: location.name },
  locationId: location.id,
});
```

## Reading Resources

```ts
const resource = await client.resources.getResource(id);
const projects = await client.resources.getProjects();
const machines = await client.resources.getMachines();

// Paginated
const page = await client.resources.listResources({}, { first: 10 });
```

## Updating

```ts
// Metadata
await client.resources.updateMetadata(resourceId, {
  version: "2.0.0",
  contributors: [{ name: "Alice", role: "Designer" }],
});

// Tags
await client.resources.updateClassifiedAs(resourceId, [
  "tag-open-source",
  "tag-3d-printing",
]);
```

## Error Recovery

| Scenario | Fix |
|----------|-----|
| `Not authenticated` | Run auth flow first |
| Spec ID not found | Check `instanceVariables` or provide `specs` in config |
| Empty tags fail | Omitting `tags` is OK; passing `[]` may cause backend errors |
