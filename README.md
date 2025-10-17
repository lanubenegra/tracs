# TRACS Preview (Next.js + Tailwind + TypeScript)

Preview del sitio de TRACS con Home limpio, Solutions (con internas), Industries, About (sin Carmen), Contact y Newsletter.

## Requisitos
- Node 18+
- npm

## Instalación
```bash
npm install
npm run dev
# abre http://localhost:3000
```

## Despliegue en Vercel
- Sube este repo a GitHub y en vercel.com crea un nuevo proyecto importando el repo.
- Vercel detecta Next.js automáticamente (no necesitas env vars).
- `Deploy` y listo — tendrás un link público.

## Estructura
- `src/app/TracsLivePagesApp.tsx` — toda la UI del preview.
- `src/app/page.tsx` — render principal.
- `content/ABOUT_EXTRA.md` — copys que no están renderizados (Our People, Downloads, Carmen).

## Notas
- Sin WMS en ningún texto.
- Íconos con `lucide-react` (sin CDNs externos).
- Si quieres reactivar bloques pesados (Our People/Downloads), añade sus componentes y renderízalos en About.
