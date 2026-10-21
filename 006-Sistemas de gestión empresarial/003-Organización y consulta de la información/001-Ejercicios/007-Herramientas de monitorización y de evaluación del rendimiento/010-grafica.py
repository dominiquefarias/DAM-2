#!/usr/bin/env python3
# Dibuja el uso de CPU y RAM que va guardando 008 (lanzado por cron) en registros.csv
# Necesita matplotlib:  sudo apt install python3-matplotlib
import csv
import os
import matplotlib.pyplot as plt
from datetime import datetime

fechas = []
cpus = []
rams = []

# El profesor leía /home/josevicente/Escritorio/registros.csv; yo lo leo de esta carpeta
carpeta = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(carpeta, "registros.csv"), "r") as archivo:
    lector = csv.reader(archivo)
    for fila in lector:
        fechas.append(datetime.strptime(fila[0], "%Y-%m-%d %H:%M:%S"))
        cpus.append(float(fila[1]))
        rams.append(float(fila[2]))

# Gráfica CPU
plt.figure()
plt.plot(fechas, cpus, color="#9D50FF")
plt.title("Uso de CPU")
plt.xlabel("Fecha y hora")
plt.ylabel("CPU (%)")
plt.ylim(0, 100)
plt.grid()
plt.gcf().autofmt_xdate()

# Gráfica RAM
plt.figure()
plt.plot(fechas, rams, color="#2D2345")
plt.title("Uso de RAM")
plt.xlabel("Fecha y hora")
plt.ylabel("RAM (%)")
plt.ylim(0, 100)
plt.grid()
plt.gcf().autofmt_xdate()

plt.show()
