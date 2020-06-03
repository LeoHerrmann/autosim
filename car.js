//functions and objects responsible for controlling the selected car


var car = {
    engine_torque: function(rpm = car.data.rpm, throttle = car.data.throttle) {
        return - (car.properties.max_torque / (car.properties.max_torque_rpm ** 2)) * throttle ** 2
               * (1 / throttle * rpm - car.properties.max_torque_rpm) ** 2 + throttle ** 2 * car.properties.max_torque;
    },



    shift_up: function() {
        if (car.data.gear != car.properties.gear_ratios.length) {
            var temp_car = JSON.parse(JSON.stringify(car));
            temp_car.data.gear = car.data.gear + 1;

            if (calculator.rpm_from_speed(temp_car, temp_car.data.speed) >= car.properties.idle_rpm) {
                if (car.data.shift_progress == 1) {
                    car.data.previous_gear = car.data.gear;
                }

                car.data.shift_progress = 0;
                car.data.gear += 1;
                car.data.rpm = calculator.rpm_from_speed(car, car.data.speed);
            }
        }
    },



    shift_down: function() {
        if (car.data.gear != 1) {
            var temp_car = JSON.parse(JSON.stringify(car));
            temp_car.data.gear = car.data.gear - 1;

            if (calculator.rpm_from_speed(temp_car, temp_car.data.speed) <= car.properties.rpm_limiter) {
                if (car.data.shift_progress == 1) {
                    car.data.previous_gear = car.data.gear;
                }

                car.data.shift_progress = 0;
                car.data.gear -= 1;
                car.data.rpm = calculator.rpm_from_speed(car, car.data.speed);
            }
        }
    },



    shift_into_gear: function(gear_number) {
        var temp_car = JSON.parse(JSON.stringify(car));
        temp_car.data.gear = gear_number;

        if (calculator.rpm_from_speed(temp_car, temp_car.data.speed) <= car.properties.rpm_limiter 
        && calculator.rpm_from_speed(temp_car, temp_car.data.speed) >= car.properties.idle_rpm) {
            if (car.data.shift_progress == 1) {
                car.data.previous_gear = car.data.gear;
            }
            car.data.shift_progress = 0;
            car.data.gear = gear_number;
            car.data.rpm = calculator.rpm_from_speed(car, car.data.speed);
            return true;
        }

        return false;
    },



    start: function() {
        car.data.gear = 1;
        var start_speed = calculator.speed_from_rpm(car, car.properties.idle_rpm);
        car.set_speed(start_speed);

        if (document.getElementById("sync_to_engine_checkbox").checked === true) {
            stopwatch.reset();
            stopwatch.toggle();
        }
    },



    set_speed: function(new_speed) {
        car.data.speed = new_speed;
        car.data.rpm = calculator.rpm_from_speed(car, car.data.speed);
    },



    data: {
        rpm: 500,
        speed: 2.23,
        shift_progress: 1,
        gear: 1,
        previous_gear: 1,
        throttle: 0.01,
        brake: 0
    },



    sound: {
        oscillators: [],
        gains: [],
        setup_sound: function() {
            for (let i = 0; i < car.properties.sound.frequencies.length; i++) {
                car.sound.oscillators[i] = context.createOscillator();
                car.sound.gains[i] = context.createGain();
                car.sound.oscillators[i].connect(car.sound.gains[i]);
                car.sound.gains[i].connect(context.destination);
                car.sound.oscillators[i].type = "sine";
                car.sound.oscillators[i].frequency.value = car.data.rpm / 60 / 2 * car.properties.cylinder_count 
                                                           * car.properties.sound.frequencies[i];
                car.sound.gains[i].gain.value = car.properties.sound.base_gains[i] + car.data.throttle
                                                * car.properties.sound.throttle_gains[i];
                car.sound.oscillators[i].start(0);
            }
        },

        update_sound: function() {
            for (let i = 0; i < car.properties.sound.frequencies.length; i++) {
                car.sound.oscillators[i].frequency.value = car.data.rpm / 60 / 2 * car.properties.cylinder_count
                                                           * car.properties.sound.frequencies[i];
                car.sound.gains[i].gain.value = car.properties.sound.base_gains[i] + car.data.throttle
                                                * car.properties.sound.throttle_gains[i];
            }
        }
    }
};
