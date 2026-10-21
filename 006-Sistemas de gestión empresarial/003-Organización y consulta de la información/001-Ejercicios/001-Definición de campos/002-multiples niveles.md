Hay datos que tienen varios niveles
Por ejemplo, un cliente con varios emails:

Cliente
-nombre
-apellidos
-emails
	-personal
	-trabajo

En una base de datos relacional no se mete una lista dentro de un campo
Se separa en dos tablas unidas por una clave

Tabla clientes
id
nombre
apellidos

Tabla emails
id
cliente_id  -> apunta al id del cliente
tipo (personal / trabajo)
email
