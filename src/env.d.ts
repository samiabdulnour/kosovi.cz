interface ImportMetaEnv {
  /** Set by the preview workflows. Shows the preview bar and adds noindex. */
  readonly PUBLIC_PREVIEW_LABEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
