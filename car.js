var car = {
    engine_torque: function(rpm = car.data.rpm, throttle = car.data.throttle) {
        return - (car.properties.max_torque / (car.properties.max_torque_rpm ** 2)) * throttle ** 2 * (1 / throttle * rpm - car.properties.max_torque_rpm) ** 2 + throttle ** 2 * car.properties.max_torque;
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
                return true;
            }
        }

        return false;
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
                return true;
            }
        }

        return false;
    },



    shift_into_gear: function(gear_number) {
        var temp_car = JSON.parse(JSON.stringify(car));
        temp_car.data.gear = gear_number;

        if (calculator.rpm_from_speed(temp_car, temp_car.data.speed) <= car.properties.rpm_limiter && calculator.rpm_from_speed(temp_car, temp_car.data.speed) >= car.properties.idle_rpm) {
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
        brake: 0.01
    }
};
