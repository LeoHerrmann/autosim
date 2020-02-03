var car_data = [
    /*{
        sound: {
            oscillators: [],
            gains: [],
            setup_sound: function() {
                for (let i = 0; i < 6; i++) {
                    car.sound.oscillators[i] = context.createOscillator();
                    car.sound.gains[i] = context.createGain();
                    car.sound.oscillators[i].connect(car.sound.gains[i]);
                    car.sound.gains[i].connect(context.destination);
                    car.sound.oscillators[i].type = "sine";
                    car.sound.oscillators[i].start(0);
                    car.sound.oscillators[i].frequency.value = car.data.rpm / 60 / 2 * 4;
                    car.sound.gains[i].gain.value = 0.5 + car.data.throttle;
                }
            },

            update_sound: function() {
                car.sound.oscillators[0].frequency.value = car.data.rpm / 60 / 2 * 6;
                car.sound.gains[0].gain.value = 0.5 + car.data.throttle;

                car.sound.oscillators[1].frequency.value = (car.data.rpm / 60 / 2 * 6) / 3;
                car.sound.gains[1].gain.value = (1 + car.data.throttle) * 0.75;

                car.sound.oscillators[2].frequency.value = (car.data.rpm / 60 / 2 * 6) / 6;
                car.sound.gains[2].gain.value = (1 + car.data.throttle) * 0.7;

                car.sound.oscillators[3].frequency.value = (car.data.rpm / 60 / 2 * 6) * 2;
                car.sound.gains[3].gain.value = (0.1 + car.data.throttle) * 0.5;

                car.sound.oscillators[4].frequency.value = (car.data.rpm / 60 / 2 * 6) * 3;
                car.sound.gains[4].gain.value = (0.1 + car.data.throttle) * 0.5;

                car.sound.oscillators[5].frequency.value = (car.data.rpm / 60 / 2 * 6) * 6;
                car.sound.gains[5].gain.value = (0.05 + car.data.throttle) * 0.5;
            },
        },

        data: {
            gear_ratios: [3.71, 2.19, 1.54, 1.18, 1, 0.83, 0.64],
            final_drive: 3.7,
            tire_diameter: 0.70,
            mass: 1500,
            max_torque: 200,
            max_torque_rpm: 4000,
            rpm_limiter: 7000,
            drag_coefficient: 0.26,
            frontal_area: 2.00,
            idle_rpm: 800,
            idle_throttle: 0.1, 
            maximum_braking_force: 10000,

            gear: 1,
            previous_gear: 1,
            shift_progress: 1,
            shift_time: 0.3,
            rpm: 800,
            speed: 2.14,
            throttle: 0,
            brake: 0
        }
    },



    {
        sound: {
            oscillators: [],
            gains: [],
            setup_sound: function() {
                for (let i = 0; i < 6; i++) {
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
                car.sound.oscillators[0].frequency.value = car.data.rpm / 60 / 2 * 4;
                car.sound.gains[0].gain.value = 0.5 + car.data.throttle;

                car.sound.oscillators[1].frequency.value = (car.data.rpm / 60 / 2 * 4) / 2;
                car.sound.gains[1].gain.value = (0.5 + car.data.throttle) * 0.75;

                car.sound.oscillators[2].frequency.value = (car.data.rpm / 60 / 2 * 4) / 4;
                car.sound.gains[2].gain.value = (0.4 + car.data.throttle) * 0.2;

                car.sound.oscillators[3].frequency.value = (car.data.rpm / 60 / 2 * 4) * 2;
                car.sound.gains[3].gain.value = (0.1 + car.data.throttle) * 0.6;

                car.sound.oscillators[4].frequency.value = (car.data.rpm / 60 / 2 * 4) * 4;
                car.sound.gains[4].gain.value = (0.1 + car.data.throttle) * 0.4;

                car.sound.oscillators[5].frequency.value = (car.data.rpm / 60 / 2 * 4) * 8;
                car.sound.gains[5].gain.value = (0.05 + car.data.throttle) * 0.3;
            },
        },

        data: {
            gear_ratios: [3.58, 1.90, 1.29, 1.0, 0.84, 0.68],
            final_drive: 4.1,
            tire_diameter: 0.647,
            mass: 1200,
            max_torque: 150,
            max_torque_rpm: 4000,
            rpm_limiter: 7000,
            drag_coefficient: 0.28,
            frontal_area: 2.25,
            idle_rpm: 800,
            idle_throttle: 0.1, 
            maximum_braking_force: 10000,

            gear: 1,
            previous_gear: 1,
            shift_progress: 1,
            shift_time: 0.25,
            rpm: 800,
            speed: 1.85,
            throttle: 0,
            brake: 0
        }
    },*/



    {//Mercedes W201 1997ccm³ Diesel 
        sound: {
            oscillators: [],
            gains: [],
            setup_sound: function() {
                for (let i = 0; i < 6; i++) {
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
                /*car.sound.oscillators[0].frequency.value = car.data.rpm / 60 / 2 * 5
                car.sound.gains[0].gain.value = 0.5 + car.data.throttle;

                car.sound.oscillators[1].frequency.value = (car.data.rpm / 60 / 2 * 5) / 5;
                car.sound.gains[1].gain.value = (0.5 + car.data.throttle) * 0.8;

                car.sound.oscillators[2].frequency.value = (car.data.rpm / 60 / 2 * 5) / 10;
                car.sound.gains[2].gain.value = (0.4 + car.data.throttle) * 0.7;

                car.sound.oscillators[3].frequency.value = (car.data.rpm / 60 / 2 * 5) * 2.5;
                car.sound.gains[3].gain.value = (0.1 + car.data.throttle) * 0.3;

                car.sound.oscillators[4].frequency.value = (car.data.rpm / 60 / 2 * 5) * 5;
                car.sound.gains[4].gain.value = (0.1 + car.data.throttle) * 0.2;

                car.sound.oscillators[5].frequency.value = (car.data.rpm / 60 / 2 * 5) * 10;
                car.sound.gains[5].gain.value = (0.05 + car.data.throttle) * 0.1;*/

                car.sound.oscillators[0].frequency.value = car.data.rpm / 60 / 2 * 4;
                car.sound.gains[0].gain.value = 0.5 + car.data.throttle * 2;

                car.sound.oscillators[1].frequency.value = (car.data.rpm / 60 / 2 * 4) * (1 / 4);
                car.sound.gains[1].gain.value = (0.5 + car.data.throttle) * 0.25;

                car.sound.oscillators[2].frequency.value = (car.data.rpm / 60 / 2 * 4) * (2 / 4);
                car.sound.gains[2].gain.value = (0.5 + car.data.throttle) * 1.5;

                car.sound.oscillators[3].frequency.value = (car.data.rpm / 60 / 2 * 4) * (3 / 4);
                car.sound.gains[3].gain.value = (0.5 + car.data.throttle) * 0.25;

                car.sound.oscillators[4].frequency.value = (car.data.rpm / 60 / 2 * 4) * (8 / 4);
                car.sound.gains[4].gain.value = (0.025 + car.data.throttle) * 0.5;

                car.sound.oscillators[5].frequency.value = (car.data.rpm / 60 / 2 * 4) * (16 / 4);
                car.sound.gains[5].gain.value = (0.025 + car.data.throttle) * 0.5;
            },
        },

        data: {
            name: "Mercedes-Benz W201 1997ccm² Diesel",
            gear_ratios: [4.25, 2.41, 1.49, 1.0],
            final_drive: 3.07,
            tire_diameter: 0.6,
            mass: 1290,
            max_torque: 122,
            max_torque_rpm: 2800,
            rpm_limiter: 5000,
            drag_coefficient: 0.35,
            frontal_area: 1.94,
            idle_rpm: 840,
            idle_throttle: 0.15, 
            maximum_braking_force: 10000,

            gear: 1,
            previous_gear: 1,
            shift_progress: 1,
            shift_time: 0.5,
            rpm: 800,
            speed: 2.022,
            throttle: 0,
            brake: 0
        }
    },



    {//Porsche 911 991 Carrera
        sound: {
            oscillators: [],
            gains: [],
            setup_sound: function() {
                for (let i = 0; i < 7; i++) {
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
                car.sound.oscillators[0].frequency.value = car.data.rpm / 60 / 2 * 6;
                car.sound.gains[0].gain.value = 0.5 + car.data.throttle;

                car.sound.oscillators[1].frequency.value = (car.data.rpm / 60 / 2 * 6) * (1 / 6);
                car.sound.gains[1].gain.value = (0.5 + car.data.throttle) * 0.75;

                car.sound.oscillators[2].frequency.value = (car.data.rpm / 60 / 2 * 6) * (2 / 6);
                car.sound.gains[2].gain.value = (0.5 + car.data.throttle) * 1.5;

                car.sound.oscillators[3].frequency.value = (car.data.rpm / 60 / 2 * 6) * (3 / 6);
                car.sound.gains[3].gain.value = (0.5 + car.data.throttle) * 0.75;

                car.sound.oscillators[4].frequency.value = (car.data.rpm / 60 / 2 * 6) * (12 / 6);
                car.sound.gains[4].gain.value = (0.2 + car.data.throttle) * 0.7;

                car.sound.oscillators[5].frequency.value = (car.data.rpm / 60 / 2 * 6) * (24 / 6);
                car.sound.gains[5].gain.value = (0.2 + car.data.throttle) * 0.6;

                car.sound.oscillators[5].frequency.value = (car.data.rpm / 60 / 2 * 6) * (36 / 6);
                car.sound.gains[5].gain.value = (0.025 + car.data.throttle) * 0.3;
            },
        },

        data: {
            name: "Porsche 911 991 Carrera", 
            gear_ratios: [3.91, 2.29, 1.65, 1.3, 1.08, 0.88, 0.62],
            final_drive: 3.44,
            tire_diameter: 0.6821,
            mass: 1475,
            max_torque: 390,
            max_torque_rpm: 5600,
            rpm_limiter: 8000,
            drag_coefficient: 0.29,
            frontal_area: 2.01,
            idle_rpm: 840,
            idle_throttle: 0.075, 
            maximum_braking_force: 10000,

            gear: 1,
            previous_gear: 1,
            shift_progress: 1,
            shift_time: 0.2,
            rpm: 840,
            speed: 2.230,
            throttle: 0,
            brake: 0
        }
    }
];
