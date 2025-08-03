# AGENTS.md

## Propósito  
Este archivo define las pautas que debe seguir Codex (y cualquier desarrollador/automatización) al generar o modificar código en el backend Express con TypeScript de la aplicación de cotización para vida en pareja.

El backend sigue una arquitectura **Hexagonal / Clean Architecture (Ports & Adapters)**, con separación clara entre dominio, casos de uso, infraestructura e interfaces.

---

## 1. Convenciones de nombres  
- **Clases, interfaces y tipos**: PascalCase.  
  - Ejemplo: `CreateItemUseCase`, `IUserRepository`, `BudgetDto`.  
- **Métodos y funciones**: PascalCase solo si son exportados como clases o constructores; en servicios y utilidades preferir camelCase.  
  - Ejemplo: `calculateTotalBudget`, `execute`, `handleRequest`.  
- **Variables y parámetros locales**: camelCase.  
- **Constantes**: UPPER_SNAKE_CASE o `PascalCase` si son valores de configuración exportados.  
- **Interfaces**: prefijo `I` solo si aporta claridad en el contexto (`IUserRepository`, `IAuthenticationService`).  
- **DTOs y nombres de transferencia**: sufijo `Dto` o `Payload` según conveniencia (`UserResponseDto`, `UpdateItemPayload`).  
- **Errores personalizados**: sufijo `Error` (`BudgetExceededError`, `UnauthorizedError`).

---

## 2. Principios SOLID  
Se **aplican sin excepción**:  
1. **Single Responsibility** – Cada clase o módulo tiene una única razón de cambio.  
2. **Open/Closed** – Se extienden comportamientos sin modificar código existente (ej. a través de abstracciones e inyección de dependencias).  
3. **Liskov Substitution** – Implementaciones deben ser intercambiables con sus contratos/abstracciones.  
4. **Interface Segregation** – Interfaces pequeñas y específicas.  
5. **Dependency Inversion** – El código de alto nivel depende de abstracciones, no de implementaciones concretas.

---

## 3. Organización / Estructura (Hexagonal / Clean)

```
src/
├── domain/                    # Entidades, valores, lógica de negocio pura
│   ├── models/                # User, Home, Item, Budget, Changelog
│   ├── errors/                # Errores del dominio (ej. BudgetExceededError)
│   └── services/              # Lógica de negocio que no encaja en un use case
│
├── application/               # Casos de uso (use-cases)
│   └── use-cases/             # Ej: CreateItemUseCase.ts, UpdateBudgetUseCase.ts
│
├── infrastructure/           # Adaptadores externos
│   ├── persistence/           # Repositorios MongoDB (implementaciones de interfaces)
│   ├── auth/                  # JWT, OAuth adapters
│   ├── websocket/             # WebSocket / eventos en tiempo real
│   ├── currency/              # Cliente de API de tipo de cambio
│   └── logger/                # Logging (p. ej. Winston, Pino)
│
├── interfaces/                # Gateways / Controllers
│   ├── http/                  # Rutas Express, controladores
│   ├── middleware/            # Auth guards, error handlers, validation
│   └── dto/                   # DTOs de entrada/salida, mappers
│
├── config/                    # Configuración centralizada (entorno, variables, carga)
├── shared/                   # Utilidades comunes, tipos compartidos
├── server.ts                 # Punto de entrada (bootstrap)
```

- Las capas `domain` y `application` no conocen de Express ni de MongoDB.  
- Las interfaces dependen de abstracciones del dominio y application.  
- Los adaptadores (infrastructure) implementan las interfaces requeridas por los casos de uso.

---

## 4. Patrones y buenas prácticas  
- **Repository Pattern**: abstrae acceso a datos; define interfaces en dominio o aplicación, implementaciones en `infrastructure/persistence`.  
- **Use Case / Interactor**: encapsula una operación de negocio por caso de uso.  
- **Factory**: para construir objetos complejos del dominio si se requiere validación/normalización.  
- **Adapter / Strategy**: cuando hay múltiples proveedores (ej. distintas fuentes de tipo de cambio, distintos métodos de notificación).  
- **Decorator**: opcional para cross-cutting concerns como logging o métricas si se necesita dinamismo.  
- **Command Query Separation**: separar operaciones que mutan estado de las que solo consultan.  
- **Error Handling Centralizado**: transformar errores de dominio en respuestas HTTP coherentes.  
- **Validation Layer**: validar entrada en los DTOs antes de ejecutar casos de uso (usando bibliotecas como Zod, class-validator o similar).

---

## 5. API y comunicación  
- Seguir principios REST para endpoints HTTP:  
  - Versionado en la ruta: `/api/v1/homes`  
  - Uso correcto de verbos: GET, POST, PUT/PATCH, DELETE  
  - Códigos de estado semánticos.  
  - HATEOAS opcional si se expande (no obligatorio en MVP).  
- Respuestas uniformes con envoltorio estándar (ej. `data`, `error`, `meta`).  
- Paginación y filtros en listados.  
- Throttling y rate limiting si se anticipa abuso.

---

## 6. Autenticación y autorización  
- **JWT** para sesiones, con expiración y refresh token si aplica.  
- Soporte para **OAuth (Google)** mediante adapter.  
- **Scopes / Claims** bien definidos para separar accesos (ej. solo miembros del hogar pueden ver/modificar).  
- Middleware de autorización reutilizable.  

---

## 7. Manejo de monedas  
- Servicio de conversión desacoplado (puede usarse Strategy para intercambiar proveedor).  
- Moneda base del hogar y conversiones para visualización.  
- Cache inteligente de tasas si la fuente lo permite (invalidar cada X minutos según frescura requerida).

---

## 8. Logging y observabilidad  
- Logging estructurado (JSON) con niveles (info, warn, error, debug).  
- Correlación de requests (request id) para trazar flujos.  
- Métricas básicas expuestas (latencia, errores por endpoint).  
- Integración opcional con sistemas externos (Prometheus, Sentry).  

---

## 9. Manejo de errores  
- Errores tipados y personalizados en dominio.  
- Traducción a HTTP en un middleware central:  
  - Ej: `ValidationError` -> 400, `UnauthorizedError` -> 401, `NotFoundError` -> 404.  
- No exponer trazas en producción (salvo logging interno).  
- Fallback genérico para errores no previstos.  

---

## 10. Seguridad  
- Sanitización y validación de entradas.  
- Protección contra inyección (usar parámetros en consultas de Mongo y validaciones estrictas).  
- Rate limiting y protección básica contra DDoS.  
- CORS configurado estricto por origen.  
- Gestión segura de secretos (no hardcodear, usar vault o variables de entorno).  
- Headers de seguridad (Helmet u equivalente).  

---

## 11. Testing  
- **Unit tests**: domain, use-cases, servicios aislados (mock de repositorios).  
- **Integration tests**: rutas HTTP completas con base de datos en memoria o sandbox (ej. Mongo Memory Server).  
- **End-to-end**: flujos críticos (autenticación, creación de ítems, presupuesto).  
- Fixtures y factories para entidades.  
- Tests deben ser deterministas y rápidos; evitar dependencias externas no controladas durante pruebas (mockear API de tipo de cambio, OAuth, etc.).

---

## 12. Rendimiento  
- Evitar consultas N+1.  
- Proyecciones en consultas (no traer más campos de los necesarios).  
- Índices en MongoDB según filtros frecuentes.  
- Operaciones de escritura batched cuando tenga sentido.  
- Cache cuando la consistencia lo permita (ej. resultados de lectura pesada).

---

## 13. Mantenibilidad  
- Cada caso de uso y repositorio tiene su prueba y su interfaz clara.  
- Refactorizar con seguridad: mantener cobertura mínima en áreas críticas antes de reescribir.  
- Depuración fácil: logs con contexto suficiente y errores legibles.  

---

## 14. Flujo de trabajo recomendado  
1. Clonar o actualizar el repositorio.  
2. Leer este AGENTS.md antes de hacer cambios.  
3. Instalar y levantar entorno:  
   ```bash
   npm ci
   npm run build
   npm run lint
   npm run test
   ```  
4. Trabajar en rama con nombre claro (`feature/create-item-usecase`, `fix/auth-middleware`).  
5. Commits pequeños y descriptivos (imperativos).  
6. Abrir PR con descripción, referencia a issue y qué se probó.  
7. Validar que:  
   - Lint y tests pasen.  
   - No hay deuda técnica nueva sin justificación.  
   - Se actualizan tests si el comportamiento cambió.  
8. Merge tras revisión y aprobación.

---

## 15. Tooling y convenciones  
- **Linting**: ESLint con configuración para TypeScript estricta.  
- **Formateo**: Prettier integrado; evitar conflictos con ESLint (usar combinación recomendada).  
- **Env files**: `.env.example` con variables necesarias.  
- **Commit hooks**: lint-staged + Husky para tests/lint pre-commit.  
- **CI/CD**:  
  - Ejecutar linter, tests y build en cada PR.  
  - Escanear vulnerabilidades de dependencias.  

---

## 16. Ejemplos de nombres de archivos  
- `create-item.usecase.ts`  
- `item.repository.ts`  
- `mongo-item.repository.ts`  
- `item.controller.ts`  
- `auth.middleware.ts`  
- `currency-converter.service.ts`  
- `changelog.factory.ts`  
- `error-handler.middleware.ts`  

