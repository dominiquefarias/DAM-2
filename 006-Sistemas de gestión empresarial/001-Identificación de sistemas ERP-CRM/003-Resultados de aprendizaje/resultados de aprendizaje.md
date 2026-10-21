# Resultado de aprendizaje 1

1. Identifica sistemas de planificación de recursos empresariales y de gestión de relaciones con clientes (ERP-CRM) reconociendo sus características y verificando la configuración del sistema informático.

## Criterios de evaluación:

### a) Se han reconocido los diferentes sistemas ERP-CRM que existen en el mercado.

En `001-Ejercicios/001-Concepto de ERP/001-concepto de ERP.md` defino ERP (*Enterprise Resource Planning*) como el sistema que gestiona los recursos de una empresa y abarca todo su proceso de gestión de datos. Enumero las áreas que cubre: inventario (con su clave ajena al producto, unidades y localización), usuarios (nombre, apellidos, usuario, contraseña y permisos), multisede, empleados, almacenes, facturas, logística, productos e incidencias.

En `001-Ejercicios/003-Concepto de CRM/001-crm.md` defino CRM (*Customer Relationship Management*) como el software de gestión de la relación con el cliente y de ventas. Lo sitúo junto a otros sistemas de gestión que existen en el mercado para sectores concretos: SIS (gestión de estudiantes), LMS (plataformas de aprendizaje), GMAO (mantenimiento asistido por ordenador), PMS (gestión hotelera) y CMS (gestión de contenidos).

Como producto concreto del mercado aparece Odoo, que analizo por su modelo de licencia en `001-Ejercicios/005-Tipos de licencias de los ERP-CRM/001-Aspectos legales.md`.

<!-- PENDIENTE: ampliar con 002-Revisión de los ERP actuales y 004-Revisión de los CRM actuales cuando estén escritos. Borrar este comentario antes de generar el informe. -->

### b) Se han identificado los diferentes tipos de licencia de los sistemas ERP-CRM.

En `001-Ejercicios/005-Tipos de licencias de los ERP-CRM/001-Aspectos legales.md` identifico tres tipos de licencia: GPL, propietaria y Apache.

- **Propietaria:** el desarrollador conserva el código y la propiedad. Al cliente solo se le entrega una copia de los binarios o se le da acceso al servicio mediante suscripción.
- **Modelo Odoo:** es una licencia más libre. Cualquiera puede descargar el código fuente, instalarlo y personalizarlo como quiera, pero la propiedad la sigue reteniendo Odoo.

En el mismo archivo recojo los aspectos legales que acompañan a una licencia: el clausulado, la garantía, los términos del servicio y el pliego de condiciones.

### c) Se han comparado sistemas ERP-CRM en función de sus características y requisitos.

Comparo opciones según sus características y requisitos en tres apartados:

- **Gestores de datos:** en `001-Ejercicios/006-Sistemas gestores de bases de datos compatibles con el software/001-analisis.md` los ordeno por prioridad. Primero las bases de datos relacionales (MySQL o PostgreSQL, prototipando con SQLite), después las documentales (MongoDB) y por último las soluciones de acceso a datos personalizadas.
- **Tecnologías de servidor:** en `001-Ejercicios/006-Sistemas gestores de bases de datos compatibles con el software/002-arquitectura de la solucion.md` planteo las alternativas dentro de una arquitectura web cliente/servidor: PHP + Laravel o Node.js en el servidor, y SQL, MongoDB o soluciones personalizadas para el almacenamiento.
- **Licencias:** en `001-Ejercicios/005-Tipos de licencias de los ERP-CRM/001-Aspectos legales.md` comparo el modelo propietario (binarios o suscripción) con el modelo de Odoo (código descargable y personalizable, pero propiedad del fabricante).

<!-- PENDIENTE: añadir la comparación de productos de 002-Revisión de los ERP actuales y 004-Revisión de los CRM actuales cuando estén escritos. Borrar este comentario antes de generar el informe. -->

### d) Se ha identificado el sistema operativo adecuado a cada sistema ERP-CRM.

En `001-Ejercicios/007-Instalación y configuración del sistema informático/001-cliente y servidor.md` separo los dos lados del sistema:

- **Cliente:** una interfaz web en HTML, CSS y JavaScript que se usa desde el navegador. Por eso es compatible con Windows, Mac y Linux.
- **Servidor:** el sistema operativo adecuado es Linux, dentro de una pila LAMP (Linux, Apache, MySQL, PHP/Perl) o con Node.js en lugar de PHP.

En `001-Ejercicios/006-Sistemas gestores de bases de datos compatibles con el software/002-arquitectura de la solucion.md` detallo el papel de cada tecnología en el cliente: HTML para la estructura, CSS para el estilo y JavaScript para el comportamiento.

### e) Se ha identificado el sistema gestor de datos adecuado a cada sistema ERP-CRM.

En `001-Ejercicios/006-Sistemas gestores de bases de datos compatibles con el software/001-analisis.md` establezco el orden de elección del gestor de datos:

1. **Relacional (SQL):** MySQL o PostgreSQL, y SQLite para prototipar.
2. **Documental:** MongoDB.
3. **Soluciones personalizadas** de gestión de datos.

En `001-Ejercicios/007-Instalación y configuración del sistema informático/001-cliente y servidor.md` encajo esa elección en el servidor: MySQL forma parte de la pila LAMP.

### f) Se han verificado las configuraciones del sistema operativo y del gestor de datos para garantizar la funcionalidad del ERP-CRM.

*No se responde por indicación del profesor.*

### g) Se han documentado las operaciones realizadas.

*No se responde por indicación del profesor.*

### h) Se han documentado las incidencias producidas durante el proceso.

*No se responde por indicación del profesor.*
