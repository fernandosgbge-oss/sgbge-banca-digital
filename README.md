# SGBGE Digital Ecosystem

Plataforma de banca digital para Guinea Ecuatorial. Sistema de gestión financiera seguro, rápido y transparente.

## Tecnologías

- **Frontend:** Next.js 16, React 19, TypeScript
- **Estilos:** Tailwind CSS 4
- **Backend:** Firebase
- **Estado:** Zustand, SWR
- **Formularios:** React Hook Form + Zod
- **Testing:** Vitest (unitarios), Playwright (e2e)
- **PWA:** Service Worker con soporte offline

## Funcionalidades

- 🏦 **Cuentas** - Gestión de cuentas bancarias
- 💳 **Tarjetas** - Administración de tarjetas
- 💸 **Transferencias** - Envío de dinero nacional e internacional
- 💰 **Préstamos** - Solicitud y seguimiento de préstamos
- 📊 **Inversiones** - Gestión de portafolio
- 🔔 **Notificaciones** - Alertas en tiempo real
- 🔐 **Seguridad** - Autenticación con WebAuthn/Passkeys
- 🌍 **i18n** - Soporte multiidioma

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
npm start
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Genera build de producción |
| `npm start` | Ejecuta build de producción |
| `npm run lint` | Ejecuta ESLint |

## Estructura del Proyecto

```
src/
├── app/                    # Rutas (App Router)
│   ├── api/               # API Routes
│   ├── dashboard/         # Panel principal
│   ├── accounts/          # Gestión de cuentas
│   ├── cards/             # Tarjetas
│   ├── transfers/         # Transferencias
│   ├── loans/             # Préstamos
│   └── ...
├── features/              # Módulos por funcionalidad
│   ├── auth/             # Autenticación
│   ├── banking/          # Lógica bancaria
│   ├── cards/            # Gestión de tarjetas
│   ├── i18n/             # Internacionalización
│   ├── pwa/              # Progressive Web App
│   └── ui/               # Componentes UI
├── lib/                   # Utilidades y configuración
│   ├── firebase/         # Configuración Firebase
│   └── domain/           # Lógica de dominio
└── types/                 # Definiciones TypeScript
```

## Testing

```bash
# Tests unitarios con Vitest
npx vitest

# Tests e2e con Playwright
npx playwright test
```

## Licencia

© 2026 SGBGE Digital. Todos los derechos reservados.
