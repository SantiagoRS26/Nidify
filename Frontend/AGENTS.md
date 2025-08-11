# AGENTS.md

## Propósito  
Este archivo define las pautas que debe seguir Codex (y cualquier desarrollador/automatización) al generar o modificar código en el frontend Angular de la aplicación de cotización para vida en pareja.

El frontend sigue una arquitectura **Clean / Feature-based modular**, con énfasis en separación de responsabilidades, escalabilidad y colaboratividad con estado reactivo.

---

## 1. Convenciones de nombres  
- **Clases, componentes, directivas, servicios, interfaces y tipos:** PascalCase.  
  - Ejemplo: `ItemCardComponent`, `BudgetService`, `UserProfile`, `ChangelogEntry`.
- **Variables locales, parámetros, propiedades privadas y referencias a instancias:** camelCase.  
  - Ejemplo: `selectedItem`, `userPreferences`, `isVisible`.
- **Nombres claros y descriptivos.**  
  - ❌ `data`, `temp`, `x`  
  - ✅ `userBudget`, `itemPriority`, `monthlyServiceCost`
- **Prefijos/Sufijos con sentido**: sólo si aportan contexto (`AuthGuard`, `ItemDto`, `updateServiceCost`).

---

## 2. Principios arquitectónicos y de diseño  
### SOLID aplicado en TypeScript/Angular
- **S**ingle Responsibility: cada servicio, componente o clase hace una sola cosa bien definida.  
- **O**pen/Closed: se extiende sin modificar, por ejemplo usando inyección de dependencias y abstracciones.  
- **L**iskov: los derivados (ej. implementaciones de interfaces) se deben comportar como sus contratos.  
- **I**nterface Segregation: preferir varias interfaces pequeñas (ej. `ICurrencyConverter`, `IItemRepository`) frente a una gigante.  
- **D**ependency Inversion: depender de abstracciones (interfaces, tokens de inyección) y no de implementaciones concretas directamente.

---

## 3. Organización / Estructura  
Feature-based, cada funcionalidad vive en su propio módulo autocontenido:

```
src/
└── app/
    ├── core/                  # Servicios globales, interceptors, guards, modelos base
    ├── shared/                # Componentes reutilizables, pipes, utilidades, tipos comunes
    ├── features/
    │   ├── auth/              # Login, OAuth, gestión de sesión
    │   ├── home/              # Gestión del hogar (pareja), presupuesto base
    │   ├── items/             # CRUD de ítems, estados, prioridad, división de pago
    │   ├── budget/            # Presupuesto inicial y mensual
    │   ├── changelog/         # Historial de cambios
    │   └── settings/          # Preferencias (moneda, perfil, etc.)
    ├── state/                 # (Opcional) NgRx o patrón reactivo con RxJS
    ├── app-routing.module.ts
    └── app.component.ts
```

- **Lazy loading**: Cargar módulos de feature solo cuando se necesitan.  
- **OnPush change detection**: Usar en componentes que no dependen de mutaciones no controladas para mejorar performance.  
- **Responsabilidad clara**: Componentes para presentación, contenedores para orquestación si aplica.

---

## 4. Patrones y buenas prácticas  
- **Facade / Query Service** para encapsular operaciones complejas de varias fuentes.  
- **Repository-like services** para abstraer acceso a data remota/local.  
- **Strategy / Adapter** cuando cambie el proveedor (ej. múltiples APIs de tipo de cambio).  
- **Reactive patterns con RxJS**: evitar suscripciones sin manejar ciclo de vida (usar `takeUntil`, `async` pipe).  
- **Evitar lógica de negocio pesada en templates.**  
- **Separation of concerns**: UI vs lógica vs efectos secundarios.  
- **No reinventar la rueda**: usar utilidades de Angular y librerías maduras cuando aporten sin añadir bloat innecesario.

---

## 5. Estado y sincronización  
- Si se usa algún manejador de estado (NgRx u otro), que siga:
  - Acciones claramente nombradas (`loadItems`, `updateBudgetSuccess`).  
  - Selectores para lectura, composición mínima.  
  - Efectos separados de reducers.  
- Para colaboración en tiempo real:  
  - Mantener sincronía con WebSocket o servicio de eventos, desacoplado detrás de un service reactivo.  
  - Conflictos mínimos: mostrar diferencias/alertas si hay ediciones simultáneas en el mismo campo.

---

## 6. Rendimiento  
- **Lazy load** de módulos y assets.  
- **Change detection OnPush** donde aplica.  
- **Debounce/Throttle** en inputs de alto volumen (ej. búsqueda o edición en vivo).  
- **Evitar re-renderizados innecesarios**: usar `trackBy` en `*ngFor`.  
- **Evitar suscripciones redundantes.**  
- **Carga de imágenes optimizada** (p. ej. carga diferida para fotos de ítems).  

---

## 7. Accesibilidad y UX  
- Todos los componentes interactivos deben ser navegables por teclado.  
- Etiquetas ARIA donde sean necesarias.  
- Contraste adecuado y feedback claro en errores/alertas.  
- Formularios con validación declarativa y mensajes útiles.  

---

## 8. Internacionalización y formato  
- Soporte para múltiples monedas y formatos numéricos.  
- Abstraer formateo de moneda/fechas en servicios reutilizables.  
- Utilizar el pipe `currencyFormat` para mostrar montos con separadores de miles.
- Evitar hardcodear strings: preparar para i18n si se expande.  

---

## 9. Seguridad en el frontend  
- Validar y sanitizar entradas mínimas antes de enviarlas.  
- No confiar en el cliente para reglas críticas (todas las validaciones definitivas en backend).  
- Manejo seguro de tokens (ej. almacenamiento adecuado, expiración, renovación).  
- Protección contra XSS en bindings (usar bindings seguros de Angular).  

---

## 10. Testing  
- **Unit tests**: para servicios, pipes, utilidades, lógica pura.  
- **Component tests**: enfocados en inputs/outputs, estados visuales.  
- **E2E** (opcional en MVP) para flujos críticos (login, agregar ítem, ver presupuesto).  
- Cobertura razonable en zonas críticas (presupuesto, división de pago, histórico).  
- Tests idempotentes y rápidos.

---

## 11. Mantenibilidad  
- Cada feature encapsula: componentes, estilos, servicios y pruebas.  
- Eliminar código muerto periódicamente.  
- Documentar excepciones y decisiones no triviales en comentarios o en el README de cada módulo si hace falta.  

---

## 12. Flujo de trabajo recomendado  
1. Clonar o actualizar el repositorio.  
2. Revisar este AGENTS.md antes de escribir o modificar código.  
3. Instalar dependencias y ejecutar entorno:  
   ```bash
   npm ci
   npm run build       # build incremental
   npm run test        # pruebas unitarias
   npm run lint        # verificaciones de estilo
   ```  
4. Trabajar en una rama con nombre claro (ej: `feature/items-priority` o `fix/budget-warning`).  
5. Hacer commits pequeños, con mensajes descriptivos (imperativos, p. ej. “Agrega validación de presupuesto excedido”).  
6. Abrir PR con descripción del cambio, referencia al ticket/issue y capturas si aplican.  
7. Asegurarse de que:
   - Todas las comprobaciones (lint, tests) pasen.  
   - No se introducen dependencias innecesarias.  
   - Se actualizan o agregan tests si el cambio lo requiere.  
8. Merge solo después de revisión y aprobación.  

---

## 13. Tooling y convenciones adicionales  
- **Linting**: ESLint con reglas estrictas adaptadas a TypeScript y Angular.  
- **Formateo**: Prettier (configurado para no chocar con ESLint).  
- **TailwindCSS**: clases utilitarias en templates, evitar inline styles redundantes; usar componentes reutilizables para combinaciones complejas.  
- **Commit hooks** (opcional): para lint y tests previos a commit.  

---

## 14. Ejemplo de nomenclatura de archivos  
- `item-card.component.ts`  
- `item-card.component.html`  
- `items.service.ts`  
- `budget.facade.ts`  
- `changelog-entry.model.ts`  
