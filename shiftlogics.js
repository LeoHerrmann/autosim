/*
Variante 1
Drehzahlen zum hoch und runterschaten werden bestimmt
Runterschalten, wenn unter Runterdrehzahl; hochschalten, wenn über Hochdrehzahl
Problem: Gear hunting bergauf
Lösung: up_down_offset
Problem: Ineffizienz
Lösung: up_down_offset mit incline vergrößern?

Variante 3
gear_ratio_accel wird bestimmt
target_acceleration bestimmen mit Gas
Gang nehmen, der target_acceleration am nächsten kommt
Problem: Komisches Schaltverhalten bei konstantem Gas
Lösung: geringere Potenz nach car.throttle
Problem: Ineffizienz Bergauf
Lösung: Drehzahlbegrenzer bei Teillast runterstellen?

Variante 4
gear_ratio_accel und gear_ratio_eco bestimmen
Gang nehmen, der target_gear_ratio am nächsten kommt
Problem: Gear hunting bergauf
Lösung: aktuellen Gang bevorzugen
Problem: Ineffizienz bergauf und bei hohen Geschwindigkeiten
Lösung: Faktor mit Fahrwiderstand erhöhen
Verbesserung: Mehrere Target gear ratios bestimmen und dazwischen ist okay?

Variante 5
Gas bestimmt die Drehzahl
*/



function autoshift_logic_5_3() {
    if (car.data.shift_progress == 1) {
        if (car.data.throttle < 0.02 && angle < 0) {
            if (car.data.brake != 0) {
                return false;
            }

            var angle_force = -1 * Math.sin(angle * Math.PI/180) * 9.81 * car.properties.mass;

            var temp_car = JSON.parse(JSON.stringify(car));
            temp_car.data.gear = car.properties.gear_ratios.length;
            temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);
            var wheel_force = calculator.wheel_force(temp_car);


            var smallest_difference = angle_force + wheel_force ;
            var best_gear = temp_car.data.gear;


            for (let i = 1; i <= car.properties.gear_ratios.length; i++) {
                temp_car.data.gear = i;
                temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);
                wheel_force = calculator.wheel_force(JSON.parse(JSON.stringify(temp_car)));
                let difference = angle_force + wheel_force;

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
            did_shift = true;

            while (did_shift) {
                did_shift = false;


                var maximum_sensible_rpm;

                if (car.data.gear < car.properties.gear_ratios.length) {
                    maximum_sensible_rpm = (2 * car.properties.gear_ratios[car.data.gear - 1] * car.properties.max_torque_rpm * (1 * car.properties.gear_ratios[car.data.gear] + 1 * car.properties.gear_ratios[car.data.gear - 1])) / (car.properties.gear_ratios[car.data.gear]**2 + car.properties.gear_ratios[car.data.gear] * car.properties.gear_ratios[car.data.gear - 1] + car.properties.gear_ratios[car.data.gear - 1]**2);
                }
                else {
                    maximum_sensible_rpm = (2 * car.properties.gear_ratios[car.data.gear - 2] * car.properties.max_torque_rpm * (1 * car.properties.gear_ratios[car.data.gear - 1] + 1 * car.properties.gear_ratios[car.data.gear - 2])) / (car.properties.gear_ratios[car.data.gear - 1]**2 + car.properties.gear_ratios[car.data.gear - 1] * car.properties.gear_ratios[car.data.gear - 2] + car.properties.gear_ratios[car.data.gear - 2]**2);
                }

                if (maximum_sensible_rpm > car.properties.rpm_limiter) {
                    maximum_sensible_rpm = car.properties.rpm_limiter;
                }


                var target_rpm = (1 - car.data.throttle ** 3) * (car.properties.idle_rpm) + (car.data.throttle ** 3) * maximum_sensible_rpm;

                let temp_car = JSON.parse(JSON.stringify(car));
                temp_car.data.shift_progress = 1;
                temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);

                var best_gear = car.data.gear;
                var current_difference = Math.abs(target_rpm - temp_car.data.rpm);
                var gear_hunt_threshold = (car.properties.rpm_limiter - car.properties.idle_rpm) / 10;
                var smallest_difference = current_difference;

                if (current_difference > gear_hunt_threshold || car.data.throttle == 1) {
                    for (let i = 0; i < car.properties.gear_ratios.length; i++) {
                        let temp_rpm = temp_car.data.rpm * (car.properties.gear_ratios[i] / car.properties.gear_ratios[temp_car.data.gear - 1]);

                        let temp_diff = Math.abs(target_rpm - temp_rpm);

                        if (temp_diff < smallest_difference) {
                            best_gear = i + 1;
                            smallest_difference = temp_diff;
                        }
                    }
                }


                if (frame_number == 40) {
                    console.log(Math.round(target_rpm), Math.round(target_rpm - gear_hunt_threshold), Math.round(target_rpm + gear_hunt_threshold));
                }


                temp_car.data.gear = best_gear;
                temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);


                if (car.data.gear < best_gear && temp_car.data.rpm > car.properties.idle_rpm) {
                    car.shift_up();
                    did_shift = true;
                }
                else if (car.data.gear > best_gear && temp_car.data.rpm <= maximum_sensible_rpm) {
                    car.shift_down();
                    did_shift = true;
                }

                if (car.data.rpm >= maximum_sensible_rpm) {
                    car.shift_up();
                }
                else if (car.data.rpm < car.properties.idle_rpm) {
                    car.shift_down();
                }
            }
        }
    }
}



function autoshift_logic_5_2() {
    if (car.data.shift_progress == 1) {
        did_shift = true;

        while (did_shift) {
            did_shift = false;


            var maximum_sensible_rpm;

            if (car.data.gear < car.properties.gear_ratios.length) {
                maximum_sensible_rpm = (2 * car.properties.gear_ratios[car.data.gear - 1] * car.properties.max_torque_rpm * (1 * car.properties.gear_ratios[car.data.gear] + 1 * car.properties.gear_ratios[car.data.gear - 1])) / (car.properties.gear_ratios[car.data.gear]**2 + car.properties.gear_ratios[car.data.gear] * car.properties.gear_ratios[car.data.gear - 1] + car.properties.gear_ratios[car.data.gear - 1]**2);
            }
            else {
                maximum_sensible_rpm = (2 * car.properties.gear_ratios[car.data.gear - 2] * car.properties.max_torque_rpm * (1 * car.properties.gear_ratios[car.data.gear - 1] + 1 * car.properties.gear_ratios[car.data.gear - 2])) / (car.properties.gear_ratios[car.data.gear - 1]**2 + car.properties.gear_ratios[car.data.gear - 1] * car.properties.gear_ratios[car.data.gear - 2] + car.properties.gear_ratios[car.data.gear - 2]**2);
            }

            if (maximum_sensible_rpm > car.properties.rpm_limiter) {
                maximum_sensible_rpm = car.properties.rpm_limiter;
            }


            var target_rpm = (1 - car.data.throttle ** 3) * (car.properties.idle_rpm) + (car.data.throttle ** 3) * maximum_sensible_rpm;

            let temp_car = JSON.parse(JSON.stringify(car));
            temp_car.data.shift_progress = 1;
            temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);

            var best_gear = car.data.gear;
            var current_difference = Math.abs(target_rpm - temp_car.data.rpm);
            var gear_hunt_threshold = (car.properties.rpm_limiter - car.properties.idle_rpm) / 10;
            var smallest_difference = current_difference;

            if (current_difference > gear_hunt_threshold || car.data.throttle == 1) {
                for (let i = 0; i < car.properties.gear_ratios.length; i++) {
                    let temp_rpm = temp_car.data.rpm * (car.properties.gear_ratios[i] / car.properties.gear_ratios[temp_car.data.gear - 1]);

                    let temp_diff = Math.abs(target_rpm - temp_rpm);

                    if (temp_diff < smallest_difference) {
                        best_gear = i + 1;
                        smallest_difference = temp_diff;
                    }
                }
            }


            if (frame_number == 40) {
                console.log(Math.round(target_rpm), Math.round(target_rpm - gear_hunt_threshold), Math.round(target_rpm + gear_hunt_threshold));
            }


            temp_car.data.gear = best_gear;
            temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);

            if (car.data.gear < best_gear && temp_car.data.rpm > car.properties.idle_rpm) {
                car.shift_up();
                did_shift = true;
            }
            else if (car.data.gear > best_gear && temp_car.data.rpm <= maximum_sensible_rpm) {
                car.shift_down();
                did_shift = true;
            }

            if (car.data.rpm >= maximum_sensible_rpm) {
                car.shift_up();
            }
            else if (car.data.rpm < car.properties.idle_rpm) {
                car.shift_down();
            }
        }
    }
}



function autoshift_logic_5() {
    if (car.data.shift_progress == 1) {
        did_shift = true;

        while (did_shift) {
            did_shift = false;

            var target_rpm = (1 - car.data.throttle ** 3) * (car.properties.idle_rpm) + (car.data.throttle ** 3) * car.properties.rpm_limiter;

            let temp_car = JSON.parse(JSON.stringify(car));
            temp_car.data.shift_progress = 1;
            temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);

            var best_gear = car.data.gear;
            var current_difference = Math.abs(target_rpm - temp_car.data.rpm);
            var gear_hunt_threshold = (car.properties.rpm_limiter - car.properties.idle_rpm) / 10;
            var smallest_difference = current_difference;

            if (current_difference > gear_hunt_threshold || car.data.throttle == 1) {
                for (let i = 0; i < car.properties.gear_ratios.length; i++) {
                    let temp_rpm = temp_car.data.rpm * (car.properties.gear_ratios[i] / car.properties.gear_ratios[temp_car.data.gear - 1]);
                    let temp_diff = Math.abs(target_rpm - temp_rpm);

                    if (temp_diff < smallest_difference) {
                        best_gear = i + 1;
                        smallest_difference = temp_diff;
                    }
                }
            }

            if (frame_number == 40) {
                console.log(Math.round(target_rpm), Math.round(target_rpm - gear_hunt_threshold), Math.round(target_rpm + gear_hunt_threshold));
            }


            temp_car.data.gear = best_gear;
            temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);

            if (car.data.gear < best_gear && temp_car.data.rpm > car.properties.idle_rpm) {
                car.shift_up();
                did_shift = true;
            }
            else if (car.data.gear > best_gear && temp_car.data.rpm < car.properties.rpm_limiter) {
                car.shift_down();
                did_shift = true;
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



function autoshift_logic_4() {
    var accel_gear_ratio = ((car.properties.max_power_rpm) / car.data.rpm) * car.properties.gear_ratios[car.data.gear - 1];

    if (accel_gear_ratio > car.properties.gear_ratios[0]) {
        accel_gear_ratio = car.properties.gear_ratios[0];
    }

    else if (accel_gear_ratio < car.properties.gear_ratios[car.properties.gear_ratios.length - 1]) {
        accel_gear_ratio = car.properties.gear_ratios[car.properties.gear_ratios.length - 1];
    }

    var eco_gear_ratio = ((car.properties.idle_rpm + 500) / car.data.rpm) * car.properties.gear_ratios[car.data.gear - 1];

    if (eco_gear_ratio > car.properties.gear_ratios[0]) {
        eco_gear_ratio = car.properties.gear_ratios[0];
    }

    else if (eco_gear_ratio < car.properties.gear_ratios[car.properties.gear_ratios.length - 1]) {
        eco_gear_ratio = car.properties.gear_ratios[car.properties.gear_ratios.length - 1];
    }


    var target_gear_ratio = (1 - car.data.throttle ** 3.1) * eco_gear_ratio + (car.data.throttle ** 3.1) * accel_gear_ratio;


    var factor;

    if (car.data.throttle == 1) {
        factor = 1;
    }

    else {
        var deceleration;

        var angle_accel = -1 * Math.sin(angle * Math.PI/180) * 9.81;
        var air_accel = 0;

        if (aerodynamics === true) {
            air_accel = (-1 * 0.5 * 1.23 * (car.data.speed ** 2) * car.properties.drag_coefficient * car.properties.frontal_area) / car.properties.mass;
        }

        deceleration = -1 * angle_accel + -1 * air_accel;

        if (frame_number % 40 == 0) {
            console.log(deceleration);
        }

        if (deceleration > 0.7) {
            factor = 0.2;
        }
        else if (deceleration > 0.5) {
            factor = 0.3;
        }
        else if (deceleration > 0.2) {
            factor = 0.5;
        }
        else {
            factor = 0.75;
        }
    }


    var best_gear = car.data.gear;
    var smallest_difference = Math.abs(target_gear_ratio - car.properties.gear_ratios[car.data.gear - 1]);
    var current_difference = smallest_difference;

    for (let i = 0; i < car.properties.gear_ratios.length; i++) {
        let difference = Math.abs(target_gear_ratio - car.properties.gear_ratios[i]);

        if (difference < smallest_difference && difference < current_difference * factor) {
            best_gear = i + 1;
            smallest_difference = Math.abs(difference);
        }
    }


    if (car.data.shift_progress == 1) {
        if (car.data.gear != best_gear) {
            car.shift_into_gear(best_gear);
        }

        if (car.data.rpm >= car.properties.rpm_limiter - 2) {
            car.shift_up();
        }
        else if (car.data.rpm < car.properties.idle_rpm) {
            car.shift_down();
        }
    }
}



function autoshift_logic_3() {
    var temp_car = JSON.parse(JSON.stringify(car));
    temp_car.data.rpm = temp_car.properties.max_power_rpm;


    var optimal_gear_ratio = (temp_car.data.rpm * Math.PI * temp_car.properties.tire_diameter) / (60 * temp_car.data.speed * temp_car.properties.final_drive);

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


    var target_acceleration = ((car.data.throttle ** 2) * maximum_acceleration);


    if (frame_number % 40 == 0) {
        console.log(Math.round(target_acceleration * 100) / 100, Math.round(maximum_acceleration * 100) / 100, calculator.acceleration(car), car.data.gear);
    }


    var temp_car_2 = JSON.parse(JSON.stringify(car));
    var best_gear = car.data.gear;
    var smallest_difference = Math.abs(target_acceleration - calculator.acceleration(car));
    var current_difference = smallest_difference;

    for (let temp_gear = 1; temp_gear <= temp_car_2.properties.gear_ratios.length; temp_gear += 1) {
        temp_car_2.data.gear = temp_gear;
        temp_car_2.data.rpm = calculator.rpm_from_speed(temp_car_2, temp_car_2.data.speed);
        let temp_accel = calculator.acceleration(temp_car_2);
        let temp_diff = Math.abs(target_acceleration - temp_accel); 

        if (temp_diff < smallest_difference && temp_diff < current_difference * 1){//0.95) {
            best_gear = temp_gear;
            smallest_difference = temp_diff;
        }
    }


    if (car.data.shift_progress == 1) {
        if (car.data.gear != best_gear) {
            car.shift_into_gear(best_gear);
        }

        if (car.data.rpm >= car.properties.rpm_limiter - 2) {
            car.shift_up();
        }
        else if (car.data.rpm < car.properties.idle_rpm) {
            car.shift_down();
        }
    }
}






function autoshift_logic_1() {
    var sportiness = car.data.throttle ** 3;
    var up_down_offset = 0;


    if (car.data.throttle != 1) {
        var deceleration;

        var angle_accel = -1 * Math.sin(angle * Math.PI/180) * 9.81;
        var air_accel = 0;

        if (aerodynamics === true) {
            air_accel = (-1 * 0.5 * 1.23 * (car.data.speed ** 2) * car.properties.drag_coefficient * car.properties.frontal_area) / car.properties.mass;
        }

        deceleration = -1 * angle_accel + -1 * air_accel;


        /*if (frame_number % 40 == 0) {
            console.log(deceleration);
        }*/

        if (deceleration > 0.75) {
            up_down_offset = car.properties.rpm_limiter / 5;
        }
        else if (deceleration > 0.5) {
            up_down_offset = car.properties.rpm_limiter / 7.5;
        }
        else {
            up_down_offset = car.properties.rpm_limiter / 10;
        }
    }


    if (car.data.shift_progress == 1) {
        var did_shift = true;

        while (did_shift == true) {
           did_shift = false;

            var acceleration_upshift = (2 * car.properties.gear_ratios[car.data.gear - 1] * car.properties.max_torque_rpm * (car.data.throttle * car.properties.gear_ratios[car.data.gear] + car.data.throttle * car.properties.gear_ratios[car.data.gear - 1])) / (car.properties.gear_ratios[car.data.gear]**2 + car.properties.gear_ratios[car.data.gear] * car.properties.gear_ratios[car.data.gear - 1] + car.properties.gear_ratios[car.data.gear - 1]**2);

            if (acceleration_upshift > car.properties.rpm_limiter) {
                acceleration_upshift = car.properties.rpm_limiter - 1;
            }

            var eco_upshift = (car.properties.idle_rpm + up_down_offset) * (car.properties.gear_ratios[car.data.gear - 1] / car.properties.gear_ratios[car.data.gear]);

            var upshift = (1 - sportiness) * eco_upshift + sportiness * acceleration_upshift;

            var temp_car = JSON.parse(JSON.stringify(car));
            temp_car.data.shift_progress = 1;

            if (calculator.rpm_from_speed(temp_car, car.data.speed) >= upshift) {
                did_shift = car.shift_up();
            }
        }
    }


    if (car.data.shift_progress == 1) {
        var did_shift = true;

        while (did_shift == true) {
            did_shift = false;

            var acceleration_downshift = (2 * car.properties.gear_ratios[car.data.gear - 1] * car.properties.max_torque_rpm * (car.data.throttle * car.properties.gear_ratios[car.data.gear - 2] + car.data.throttle * car.properties.gear_ratios[car.data.gear - 1])) / (car.properties.gear_ratios[car.data.gear - 2]**2 + car.properties.gear_ratios[car.data.gear - 2] * car.properties.gear_ratios[car.data.gear - 1] + car.properties.gear_ratios[car.data.gear - 1]**2) - up_down_offset;

            if (acceleration_downshift < car.properties.idle_rpm) {
                acceleration_downshift = car.properties.idle_rpm;
            }

            var eco_downshift = car.properties.idle_rpm;

            var downshift = (1 - sportiness) * eco_downshift + sportiness * acceleration_downshift;
            var temp_car = JSON.parse(JSON.stringify(car));
            temp_car.data.shift_progress = 1;

            if (calculator.rpm_from_speed(temp_car, car.data.speed) <= downshift) {
                did_shift = car.shift_down();
            }
        }
    }

    if (frame_number % 10 == 0) {
        console.log(upshift, downshift);
    }
}
