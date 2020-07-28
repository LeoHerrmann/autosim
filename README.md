# Autosim

A motor vehicle simulator designed to develop shift strategies for automatic transmissions

This project is a fundamental part of my term paper ["Controlling and Simulating Automatic Transmissions in Motor Vehicles"](https://github.com/Rahmsauce/Autosim/blob/master/simulation_und_steuerung_von_automatikgetrieben.pdf).



## Screenshot

![Screenshot](https://user-images.githubusercontent.com/53840228/88667650-f5e70b00-d0e1-11ea-889e-b9e739428472.png)



## Features

- Simulation of motor vehicle powertrains, driving resistances and engine sound
- Visualisation of vehicle speed and slope
- Control of throttle and brake using sliders
- A selection of vehicle models to choose from
- Choice between various automatic shift strategies or manual shifting
- Display of driving information (e.g. acceleration, engine torque, …)
- Stopwatch for measuring acceleration times
- Multilingual support (English and German)



## How it works

This is just a brief explanation covering the most important aspects of this project. More information can be found in my [term paper](https://github.com/Rahmsauce/Autosim/blob/master/simulation_und_steuerung_von_automatikgetrieben.pdf), which is unfortunately only available in German for now, or by having a closer look at the source code.

The primary processes of this application, such as the powertrain simulation, shift strategies or visualization, are coordinated by the main function, which is executed in a fixed time interval (default: 60 times per second) and can be found in script.js.



### Powertrain simulation

The root of the powertrain of a motor vehicle is its engine. In the simulation, its output torque is represented as a quadratic function of its current speed and load. Using this model, wheel torque is determined by multiplying the torque of the engine with the transmission and final drive ratios. Dividing wheel torque by the wheel radius results in the force the engine is exerting on the vehicle. The acceleration is then calculated by dividing the force by the mass of the vehicle and allows to determine the new vehicle velocity. Finally, the new engine speed is calculated using the vehicle velocity and transmission and final drive ratios.



### Shift strategies

Shift strategies are responsible for choosing the transmission gear which is best suited for the current driving situation. They should keep the engine in an efficient operating speed on low loads, while allowing for quick acceleration on high loads. Furthermore, shift strategies need to be predictable and reliable for the driver.

The general working principle of the shift strategies I developed is quite simple: calculate a target depending on the throttle position and choose the gear which allows reaching the target as closely as possible. I have experimented with three different types of targets: engine speed, gearing and acceleration. Each of these approaches have been optimized regarding fuel economy, acceleration and predictability and it seems as if the engine speed based approach performs the best, although admittedly, it is also the one most of the work has been put into.



## Installation

Being a web application, there is no special installation procedure required. The project can either be run online by clicking [here](https://rahmsauce.github.io/Autosim/index.html) or locally by cloning the repository and opening index.html using a web browser.



## Contribution

If you have any ideas or questions concerning this project, feel free to create an issue or fork this repository to make changes on your own.



## License

This project is licensed under the terms of the [GNU General Public License v3.0](https://github.com/Rahmsauce/Autosim/blob/master/LICENSE.txt). 
