// Prefixes public asset paths with the deployment base URL so the site works
// both locally ("/") and on GitHub Pages ("/lora-bday/").
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '')
