---
layout: doc
---

<script setup>
const githubDemo = `// Import project metadata from a GitHub repository URL
// Requires: client with oshUrl configured (optional)

console.log('// Import from GitHub:');
console.log('const data = await client.import');
console.log('  .importFromGithub(');
console.log('    "https://github.com/user/repo"');
console.log('  );');
console.log('');
console.log('// Returns ImportedProjectData:');
console.log('//  main.title:      repo name');
console.log('//  main.link:       repo URL');
console.log('//  main.description: description or README');
console.log('//  main.tags:       GitHub topics');
console.log('//  licenses:        SPDX license ID');
console.log('');
console.log('// Uses public GitHub API — no auth needed';`;

const gitlabDemo = `// Import project metadata from GitLab
const data = await client.import.importFromGitlab(
  "https://gitlab.example.com",
  "42"   // project ID
);

console.log('GitLab import result:');
console.log('  title:', data.main.title);
console.log('  link:', data.main.link);
console.log('  tags:', data.main.tags);

console.log('');
console.log('// Note: GitLab import does not fetch licenses';`;

const oshDemo = `// Check OSH (Open Source Hardware) compliance
const isOsh = await client.import.analyzeRepoForOsh(
  "https://github.com/user/repo"
);

console.log('OSH compliant:', isOsh);
console.log('');
console.log('// Configuration: oshUrl from proxyUrl');
console.log('// proxyUrl + /osh -> oshUrl/analyze';
console.log('// Returns: ok: true or false');`;

const fullDemo = `// Complete import -> project creation flow
// Used in the Interfacer GUI

// 1. Import from GitHub
const data = await client.import.importFromGithub(repoUrl);

// 2. Normalize tags from GitHub topics
import { userTag } from '@dyne/interfacer-client';
const tags = data.main.tags
  .map(t => userTag(t))
  .filter(Boolean);

// 3. Check OSH compliance
const isOsh = await client.import.analyzeRepoForOsh(repoUrl);

// 4. Create the project with imported data
const project = await client.resources.createProject({
  projectType: ProjectType.DESIGN,
  name: data.main.title,
  note: data.main.description,
  tags: tags,
  repo: data.main.link,
  license: data.licenses[0]?.licenseId || "",
});

console.log('Project created:', project.id);
console.log('OSH compliant:', isOsh);`;
</script>

# Import from GitHub & GitLab

The import client auto-populates project creation forms by fetching metadata from GitHub and GitLab repositories. It also provides OSH (Open Source Hardware) compliance checking.

## Import from GitHub

Fetches repository name, description, topics (as tags), and SPDX license:

<!-- <Playground label="GitHub Import" :code="githubDemo" /> -->

The method parses a GitHub URL into `owner/repo` and queries:
1. **Repository metadata** — `/repos/{owner}/{repo}` → `name`, `description`, `html_url`, `topics`
2. **License** — `/repos/{owner}/{repo}/license` → `license.spdx_id`
3. **README** — `/repos/{owner}/{repo}/readme` → raw text (fallback description)

## Import from GitLab

Fetches project metadata from a GitLab instance:

<!-- <Playground label="GitLab Import" :code="gitlabDemo" /> -->

Uses the GitLab v4 API: `{host}/api/v4/projects/{projectId}`.

## Open Source Hardware Check

Verify OSH compliance through the OSH analysis service:

<!-- <Playground label="OSH Check" :code="oshDemo" /> -->

## Full Import → Create Flow

Combine import with project creation for a full auto-population workflow:

<!-- <Playground label="Full Flow" :code="fullDemo" /> -->

## Configuration

| Field | Required for |
|-------|-------------|
| `oshUrl` | `analyzeRepoForOsh` |
| (none) | `importFromGithub` (uses public GitHub API) |
| (none) | `importFromGitlab` (uses target GitLab instance API) |

The `importFromGithub` and `importFromGitlab` methods use public REST APIs — no API keys needed for public repositories.

## Return Type: `ImportedProjectData`

```ts
interface ImportedProjectData {
  main?: {
    title: string;         // repo name
    link: string;          // repo URL
    description: string;   // description or README excerpt
    tags: string[];        // GitHub topics or GitLab tag_list
  };
  licenses?: Array<{
    scope: string;
    licenseId: string;     // SPDX identifier (e.g. "CC-BY-SA-4.0")
  }>;
}
```

## Next Steps

- [Create Resource](/recipes/create-resource) — using imported data to create projects
- [Tagging System](/guides/tagging-system) — normalizing imported tags
- [API: ImportClient](/api/classes/ImportClient) — full method reference
