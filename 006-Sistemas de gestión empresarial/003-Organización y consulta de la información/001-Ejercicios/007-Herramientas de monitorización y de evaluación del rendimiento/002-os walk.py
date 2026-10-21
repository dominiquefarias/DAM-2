import os

for archivo,carpeta,carpetas in os.walk("/var/www/html/DAM/DAM-2"):
  print(archivo)
  print(carpeta)
  print(carpetas)