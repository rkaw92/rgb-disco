# RGB disco!

The RGBController.js file in this package, when run, will attempt to find three directories under the current working directory (`pwd`): `red`, `green` and `blue`, and attempt to use them as PWM controls. It will then present you with an HTML/JS-based command interface over HTTP so that you can set your own duty cycle, i.e. control lighting brightness interactively.

# Running

The script assumes that files `./red`, `./green` and `./blue` are symlinks to the respective GPIO PWM output channels.

For example, on the Intel Galileo, you need to export the appropriate PWM channels as per http://www.malinov.com/Home/sergey-s-blog/intelgalileo-programminggpiofromlinux

In my case, the red PWM output was channel 4, the green - channel 7 and the red - channel 1 (corresponding to Galileo pins 11, 10 and 9 respectively).

Thus, I first had to export the PWM channels from pwmchip0 to enable userspace visibility:
```
# echo -n 1 >/sys/class/pwm/pwmchip0/export
# echo -n 4 >/sys/class/pwm/pwmchip0/export
# echo -n 7 >/sys/class/pwm/pwmchip0/export
```

Then, I created the symlinks to the newly-exported channels in the directory that I was going to run RGBController.js in:
```
# ln -s /sys/class/pwm/pwmchip0/pwm4 red
# ln -s /sys/class/pwm/pwmchip0/pwm7 green
# ln -s /sys/class/pwm/pwmchip0/pwm1 blue
```

Finally, I ran the script (having made sure all dependencies were in place via `npm install`):
```
# node RGBController.js
Listening on port 9844
```

Apparently, all went well and my little script opened an HTTP management interface on the displayed port!

# Short-term improvements
* Separate the Web interface and the runner from the RGBController logic
* Implement another control/status interface (AMQP? STOMP?)
* Publish color changes to the client; synchronize values with all clients for consistency
* Document the reference MOSFET-based circuit design & pin connections to the Galileo

# Roadmap
Yeah, well... any ideas?

# License
MIT
