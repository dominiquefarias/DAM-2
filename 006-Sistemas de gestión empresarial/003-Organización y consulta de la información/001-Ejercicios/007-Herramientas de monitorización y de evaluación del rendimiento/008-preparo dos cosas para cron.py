#!/usr/bin/env python3
import os
import psutil
from datetime import datetime

hoy = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
cpu = psutil.cpu_percent(interval=1)
ram = psutil.virtual_memory().percent

# Antes apuntaba a /home/josevicente/... (ruta del PC del profesor) y aquí fallaba.
# Ahora guarda en registros.csv, en la misma carpeta que este script, esté donde esté.
carpeta = os.path.dirname(os.path.abspath(__file__))
archivo = open(os.path.join(carpeta, "registros.csv"),'a')
archivo.write(str(hoy)+","+str(cpu)+","+str(ram)+"\n")
archivo.close()