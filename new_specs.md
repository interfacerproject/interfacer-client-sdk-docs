# Interfacer Client Documentation

## Technology Stack

```text
VitePress
├── Documentation site
├── Search
├── Sidebar
├── Dark mode
├── Algolia (optional)
└── GitHub Pages deployment

↓

Shiki
└── Syntax highlighting

↓

Vue Components
└── Custom interactive documentation components

↓

WebContainers
└── Executable playgrounds

↓

TypeDoc
└── Automatic API Reference generation

↓

Vitest
└── Example validation

↓

GitHub Actions
├── Build documentation
├── Test examples
└── Deploy documentation
```

---

# Documentation Requirements

## 1. Learning Path

Developers should be able to learn the SDK progressively.

```text
Introduction

Installation

Quick Start

Authentication

First Request

Advanced Usage

Recipes

API Reference
```

---

## 2. Real Examples

Examples should never be duplicated.

```text
examples/

    create-client.ts

    login.ts

    list-resources.ts

    upload-file.ts
```

The documentation should include these files directly.

Benefits:

* Examples are automatically tested.
* Documentation never becomes outdated.
* Examples become the single source of truth.

---

## 3. Interactive Playground

Every example should provide:

```text
───────────────────────────

Example

[ source code ]

▶ Run

───────────────────────────

Output

...
```

Features:

* Editable source code
* Run button
* Console output
* Copy code
* Reset example
* Shareable URL (optional)

---

## 4. API Reference

Automatically generated.

```text
Client

create()

login()

logout()

listResources()

...
```

No manually maintained API documentation.

---

## 5. Recipes

Task-oriented documentation pages.

```text
Authenticate

Create Resource

Upload Document

Handle Errors

Pagination

Caching

Retry

Streaming
```

These are typically the pages developers consult most frequently.

---

## 6. Architecture

Provide a high-level overview of the SDK.

```text
SDK

↓

HTTP Client

↓

Interfacer Services

↓

Responses
```

Simple diagrams should explain how the SDK interacts with Interfacer services.

---

## 7. Error Handling

Dedicated documentation covering:

* Error types
* Retry strategies
* Timeouts
* Authentication failures
* Best practices

---

## 8. Search

Full-text search across the documentation.

---

## 9. Dark Mode

Native support.

---

## 10. Mobile Experience

Documentation should be fully usable on mobile devices.

---

# Repository Structure

```text
interfacer-client/

├── src/

├── examples/
│   ├── getting-started.ts
│   ├── authentication.ts
│   ├── list-resources.ts
│   ├── create-resource.ts
│   └── upload.ts
│
├── docs/
│   ├── index.md
│   ├── getting-started.md
│   ├── authentication.md
│   ├── recipes/
│   ├── guides/
│   ├── api/
│   ├── public/
│   └── .vitepress/
│
├── typedoc.json
├── vite.config.ts
└── package.json
```

---

# Documentation Structure

```text
Home

Getting Started
    Installation
    Quick Start
    Authentication

Guides
    Client
    Requests
    Responses
    Errors

Recipes
    Authenticate
    CRUD Resource
    Upload
    Download
    Pagination

Examples
    Complete examples

API Reference
    Client
    Types
    Interfaces
    Enums

Changelog
```

---

# Custom Vue Components

Create reusable documentation components such as:

```text
<Playground />

<Example />

<Request />

<Response />

<ApiMethod />

<Warning />

<Info />

<Diagram />
```

In particular, `<Playground />` should provide:

* Syntax-highlighted code editor
* **Run**, **Copy**, and **Reset** actions
* Isolated execution environment (using WebContainers when appropriate)
* Output panel displaying console logs, JSON responses, or runtime errors

---

# Final Goal

The documentation should provide an exploratory learning experience.

```text
📖 Explanation

↓

📄 Real example

↓

▶ Run

↓

🖥 Output

↓

📚 API Reference
```

Every page should take approximately 5–10 minutes to read and leave developers with a fully working example that they can copy, modify, and execute immediately.

Examples should be the exact same files used by the test suite, ensuring that the documentation always stays synchronized with the SDK and remains trustworthy over time.

One enhancement I'd add is an explicit **documentation philosophy**:

* **Narrative first** — explain the "why" before the "how".
* **Examples over prose** — show working code whenever possible.
* **Single source of truth** — every snippet comes from the `examples/` directory.
* **Executable documentation** — examples can be run and modified directly in the browser.
* **Always in sync** — examples are validated in CI, preventing documentation drift.

These principles help keep the documentation maintainable as the SDK grows.

