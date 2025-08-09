# Autenticación Segura - Implementación

## 🔐 Medidas de Seguridad Implementadas

### 1. **No almacenamiento en localStorage**

- Los access tokens **NUNCA** se guardan en `localStorage`
- Solo viven en memoria durante la sesión activa del navegador
- Se eliminan automáticamente al cerrar/recargar la página

### 2. **HttpOnly Cookies para Refresh Tokens**

- Los refresh tokens se almacenan en cookies `httpOnly`
- No son accesibles desde JavaScript (protección XSS)
- Se envían automáticamente con `withCredentials: true`

### 3. **Silent Refresh Automático**

- Al cargar la aplicación, se intenta un refresh automático
- Si hay un refresh token válido, se obtiene un nuevo access token
- Si falla, se limpia la sesión automáticamente

### 4. **Renovación Programada**

- Los tokens se renuevan automáticamente antes de expirar
- Sistema de backoff exponencial en caso de errores
- Limpieza automática de timeouts

## 🛡️ Beneficios de Seguridad

### ✅ Protección contra XSS

- Los access tokens no son accesibles desde scripts maliciosos
- Los refresh tokens están en cookies httpOnly

### ✅ Sesiones de Corta Duración

- Los access tokens expiran rápidamente
- Renovación automática sin intervención del usuario

### ✅ Gestión Automática de Estado

- No hay tokens "colgados" en localStorage
- Limpieza automática al cerrar navegador

## 🔄 Flujo de Autenticación

1. **Login**: Usuario → Access Token (memoria) + Refresh Token (httpOnly cookie)
2. **Requests**: Access Token en header `Authorization: Bearer <token>`
3. **Renovación**: Automática antes de expirar usando refresh token
4. **Logout**: Limpieza completa de tokens y cookies
5. **Recarga**: Silent refresh automático al inicializar

## 📋 Compatibilidad

- ✅ Funciona en todos los navegadores modernos
- ✅ Compatible con SSR/Angular Universal
- ✅ No requiere cambios en el backend existente
- ✅ Mantiene la experiencia de usuario fluida


Diagrama de secuencia:

sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant C as HttpOnly Cookie

    Note over F,B: 🔐 Autenticación Segura - Flujo Completo

    rect rgb(240, 248, 255)
        Note over U,C: Login Inicial
        U->>F: Credenciales
        F->>B: POST /auth/login
        B->>C: Set HttpOnly Cookie (Refresh Token)
        B->>F: Access Token (JSON)
        F->>F: Store in Memory ONLY
    end

    rect rgb(240, 255, 240)
        Note over U,C: Recarga de Página
        U->>F: Refresh Browser
        F->>F: Access Token = null (memoria limpia)
        F->>F: APP_INITIALIZER ejecuta
        F->>B: POST /auth/refresh (cookie automática)
        B->>F: Nuevo Access Token
        F->>F: Store in Memory ONLY
    end

    rect rgb(255, 248, 240)
        Note over U,C: Request Autenticada
        F->>B: API Request + Authorization Header
        B->>F: Response Data
    end

    rect rgb(255, 240, 240)
        Note over U,C: Token Expirado
        F->>B: API Request (token expirado)
        B->>F: 401 Unauthorized
        F->>B: POST /auth/refresh (automático)
        B->>F: Nuevo Access Token
        F->>B: Retry Request Original
        B->>F: Success Response
    end

    rect rgb(248, 240, 255)
        Note over U,C: Logout
        U->>F: Logout Action
        F->>F: Clear Memory Token
        F->>B: POST /auth/logout
        B->>C: Clear HttpOnly Cookie
        F->>U: Redirect to Login
    end