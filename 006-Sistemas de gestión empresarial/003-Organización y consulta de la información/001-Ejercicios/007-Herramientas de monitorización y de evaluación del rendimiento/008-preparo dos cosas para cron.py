#!/usr/bin/env python3
import psutil
from datetime import datetime

hoy = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
cpu = psutil.cpu_percent(interval=1)
ram = psutil.virtual_memory().percent

archivo = open("/home/josevicente/DAM/DAM-2/006-Sistemas de gestión empresarial/003-Organización y consulta de la información/007-Herramientas de monitorización y de evaluación del rendimiento/registro.csv",'a')
archivo.write(str(hoy)+","+str(cpu)+","+str(ram)+"\n")
archivo.close()