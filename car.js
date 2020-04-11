var car = {
    engine_torque: function(rpm = car.data.rpm, throttle=car.data.throttle) {
        return - (car.data.max_torque / (car.data.max_torque_rpm ** 2)) * throttle ** 2 * (1 / throttle * rpm - car.data.max_torque_rpm) ** 2 + throttle ** 2 * car.data.max_torque;
    },



    shift_up: function() {
        if (car.data.gear != car.data.gear_ratios.length) {
            var temp_car = JSON.parse(JSON.stringify(car));
            temp_car.data.gear = car.data.gear + 1;

            if (calculator.rpm_from_speed(temp_car, temp_car.data.speed) >= car.data.idle_rpm) {
                if (car.data.shift_progress == 1) {
                    car.data.previous_gear = car.data.gear;
                }
                car.data.shift_progress = 0;
                car.data.gear += 1;
                car.data.rpm = calculator.rpm_from_speed(car, car.data.speed);
                return true;
            }
        }

        return false;
    },



    shift_down: function() {
        if (car.data.gear != 1) {
            var temp_car = JSON.parse(JSON.stringify(car));
            temp_car.data.gear = car.data.gear - 1;

            if (calculator.rpm_from_speed(temp_car, temp_car.data.speed) <= car.data.rpm_limiter) {
                if (car.data.shift_progress == 1) {
                    car.data.previous_gear = car.data.gear;
                }
                car.data.shift_progress = 0;
                car.data.gear -= 1;
                car.data.rpm = calculator.rpm_from_speed(car, car.data.speed);
                return true;
            }
        }

        return false;
    },



    shift_into_gear: function(gear_number) {
        //if (car.data.gear != 1) {
            var temp_car = JSON.parse(JSON.stringify(car));
            temp_car.data.gear = gear_number;

            if (calculator.rpm_from_speed(temp_car, temp_car.data.speed) <= car.data.rpm_limiter && calculator.rpm_from_speed(temp_car, temp_car.data.speed) >= car.data.idle_rpm) {
                if (car.data.shift_progress == 1) {
                    car.data.previous_gear = car.data.gear;
                }
                car.data.shift_progress = 0;
                car.data.gear = gear_number;
                car.data.rpm = calculator.rpm_from_speed(car, car.data.speed);
                return true;
            }
        //}

        return false;
    },



    start: function() {
        car.data.gear = 1;
        var start_speed = calculator.speed_from_rpm(car, car.data.idle_rpm);
        car.set_speed(start_speed);
    },



    set_speed: function(new_speed) {
        car.data.speed = new_speed;
        car.data.rpm = calculator.rpm_from_speed(car, car.data.speed);
    },
};
