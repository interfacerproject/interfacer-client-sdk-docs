---

# 📄 DOCUMENTATION PROJECT SPECIFICATION
**Project Name:** Interactive API Documentation for Interfacer Client
**Target Library:** `@dyne/interfacer-client`
**Platform:** JupyterLite (Serverless Browser-based Environment)
**Hosting:** GitHub Pages via GitHub Actions

## 1. Project Objectives
*   **Zero-Friction Onboarding:** Allow developers to experiment with the `interfacer-client` SDK entirely within their web browser.
*   **Executable Documentation:** Replace static code snippets with live, executable JavaScript cells.
*   **Architectural Clarity:** Provide a step-by-step learning path matching the SDK's internal Facade architecture (Auth, Resources, DPP, Inbox, etc.).

## 2. Technical Stack & Architecture
*   **Core Engine:** `jupyterlite-core`
*   **Execution Kernel:** `jupyterlite-javascript-kernel` (runs on a Web Worker or IFrame in the browser).
*   **Dependency Management:** Since there is no Node.js backend, NPM packages (`@dyne/interfacer-client`, `zenroom`) will be imported dynamically inside the notebooks using modern ESM (ECMAScript Modules) via a CDN like **esm.sh** or **unpkg**.
    *   *Example:* `import { InterfacerClient } from 'https://esm.sh/@dyne/interfacer-client';`
*   **Automation:** GitHub Actions for continuous integration. Every push to the `main` branch will trigger a build of the static Jupyter assets and deploy them to `gh-pages`.

## 3. Content Specification (Notebook Structure)
The documentation will be divided into modular Jupyter Notebooks (`.ipynb`), logically separated by the SDK's domain boundaries.

*   **`00_Quick_Start.ipynb`**
    *   *Goal:* Setup and basic instantiation.
    *   *Content:* Importing the library via CDN, instantiating `InterfacerClient` with dummy/sandbox endpoints (Zenflows URL, DPP URL, Wallet URL), and basic ping/status checks.
*   **`01_Authentication_and_Crypto.ipynb`**
    *   *Goal:* Demonstrate Keypairoom authentication and EdDSA signing.
    *   *Content:* Requesting HMAC shard, deriving keys from challenges (whereParentsMet, nameFirstPet, etc.), recreating keys from a seed, registering a user, and performing login.
*   **`02_Resource_Management.ipynb`**
    *   *Goal:* Managing the lifecycle of projects and physical/digital resources.
    *   *Content:* Creating projects (`createProject`), creating machines (`createMachine`), reading resources, handling relations (cite, consume, contribute), and updating metadata/tags.
*   **`03_Files_and_Hashing.ipynb`**
    *   *Goal:* Demonstrating cryptographic file handling.
    *   *Content:* Generating SHA-512 hashes using Zenroom and SHA-256 via Web Crypto API.
*   **`04_Digital_Product_Passport_DPP.ipynb`**
    *   *Goal:* Interacting with the DPP microservice.
    *   *Content:* Fetching passport data, verifying cryptographic signatures of the supply chain history.
*   **`05_Social_and_Inbox.ipynb`**
    *   *Goal:* Messaging and ActivityPub interactions.
    *   *Content:* Reading/sending messages, checking unread counts, and demonstrating social features (likes/follows).
*   **`06_Wallet_and_Tagging.ipynb`**
    *   *Goal:* Demonstrating economic and classification layers.
    *   *Content:* Querying Idea/Strength points, utilizing the classification system (tag prefixes, numeric ranges).

## 4. UI/UX & Functional Requirements
*   **Sandbox Environment:** The documentation MUST provide default, read-only Sandbox URLs for the Interfacer services so that users can execute code without needing to spin up their own Zenflows instance.
*   **State Management:** Since the browser refreshes clear the kernel state, each notebook MUST be self-contained or explicitly teach the user how to persist their `seed` or `token` in `localStorage` across notebooks.
*   **Branding:** The JupyterLite UI will be customized (via `jupyter-lite.json`) to feature the Interfacer/FabCityOS logo and brand colors.

---

# 🚀 DEVELOPMENT PLAN

## Phase 1: Infrastructure & CI/CD Setup (Days 1 - 2)
*   [ ] **1.1 Repository Creation:** Initialize a new GitHub repository (e.g., `interfacer-client-docs`).
*   [ ] **1.2 Environment Configuration:** Create `requirements.txt` containing `jupyterlite-core` and `jupyterlite-javascript-kernel`.
*   [ ] **1.3 Directory Structure:** Create the `/notebooks` folder and a `/static` folder for assets (logos, diagrams).
*   [ ] **1.4 GitHub Action Workflow:** Write `.github/workflows/deploy.yml` to build the JupyterLite site and deploy it to the `gh-pages` branch.
*   [ ] **1.5 Validation:** Push to `main`, verify the Action runs successfully, and ensure the JupyterLite interface is accessible via the GitHub Pages URL.

## Phase 2: Core Abstractions & CDN Testing (Days 3 - 4)
*   [ ] **2.1 Module Resolution Test:** Create a test notebook to ensure `https://esm.sh/@dyne/interfacer-client` and `https://esm.sh/zenroom` load correctly within the JupyterLite JS Web Worker without CORS or WASM execution errors.
*   [ ] **2.2 Sandbox Configuration:** Set up a `config.js` or define standard variables for the staging/sandbox endpoints (`zenflowsUrl`, `inbox.send`, `walletUrl`, etc.) to be used across all notebooks.
*   [ ] **2.3 Helper Snippets:** Prepare standard Markdown blocks explaining *why* CDN imports are used in this environment vs standard Node.js/NPM imports.

## Phase 3: Notebook Authoring (Days 5 - 10)
*   [ ] **3.1 Draft `00_Quick_Start.ipynb`:** Write the Markdown theory and code cells. Ensure the `InterfacerClient` config block executes cleanly.
*   [ ] **3.2 Draft `01_Authentication.ipynb`:** Create step-by-step cells for HMAC request -> Key Derivation -> Registration. *Crucial:* Add a try/catch block or clear instructions on what happens if a user tries to register an already existing email.
*   [ ] **3.3 Draft `02_Resource_Management.ipynb`:** Write cells for creating a mock Project and Machine.
*   [ ] **3.4 Draft `03_Files_and_Hashing.ipynb`:** Implement the Zenroom hashing logic. Ensure the WebAssembly part of Zenroom initializes properly in the browser.
*   [ ] **3.5 Draft `04_Digital_Product_Passport_DPP.ipynb`:** Write cells to retrieve a public DPP ID and parse the resulting JSON.
*   [ ] **3.6 Draft `05_Social_and_Inbox.ipynb` & `06_Wallet_and_Tagging.ipynb`:** Complete the remaining functional domains with practical, executable examples.

## Phase 4: Quality Assurance & UX Polish (Days 11 - 12)
*   [ ] **4.1 Cross-Browser Testing:** Run the published GitHub Pages notebooks on Chrome, Firefox, and Safari to ensure the JS Kernel and Web Workers behave correctly.
*   [ ] **4.2 Execution Flow Check:** Execute every notebook strictly from top to bottom (Cell 1 to N) to ensure no variables are left undefined.
*   [ ] **4.3 UI Customization:** Add a `jupyter-lite.json` settings file to inject the Interfacer logo into the header and set a default theme (e.g., JupyterLab Dark/Light).
*   [ ] **4.4 Diagram Integration:** Embed architectural Mermaid.js charts or static images in the Markdown cells to explain the Facade pattern visually.

## Phase 5: Launch & Handover (Days 13 - 14)
*   [ ] **5.1 Repository README:** Write a comprehensive `README.md` for the documentation repository, explaining to other contributors how to run the docs locally (e.g., `pip install -r requirements.txt && jupyter lite serve`).
*   [ ] **5.2 Cross-Linking:** Open a Pull Request on the main `interfacerproject/interfacer-client` repository to add a link pointing to the new Interactive Documentation.
*   [ ] **5.3 Release:** Announce the documentation availability to the developer community.

---
