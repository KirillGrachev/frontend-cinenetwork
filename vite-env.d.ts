/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Set to 'true' to talk to the real REST API instead of mock providers. */
    readonly VITE_API_ENABLED?: string;
    /** Base URL of the backend, e.g. https://api.cinenetwork.example */
    readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
