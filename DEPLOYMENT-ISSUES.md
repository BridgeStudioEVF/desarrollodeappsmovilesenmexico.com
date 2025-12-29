# Problemas Conocidos - FTP Deployment a Hostinger

## ⚠️ Error: Directorios Anidados en FTP Deploy

### Problema
Al usar GitHub Actions con `SamKirkland/FTP-Deploy-Action` para desplegar a Hostinger, el workflow creaba directorios anidados incorrectamente:

```
public_html/
  └── public_html/  ← directorio anidado incorrecto
      └── archivos del sitio
```

**Resultado esperado:**
```
public_html/
  └── archivos del sitio
```

### Causa Raíz
El problema ocurrió porque:
1. El usuario FTP de Hostinger ya inicia sesión en la raíz de `/public_html`
2. El parámetro `server-dir` en el workflow estaba configurado con `/public_html/`
3. Esto causaba que FTP Deploy creara: `public_html` (raíz FTP) + `/public_html/` (server-dir) = directorio anidado

### Intentos Realizados

#### Intento 1: Usar `FTP_SERVER_DIR` secret
```yaml
server-dir: ${{ secrets.FTP_SERVER_DIR }}  # Configurado como /public_html/
```
❌ **Resultado:** Creó `public_html/public_html/`

#### Intento 2: Cambiar `local-dir` de `./dist/` a `dist/`
```yaml
local-dir: dist/
server-dir: ${{ secrets.FTP_SERVER_DIR }}
```
❌ **Resultado:** Mismo problema, directorio anidado

#### Intento 3: Usar raíz `/` como `server-dir`
```yaml
local-dir: dist/
server-dir: /
```
❌ **Resultado:** Todavía creaba estructura anidada

### Solución que Funcionó
**Deployment manual via FTP tradicional** (FileZilla o Administrador de Archivos de Hostinger):
1. Compilar localmente: `npm run build`
2. Subir el **contenido** de la carpeta `dist/` directamente a `/public_html/`
3. NO subir la carpeta `dist` en sí, solo su contenido

### Alternativa Recomendada
Usar **SFTP** en lugar de FTP, o configurar deployment via **rsync** con SSH si está disponible en tu plan de Hostinger:

```yaml
# Ejemplo con rsync (requiere SSH habilitado)
- name: Deploy via rsync
  run: |
    rsync -avz --delete dist/ user@server:/home/user/public_html/
```

### Lecciones Aprendadas

1. **FTP Deploy Action tiene limitaciones** con ciertos servidores de hosting compartido como Hostinger
2. **La raíz FTP varía** entre proveedores - en Hostinger el usuario FTP ya está en `public_html`
3. **Deployment manual funciona** pero no es automático
4. **Para CI/CD real con Hostinger**, considera:
   - Usar SFTP con acción diferente
   - Usar rsync si SSH está disponible
   - Contratar plan que soporte Git deployment nativo

### Configuración Actual del Workflow

Por ahora, el workflow está configurado con:
```yaml
local-dir: dist/
server-dir: /
```

**Nota:** Esto NO funciona correctamente con Hostinger. El deployment debe hacerse manualmente.

### TODO: Solución Futura

- [ ] Investigar SFTP Action alternativa
- [ ] Verificar si plan de Hostinger incluye SSH/rsync
- [ ] Considerar Hostinger Git deployment (planes Premium/Business)
- [ ] O migrar CI/CD a otro servidor con mejor soporte

### Workaround Temporal

**Para deployment manual:**
1. Compilar: `npm run build`
2. Conectar con FileZilla:
   - Host: `ftp.tudominio.com`
   - Usuario: tu usuario FTP
   - Password: tu contraseña
   - Puerto: 21
3. Ir a `/public_html/` en el servidor
4. Subir TODO el contenido de `dist/` (no la carpeta, sino su contenido)
5. Sobrescribir archivos existentes

---

**Fecha del problema:** 2025-12-29  
**Última actualización:** 2025-12-29
