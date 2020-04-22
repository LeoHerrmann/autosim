const car_data = [
    {
        properties: {
            name: "Mercedes-Benz W201 1997ccm² Diesel",
            gear_ratios: [4.25, 2.41, 1.49, 1.0],
            shift_time: 0.7,
            final_drive: 3.07,
            tire_diameter: 0.6,
            mass: 1290,
            max_torque: 122,
            max_torque_rpm: 2800,
            max_power_rpm: 3730,
            rpm_limiter: 5000,
            idle_rpm: 840,
            idle_throttle: 0.15,
            drag_coefficient: 0.35,
            frontal_area: 1.94,
            maximum_brake_deceleration: 10
        },

        sound: {
            oscillators: [],
            gains: [],
            setup_sound: function() {
                for (let i = 0; i < 8; i++) {
                    car.sound.oscillators[i] = context.createOscillator();
                    car.sound.gains[i] = context.createGain();
                    car.sound.oscillators[i].connect(car.sound.gains[i]);
                    car.sound.gains[i].connect(context.destination);
                    car.sound.oscillators[i].type = "sine";
                    car.sound.oscillators[i].frequency.value = car.data.rpm / 60 / 2 * 4;
                    car.sound.gains[i].gain.value = 0;
                    car.sound.oscillators[i].start(0);
                }
            },

            update_sound: function() {
                //Combustion
                car.sound.oscillators[0].frequency.value = car.data.rpm / 60 / 2 * 4;
                car.sound.gains[0].gain.value = 0.05 + (car.data.throttle) * 0.1;

                car.sound.oscillators[1].frequency.value = (car.data.rpm / 60 / 2 * 4) * (1 / 4);
                car.sound.gains[1].gain.value = 0.02 + (car.data.throttle) * 0.02;

                //Crankshaft
                car.sound.oscillators[2].frequency.value = (car.data.rpm / 60 / 2 * 4) * (2 / 4);
                car.sound.gains[2].gain.value = 0.04 + (car.data.throttle) * 0.05;

                car.sound.oscillators[7].frequency.value = (car.data.rpm / 60 / 2 * 4) * (6 / 4);
                car.sound.gains[7].gain.value = 0.04 + (car.data.throttle) * 0.04;

                car.sound.oscillators[3].frequency.value = (car.data.rpm / 60 / 2 * 4) * (8 / 4);
                car.sound.gains[3].gain.value = 0.03 + (car.data.throttle) * 0.04;

                car.sound.oscillators[5].frequency.value = (car.data.rpm / 60 / 2 * 4) * (10 / 4);
                car.sound.gains[5].gain.value = 0.03 + (car.data.throttle) * 0.04;

                car.sound.oscillators[4].frequency.value = (car.data.rpm / 60 / 2 * 4) * (12 / 4);
                car.sound.gains[4].gain.value = 0.03 + (car.data.throttle) * 0.03;

                car.sound.oscillators[6].frequency.value = (car.data.rpm / 60 / 2 * 4) * (16 / 4);
                car.sound.gains[6].gain.value = 0.02 + (car.data.throttle) * 0.005;
            }
        }
    },



    {
        properties: {
            name: "Porsche 911 991 Carrera", 
            gear_ratios: [3.91, 2.29, 1.65, 1.3, 1.08, 0.88, 0.62],
            shift_time: 0.2,
            final_drive: 3.44,
            tire_diameter: 0.6821,
            mass: 1475,
            max_torque: 390,
            max_torque_rpm: 5600,
            max_power_rpm: 7500,
            rpm_limiter: 8000,
            idle_rpm: 840,
            idle_throttle: 0.075,
            drag_coefficient: 0.29,
            frontal_area: 2.01, 
            maximum_brake_deceleration: 10
        },

        sound: {
            oscillators: [],
            gains: [],
            setup_sound: function() {
                for (let i = 0; i < 8; i++) {
                    car.sound.oscillators[i] = context.createOscillator();
                    car.sound.gains[i] = context.createGain();
                    car.sound.oscillators[i].connect(car.sound.gains[i]);
                    car.sound.gains[i].connect(context.destination);
                    car.sound.oscillators[i].type = "sine";
                    car.sound.oscillators[i].frequency.value = car.data.rpm / 60 / 2 * 4;
                    car.sound.gains[i].gain.value = 0;
                    car.sound.oscillators[i].start(0);
                }
            },

            update_sound: function() {
                //Combustion
                car.sound.oscillators[0].frequency.value = car.data.rpm / 60 / 2 * 6;
                car.sound.gains[0].gain.value = 0.05 + (car.data.throttle) * 0.1;

                car.sound.oscillators[1].frequency.value = (car.data.rpm / 60 / 2 * 6) * (1 / 6);
                car.sound.gains[1].gain.value = 0.02 + (car.data.throttle) * 0.02;

                //Crankshaft
                car.sound.oscillators[2].frequency.value = (car.data.rpm / 60 / 2 * 6) * (2 / 6);
                car.sound.gains[2].gain.value = 0.05 + (car.data.throttle) * 0.05;

                car.sound.oscillators[4].frequency.value = (car.data.rpm / 60 / 2 * 6) * (3 / 6);
                car.sound.gains[4].gain.value = 0.02 + (car.data.throttle) * 0.04;

                car.sound.oscillators[5].frequency.value = (car.data.rpm / 60 / 2 * 6) * (8 / 6);
                car.sound.gains[5].gain.value = 0.02 + (car.data.throttle) * 0.04;

                car.sound.oscillators[6].frequency.value = (car.data.rpm / 60 / 2 * 6) * (10 / 6);
                car.sound.gains[6].gain.value = 0.02 + (car.data.throttle) * 0.03;

                car.sound.oscillators[3].frequency.value = (car.data.rpm / 60 / 2 * 6) * (12 / 6);
                car.sound.gains[3].gain.value = 0.02 + (car.data.throttle) * 0.03;

                car.sound.oscillators[7].frequency.value = (car.data.rpm / 60 / 2 * 6) * (15 / 6);
                car.sound.gains[7].gain.value = 0.005 + (car.data.throttle) * 0.01;
            }
        }
    }
];
