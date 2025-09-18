# Modular CRM

Un sistema de gestión de relaciones con clientes (CRM) moderno construido con React, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características

- **Autenticación completa**: Registro, login y logout con Supabase Auth
- **Gestión de organizaciones**: Cada usuario tiene su propia organización creada automáticamente
- **Dashboard interactivo**: Vista general de contactos, empresas, negocios y cotizaciones
- **Gestión de contactos**: CRUD completo para contactos de clientes
- **Gestión de empresas**: Administra tu cartera de clientes empresariales
- **Pipeline de ventas**: Seguimiento de negocios y oportunidades
- **Sistema de cotizaciones**: Crea y gestiona cotizaciones profesionales
- **Multiidioma**: Soporte para español e inglés
- **Diseño responsive**: Optimizado para desktop y móvil
- **Seguridad**: Row Level Security (RLS) implementado

## 🛠️ Tecnologías

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, sistema de tokens de diseño
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **UI Components**: Componentes personalizados con variantes
- **Estado**: Context API para autenticación
- **Icons**: Lucide React

## 📦 Instalación

1. **Clona el repositorio**
   ```bash
   git clone <repository-url>
   cd modular-crm
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre la aplicación**
   - Navega a `http://localhost:8080`

## 🔐 Autenticación

### Registro de Usuario
1. Accede a la aplicación
2. Haz clic en "Crear una cuenta"
3. Completa el formulario con:
   - Nombre y apellido
   - Correo electrónico válido
   - Contraseña (mínimo 6 caracteres)
4. Al registrarte se creará automáticamente:
   - Tu perfil de usuario
   - Una organización con tu nombre
   - Tu membresía como "owner" de la organización

### Inicio de Sesión
1. Usa tu correo y contraseña registrados
2. Accederás directamente al dashboard de tu CRM

### Cerrar Sesión
- Haz clic en tu avatar en la esquina superior derecha
- Selecciona "Salir"

## 🏗️ Arquitectura de Base de Datos

### Tablas Principales

- **`profiles`**: Información adicional de usuarios
- **`organizations`**: Organizaciones de los usuarios
- **`organization_members`**: Membresías con roles (owner, admin, member)

### Seguridad (RLS)

- Cada usuario solo puede ver datos de su organización
- Los "owners" pueden gestionar su organización
- Sistema de roles implementado con funciones de seguridad

## 🎨 Sistema de Diseño

El proyecto utiliza un sistema de diseño basado en tokens semánticos:

- **Colores**: Tokens CSS personalizados (`--primary`, `--secondary`, etc.)
- **Componentes**: Variantes usando `class-variance-authority`
- **Tipografía**: Escalas predefinidas (`text-display-lg`, etc.)
- **Animaciones**: Transiciones y efectos predefinidos

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React organizados por módulo
│   ├── Auth/           # Componentes de autenticación
│   ├── Dashboard/      # Dashboard y estadísticas
│   ├── Contacts/       # Gestión de contactos
│   ├── Companies/      # Gestión de empresas
│   ├── Deals/          # Pipeline de ventas
│   ├── Quotes/         # Sistema de cotizaciones
│   ├── Layout/         # Header, Footer, navegación
│   └── ui/             # Componentes base reutilizables
├── contexts/           # Contextos de React (Auth)
├── hooks/              # Hooks personalizados
├── lib/                # Configuración de librerías (Supabase)
├── utils/              # Utilidades y helpers
└── integrations/       # Integraciones con servicios externos
    └── supabase/       # Cliente y tipos de Supabase
```

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecuta ESLint

## 🌐 Configuración de Supabase

La aplicación ya está configurada con Supabase. Las URLs y claves están directamente en el código por simplicidad de desarrollo.

**Nota**: En un entorno de producción, deberías usar variables de entorno seguras.

## 📈 Funcionalidades por Implementar

- [ ] Módulo de Pipeline avanzado
- [ ] Reportes y analíticas
- [ ] Integración con email
- [ ] Importación/exportación de datos
- [ ] Notificaciones en tiempo real
- [ ] Tema oscuro
- [ ] PWA (Progressive Web App)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de [Supabase](https://supabase.com/docs)
2. Verifica la consola del navegador para errores
3. Asegúrate de que tu email sea válido al registrarte
4. Los datos se almacenan por organización, cada usuario ve solo sus datos

---

Desarrollado con ❤️ usando React, TypeScript y Supabase
