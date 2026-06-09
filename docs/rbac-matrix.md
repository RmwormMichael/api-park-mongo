# RBAC Matrix — SENA ParkControl API

> Última actualización: Sprint 1 — Seguridad base

## Roles del sistema

| ID | Nombre | Alias en código |
|---|---|---|
| 1 | Administrador | `ROLE_IDS.ADMIN` |
| 2 | Instructor | `ROLE_IDS.INSTRUCTOR` |
| 3 | Aprendiz | `ROLE_IDS.USER` |
| 4 | Visitante | `ROLE_IDS.VISITOR` |
| 5 | Vigilante | `ROLE_IDS.GUARD` |

## Convenciones

| Símbolo | Significado |
|---|---|
| ✅ | Acceso permitido (vía middleware `authorize`) |
| 🛡️ | Ownership verificado (solo dueño del recurso, Administrador bypassea) |
| ❌ | Acceso denegado |
| — | No aplica (ruta pública sin autenticación) |

Los roles se especifican por su nombre (ej: `'Administrador'`) o ID numérico (ej: `1`). El middleware `authorize` normaliza ambos mediante `normalizeRole()` en `constants/permissions.js`.

---

## Matriz de endpoints

### `/api/auth`

| Endpoint | Método | Admin | Instructor | Aprendiz | Visitante | Vigilante | Ownership | Notas |
|---|---|---|---|---|---|---|---|---|
| `/api/auth/login` | POST | ✅ | ✅ | ✅ | ✅ | ✅ | — | Público. Sin autenticación. |
| `/api/auth/register` | POST | ❌ | ✅ | ✅ | ✅ | ❌ | — | Público. Solo roles 2, 3, 4 permitidos (validado en controlador). |

### `/api/users`

| Endpoint | Método | Admin | Instructor | Aprendiz | Visitante | Vigilante | Ownership | Notas |
|---|---|---|---|---|---|---|---|---|
| `/api/users` | GET | ✅ | ❌ | ❌ | ❌ | ❌ | — | Lista completa de usuarios. |
| `/api/users/:id` | GET | ✅🛡️ | ✅🛡️ | ✅🛡️ | ✅🛡️ | ✅🛡️ | `params.id` === `req.user.id` | Admin ve cualquier perfil. Otros roles solo el suyo propio. |
| `/api/users/:id/vehicles` | GET | ✅🛡️ | ✅🛡️ | ✅🛡️ | ✅🛡️ | ✅🛡️ | `params.id` === `req.user.id` | Vehículos de un usuario específico. |
| `/api/users/:id` | PUT | ✅🛡️ | ✅🛡️ | ✅🛡️ | ✅🛡️ | ✅🛡️ | `params.id` === `req.user.id` | Actualiza perfil + foto. |
| `/api/users/:id` | DELETE | ✅🛡️ | ❌ | ❌ | ❌ | ❌ | `params.id` === `req.user.id` | Solo Admin. Puede eliminar su propia cuenta o la de otros. |

### `/api/vehicles`

| Endpoint | Método | Admin | Instructor | Aprendiz | Visitante | Vigilante | Ownership | Notas |
|---|---|---|---|---|---|---|---|---|
| `/api/vehicles` | POST | ✅ | ✅ | ✅ | ✅ | ✅ | — | Crea vehículo asociado al usuario autenticado (`req.user.id`). |
| `/api/vehicles/user` | GET | ✅ | ✅ | ✅ | ✅ | ✅ | — | Lista vehículos del usuario autenticado. |
| `/api/vehicles` | GET | ✅ | ❌ | ❌ | ❌ | ✅ | — | Lista completa de vehículos. |
| `/api/vehicles/:id` | DELETE | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | Solo Admin y Vigilante. El dueño del vehículo **no** puede eliminarlo. Regla de negocio confirmada. |

### `/api/movimientos`

| Endpoint | Método | Admin | Instructor | Aprendiz | Visitante | Vigilante | Ownership | Notas |
|---|---|---|---|---|---|---|---|---|
| `/api/movimientos/entrada` | POST | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | Registro operativo. Sin ownership. |
| `/api/movimientos/salida` | POST | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | Registro operativo. Sin ownership. |
| `/api/movimientos/range` | GET | ✅ | ✅\* | ✅\* | ✅\* | ✅ | 🛡️\* | Admin/Vigilante ven todos. Roles básicos ven solo sus movimientos (filtro en controlador, no en middleware). |
| `/api/movimientos` | GET | ✅ | ❌ | ❌ | ❌ | ✅ | — | Lista completa de movimientos (sin filtro de fechas). |
| `/api/movimientos/dentro` | GET | ✅ | ❌ | ❌ | ❌ | ✅ | — | Vehículos actualmente dentro del parqueadero. |

\* El controlador `listByRange` filtra por vehículos del usuario si `idRolName` no es Administrador ni Vigilante.

### `/api/notificaciones`

| Endpoint | Método | Admin | Instructor | Aprendiz | Visitante | Vigilante | Ownership | Notas |
|---|---|---|---|---|---|---|---|---|
| `/api/notificaciones/user/:userId` | GET | ✅🛡️ | ✅🛡️ | ✅🛡️ | ✅🛡️ | ✅🛡️ | `params.userId` === `req.user.id` | Admin ve notificaciones de cualquier usuario. Otros roles solo las suyas. |
| `/api/notificaciones/:id/read` | PATCH | ✅🛡️ | ✅🛡️ | ✅🛡️ | ✅🛡️ | ✅🛡️ | `notificacion.IdUsuario` === `req.user.id` | Ownership verificado en controlador (el `params.id` es ID de notificación, no de usuario). Admin bypassea. |

### `/api/reportes`

| Endpoint | Método | Admin | Instructor | Aprendiz | Visitante | Vigilante | Ownership | Notas |
|---|---|---|---|---|---|---|---|---|
| `/api/reportes` | POST | ✅ | ❌ | ❌ | ❌ | ✅ | — | Genera reporte con cuerpo JSON. |
| `/api/reportes` | GET | ✅ | ✅ | ❌ | ❌ | ✅ | — | Genera reporte con query params. Instructor puede consultar. |
| `/api/reportes/stats` | GET | ✅ | ❌ | ❌ | ❌ | ✅ | — | Estadísticas rápidas. |

---

## Resumen por rol

| Rol | Cantidad de endpoints accesibles | Notas |
|---|---|---|
| Administrador | 21/21 | Acceso total. By-passea ownership en todos los casos. |
| Vigilante | 15/21 | Sin acceso a register, CRUD de usuarios, reportes POST/stats. |
| Instructor | 10/21 | Sin acceso a register, reportes POST/stats, movimientos operativos, vehículos global, users list, etc. |
| Aprendiz | 9/21 | Sin acceso a reportes, movimientos operativos, vehículos global, users list. |
| Visitante | 9/21 | Mismo que Aprendiz. |

## Middleware de autorización

```
Request → authenticate (auth.js) → authorize (authorize.js) → [ownership (ownership.js)] → Controller
```

1. **`authenticate`**: Verifica token JWT en header `Authorization: Bearer <token>`. Establece `req.user`.
2. **`authorize`**: Verifica que el rol del usuario (`idRolName` / `idRol`) esté en la lista de roles permitidos para el endpoint.
3. **`ownership`** (opcional): Verifica que el usuario sea el propietario del recurso o que sea Administrador.
