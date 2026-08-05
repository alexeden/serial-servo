

Si los permisos impiden abrir el puerto AMA0, ejecuta lo siguiente:

```
sudo chmod 666 /dev/ttyAMA0
```

En DietPi, si no se reciben datos del puerto serie, ejecuta `sudo dietpi-config`, ve a _Advanced Options_ > _Serial/UART_ y asegúrate de que `ttyS0 console` y `ttyAMA0 console` estén ambos **off**.
