# Reserva de salas USM

## Requisitos

- **Node.js LTS (>= 18.17)** — recomendado **20.x** o superior.
- Gestor de paquetes: **pnpm** (recomendado). También funciona **npm** o **yarn**.
- (Opcional) **Git** si vas a clonar el repo.

### Instalación rápida

**Para Windows (PowerShell)**

- Node LTS
winget install OpenJS.NodeJS.LTS -s winget

- Habilitar pnpm sin instalar globalmente (Corepack)
corepack enable
corepack prepare pnpm@latest --activate

-Si PowerShell bloquea scripts
 pnpm.cmd -v

**Para macOS / Linux**

- Con nvm 
nvm install 20 && nvm use 20

- Habilitar pnpm (Corepack)
corepack enable
corepack prepare pnpm@latest --activate

# Verifica que este ok
node -v
pnpm -v   # o npm -v / yarn -v


*HECHO EN BASE A PROTOTIPO GENERADO POR [v0.app](https://v0.app)*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ipadedante-6049s-projects/v0-professor-booking-interface)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/iXNDpAaMJIu)

