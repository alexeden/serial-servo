If permissions prevent opening AMA0 port, run this:

```
sudo chmod 666 /dev/ttyAMA0
```

On dietpi, if not getting data from the serial port, run `sudo dietpi-config`, go to _Advanced Options_ > _Serial/UART_, make sure `ttyS0 console` and `ttyAMA0 console` are both **off**.
