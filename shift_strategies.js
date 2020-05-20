//shift strategies for automatic shifting


/*
Gear selection based on engine speed
Maximum acceleration
Use of engine braking on slopes
*/

function autoshift_strategy_5_3() {
    if (car.data.throttle < 0.02 && angle < 0 && car.data.shift_progress == 1) {
        if (car.data.brake != 0) {
            return false;
        }


        //calculate grade resistance force and current wheel force
        var grade_resistance_force = -1 * Math.sin(angle * Math.PI/180) * 9.81 * car.properties.mass;

        var temp_car = JSON.parse(JSON.stringify(car));
        temp_car.data.gear = car.properties.gear_ratios.length;
        temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);
        var wheel_force = calculator.wheel_force(temp_car);


        //find and select the gear with the lowest positive difference between wheel force and grade resistance force
        var smallest_difference = grade_resistance_force + wheel_force;
        var best_gear = temp_car.data.gear;

        for (let i = 1; i <= car.properties.gear_ratios.length; i++) {
            temp_car.data.gear = i;
            temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);
            wheel_force = calculator.wheel_force(JSON.parse(JSON.stringify(temp_car)));
            let difference = grade_resistance_force + wheel_force;

            if (difference >= 0 && Math.abs(difference) < Math.abs(smallest_difference)) {
                best_gear = i;
                smallest_difference = difference;
            }
        }

        if (car.data.gear != best_gear) {
            car.shift_into_gear(best_gear);
        }
    }

    else {
        autoshift_strategy_5_2();
    }
}



/*
Gear selection based on engine speed
Maximum acceleration
*/

function autoshift_strategy_5_2() {
    if (car.data.shift_progress == 1) {
        var gear_found = false;


        while (gear_found === false) {
            gear_found = true;


            //calculate target engine speed
            var maximum_sensible_rpm;

            if (car.data.gear < car.properties.gear_ratios.length) {
                let current_gear = car.properties.gear_ratios[car.data.gear - 1];
                let next_gear = car.properties.gear_ratios[car.data.gear];

                maximum_sensible_rpm = 2 * current_gear * car.properties.max_torque_rpm * 
                                       (next_gear ** 2 - current_gear ** 2) / (next_gear ** 3 - current_gear ** 3);
            }
            else {
                let last_gear = car.properties.gear_ratios[car.properties.gear_ratios.length - 1];
                let second_last_gear = car.properties.gear_ratios[car.properties.gear_ratios.length - 2];

                maximum_sensible_rpm = 2 * second_last_gear * car.properties.max_torque_rpm
                                       * (last_gear ** 2 - second_last_gear ** 2) / (last_gear ** 3 - second_last_gear ** 3);
            }

            if (maximum_sensible_rpm > car.properties.rpm_limiter) {
                maximum_sensible_rpm = car.properties.rpm_limiter - 1;
            }

            var target_rpm = (1 - car.data.throttle ** 3) * (car.properties.idle_rpm)
                             + (car.data.throttle ** 3) * (maximum_sensible_rpm);


            //shift up or down to prevent the engine from reaching unsensible speeds
            let temp_car = JSON.parse(JSON.stringify(car));
            temp_car.data.shift_progress = 1;
            temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);

            if (temp_car.data.rpm >= maximum_sensible_rpm) {
                car.shift_up();
            }
            else if (temp_car.data.rpm < car.properties.idle_rpm) {
                car.shift_down();
            }


            /*
            if the current gear is not good enough, find the gear in
            which the engine speed is as close as possible to the target
            */
            var best_gear = car.data.gear;
            var smallest_difference = Math.abs(target_rpm - temp_car.data.rpm);
            var gear_hunt_threshold = (car.properties.rpm_limiter - car.properties.idle_rpm) / 6;

            if (smallest_difference > gear_hunt_threshold) {
                for (let i = 0; i < car.properties.gear_ratios.length; i++) {
                    let temp_rpm = temp_car.data.rpm * (car.properties.gear_ratios[i] /
                                   car.properties.gear_ratios[temp_car.data.gear - 1]);

                    let temp_diff = Math.abs(target_rpm - temp_rpm);

                    if (temp_diff < smallest_difference) {
                        best_gear = i + 1;
                        smallest_difference = temp_diff;
                    }
                }
            }


            /*
            shift into the gear which is next to the current gear and closer to the best gear,
            if it won't cause the engine to spin at unsensible speeds
            */
            if (car.data.gear < best_gear) {
                temp_car.data.gear = car.data.gear + 1;
                temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);

                if (temp_car.data.rpm > car.properties.idle_rpm) {
                    car.shift_up();
                    gear_found = false;
                }
            }
            else if (car.data.gear > best_gear) {
                temp_car.data.gear = car.data.gear - 1;
                temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);

                if (temp_car.data.rpm <= maximum_sensible_rpm) {
                    car.shift_down();
                    gear_found = false;
                }
            }
        }
    }
}



/*
Gear selection based on engine speed
*/
function autoshift_strategy_5_1() {
    if (car.data.shift_progress == 1) {
        var gear_found = false;

        while (gear_found === false) {
            gear_found = true;


            var target_rpm = (1 - car.data.throttle ** 3) * (car.properties.idle_rpm)
                             + (car.data.throttle ** 3) * car.properties.rpm_limiter;


            let temp_car = JSON.parse(JSON.stringify(car));
            temp_car.data.shift_progress = 1;
            temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);


            /*
            if the current gear is not good enough, find the gear in
            which the engine speed is as close as possible to the target
            */
            var best_gear = car.data.gear;
            var smallest_difference = Math.abs(target_rpm - temp_car.data.rpm);
            var gear_hunt_threshold = (car.properties.rpm_limiter - car.properties.idle_rpm) / 6;

            if (smallest_difference > gear_hunt_threshold) {
                for (let i = 0; i < car.properties.gear_ratios.length; i++) {
                    let temp_rpm = temp_car.data.rpm * (car.properties.gear_ratios[i]
                                   / car.properties.gear_ratios[temp_car.data.gear - 1]);
                    let temp_diff = Math.abs(target_rpm - temp_rpm);

                    if (temp_diff < smallest_difference) {
                        best_gear = i + 1;
                        smallest_difference = temp_diff;
                    }
                }
            }


            /*
            shift into the gear which is next to the current gear and closer to the best gear,
            if it won't cause the engine to spin at unsensible speeds
            */
            if (car.data.gear < best_gear) {
                temp_car.data.gear = car.data.gear + 1;
                temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);

                if (temp_car.data.rpm > car.properties.idle_rpm) {
                    car.shift_up();
                    gear_found = false;
                }
            }
            else if (car.data.gear > best_gear) {
                temp_car.data.gear = car.data.gear - 1;
                temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);

                if (temp_car.data.rpm <= car.properties.rpm_limiter) {
                    car.shift_down();
                    gear_found = false;
                }
            }

            if (car.data.rpm >= car.properties.rpm_limiter - 1) {
                car.shift_up();
            }
            else if (car.data.rpm < car.properties.idle_rpm) {
                car.shift_down();
            }
        }
    }
}



/*
Gear selection based on gear ratios
*/

function autoshift_strategy_4() {
    if (car.data.shift_progress == 1) {
        var gear_found = false;

        while (gear_found === false) {
            gear_found = true;


            //calculate target gear ratio
            var temp_car = JSON.parse(JSON.stringify(car));
            temp_car.data.shift_progress = 1;
            temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);


            var accel_gear_ratio = (car.properties.max_power_rpm / temp_car.data.rpm)
                                   * car.properties.gear_ratios[temp_car.data.gear - 1];

            if (accel_gear_ratio > car.properties.gear_ratios[0]) {
                accel_gear_ratio = car.properties.gear_ratios[0];
            }

            else if (accel_gear_ratio < car.properties.gear_ratios[car.properties.gear_ratios.length - 1]) {
                accel_gear_ratio = car.properties.gear_ratios[car.properties.gear_ratios.length - 1];
            }

            var eco_gear_ratio = ((car.properties.idle_rpm + 500) / temp_car.data.rpm)
                                 * car.properties.gear_ratios[temp_car.data.gear - 1];

            if (eco_gear_ratio > car.properties.gear_ratios[0]) {
                eco_gear_ratio = car.properties.gear_ratios[0];
            }

            else if (eco_gear_ratio < car.properties.gear_ratios[car.properties.gear_ratios.length - 1]) {
                eco_gear_ratio = car.properties.gear_ratios[car.properties.gear_ratios.length - 1];
            }

            var target_gear_ratio = (1 - car.data.throttle ** 3) * eco_gear_ratio
                                    + (car.data.throttle ** 3) * accel_gear_ratio;


            /*
            gear_hunt_factor is used to reduce gear hunting
            its value is depentent on the resistive forces on the car
            */
            var gear_hunt_factor;

            if (car.data.throttle == 1) {
                gear_hunt_factor = 1;
            }

            else {
                var deceleration;

                var angle_accel = -1 * Math.sin(angle * Math.PI/180) * 9.81;
                var air_accel = 0;
                var rolling_accel = 0;

                if (air_resistance === true) {
                    air_accel = (-1 * 0.5 * 1.204 * (car.data.speed ** 2) * car.properties.drag_coefficient
                                * car.properties.frontal_area) / car.properties.mass;
                }

                if (rolling_resistance === true) {
                    rolling_accel = (0.01 * Math.cos((angle * 2 * Math.PI) / 360) * car.properties.mass * 9.81)
                                    / car.properties.mass;
                }

                deceleration = -1 * (angle_accel + air_accel + rolling_accel);

                if (deceleration > 0.7) {
                    gear_hunt_factor = 0.2;
                }
                else if (deceleration > 0.5) {
                    gear_hunt_factor = 0.3;
                }
                else if (deceleration > 0.2) {
                    gear_hunt_factor = 0.5;
                }
                else {
                    gear_hunt_factor = 0.75;
                }
            }


            //find the gear with the smallest difference between its gear ratio and the target gear ratio
            var best_gear = car.data.gear;
            var smallest_difference = Math.abs(target_gear_ratio - car.properties.gear_ratios[car.data.gear - 1]);
            var current_difference = smallest_difference;

            for (let i = 0; i < car.properties.gear_ratios.length; i++) {
                let difference = Math.abs(target_gear_ratio - car.properties.gear_ratios[i]);

                if (difference < smallest_difference && difference < current_difference * gear_hunt_factor) {
                    best_gear = i + 1;
                    smallest_difference = Math.abs(difference);
                }
            }


            //shift into the gear which is next to the current gear and closer to the best gear
            temp_car.data.gear = best_gear;
            temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);

            if (car.data.gear < best_gear && temp_car.data.rpm > car.properties.idle_rpm) {
                car.shift_up();
                gear_found = false;
            }
            else if (car.data.gear > best_gear && temp_car.data.rpm < car.properties.rpm_limiter) {
                car.shift_down();
                gear_found = false;
            }

            //shift up or down to prevent the engine from exeeding its operating speeds
            if (car.data.rpm >= car.properties.rpm_limiter - 1) {
                car.shift_up();
            }
            else if (car.data.rpm < car.properties.idle_rpm) {
                car.shift_down();
            }
        }
    }
}



/*
Gear selection based on acceleration
*/

function autoshift_strategy_3() {
    if (car.data.shift_progress == 1) {
        var gear_found = false;

        while (gear_found === false) {
            gear_found = true;


            //calculate target acceleration
            var temp_car = JSON.parse(JSON.stringify(car));
            temp_car.data.rpm = temp_car.properties.max_power_rpm;

            var optimal_gear_ratio = (temp_car.data.rpm * Math.PI * temp_car.properties.tire_diameter)
                                     / (60 * temp_car.data.speed * temp_car.properties.final_drive);

            if (optimal_gear_ratio < car.properties.gear_ratios[car.properties.gear_ratios.length - 1]) {
                optimal_gear_ratio = car.properties.gear_ratios[car.properties.gear_ratios.length - 1];
            }
            else if (optimal_gear_ratio > car.properties.gear_ratios[0]) {
                optimal_gear_ratio = car.properties.gear_ratios[0];
            }

            temp_car.properties.gear_ratios[0] = optimal_gear_ratio;
            temp_car.data.gear = 1;
            temp_car.data.shift_progress = 1;
            temp_car.data.throttle = 1;
            var maximum_acceleration = calculator.acceleration(temp_car);

            var target_acceleration = ((car.data.throttle ** 3) * maximum_acceleration);


            //find the gear which results in the acceleration being as close as possible to the target acceleration
            var temp_car_2 = JSON.parse(JSON.stringify(car));
            temp_car_2.data.shift_progress = 1;
            var best_gear = car.data.gear;
            var smallest_difference = Math.abs(target_acceleration - calculator.acceleration(car));
            var current_difference = smallest_difference;

            for (let temp_gear = 1; temp_gear <= temp_car_2.properties.gear_ratios.length; temp_gear += 1) {
                temp_car_2.data.gear = temp_gear;
                temp_car_2.data.rpm = calculator.rpm_from_speed(temp_car_2, temp_car_2.data.speed);
                let temp_accel = calculator.acceleration(temp_car_2);
                let temp_diff = Math.abs(target_acceleration - temp_accel); 

                if (temp_diff < smallest_difference && temp_diff < current_difference){
                    best_gear = temp_gear;
                    smallest_difference = temp_diff;
                }
            }


            //shift into the gear which is next to the current gear and closer to the best gear
            temp_car = JSON.parse(JSON.stringify(car));
            temp_car.data.gear = best_gear;
            temp_car.data.shift_progress = 1;
            temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);

            if (car.data.gear < best_gear && temp_car.data.rpm > car.properties.idle_rpm) {
                car.shift_up();
                gear_found = false;
            }
            else if (car.data.gear > best_gear && temp_car.data.rpm < car.properties.rpm_limiter) {
                car.shift_down();
                gear_found = false;
            }

            //shift up or down to prevent the engine from exeeding its operating speeds
            if (car.data.rpm >= car.properties.rpm_limiter - 1) {
                car.shift_up();
            }
            else if (car.data.rpm < car.properties.idle_rpm) {
                car.shift_down();
            }
        }
    }
}
