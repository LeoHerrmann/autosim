/*
Variante 1
Drehzahlen zum hoch und runterschaten werden bestimmt
Runterschalten, wenn unter Runterdrehzahl; hochschalten, wenn über Hochdrehzahl
Problem: Gear hunting bergauf

Variante 2
gear_with_max_accel wird bestimmt
target_acceleration mit max_accel und 0

Variante 3
gear_ratio_accel wird bestimmt
target_acceleration bestimmen mit Gas
Gang nehmen, der target_acceleration am nächsten kommt
Problem: Komisches Schaltverhalten bei konstantem Gas
Lösung: geringere Potenz nach car.throttle

Variante 4
gear_ratio_accel und gear_ratio_eco bestimmen
Gang nehmen, der target_gear_ratio am nächsten kommt
Problem: Gear hunting bergauf

Variante 5
Gas bestimmt die Drehzahl
*/


function autoshift_logic_5() {
    var target_rpm = (1 - car.data.throttle ** 3) * car.data.idle_rpm + (car.data.throttle ** 3) * car.data.rpm_limiter;

    var best_gear = car.data.gear;
    var smallest_difference = Math.abs(target_rpm - car.data.rpm);
    var current_difference = smallest_difference;

    for (let i = 0; i < car.data.gear_ratios.length; i++) {
        temp_rpm = car.data.rpm * (car.data.gear_ratios[i] / car.data.gear_ratios[car.data.gear - 1]);
        var temp_diff = Math.abs(target_rpm - temp_rpm);

        if (temp_diff < smallest_difference && temp_diff < current_difference * 0.75) {
            best_gear = i + 1;
            smallest_difference = temp_diff;
        }
    }

    if (frame_number == 40) {
        console.log(target_rpm, temp_rpm);
    }

    if (car.data.shift_progress == 1) {
        if (car.data.gear != best_gear) {
            car.shift_into_gear(best_gear);
        }
        else if (car.data.rpm >= car.data.rpm_limiter - 2) {
            car.shift_up();
        }
        else if (car.data.rpm < car.data.idle_rpm) {
            car.shift_down();
        }
    }
}



function autoshift_logic_4() {
    var accel_gear_ratio = (car.data.max_power_rpm * Math.PI * car.data.tire_diameter) / (60 * car.data.speed * car.data.final_drive);

    var eco_gear_ratio = (car.data.idle_rpm / car.data.rpm) * car.data.gear_ratios[car.data.gear - 1];

    var target_gear_ratio = (1 - car.data.throttle ** 2) * eco_gear_ratio + (car.data.throttle ** 2) * accel_gear_ratio;


    var best_gear = car.data.gear;
    var smallest_difference = Math.abs(target_gear_ratio - car.data.gear_ratios[car.data.gear - 1]);

    for (let i = 0; i < car.data.gear_ratios.length; i++) {
        let difference = Math.abs(target_gear_ratio - car.data.gear_ratios[i]);

        if (difference * 1 < smallest_difference * 1.15) {
            best_gear = i + 1;
            smallest_difference = Math.abs(difference);
        }
    }

            console.log();

    if (car.data.shift_progress == 1) {
        if (car.data.gear != best_gear) {
            car.shift_into_gear(best_gear);
        }
        else if (car.data.rpm >= car.data.rpm_limiter - 2) {
            car.shift_up();
        }
        else if (car.data.rpm < car.data.idle_rpm) {
            car.shift_down();
        }
    }
}



function autoshift_logic_3() {
    var temp_car = JSON.parse(JSON.stringify(car));
    //temp_car.data.rpm = temp_car.data.max_torque_rpm;
    temp_car.data.rpm = temp_car.data.max_power_rpm;


    var optimal_gear_ratio = (temp_car.data.rpm * Math.PI * temp_car.data.tire_diameter) / (60 * temp_car.data.speed * temp_car.data.final_drive);


    temp_car.data.gear_ratios[0] = optimal_gear_ratio;
    temp_car.data.gear = 1;
    temp_car.data.throttle = 1;
    var maximum_acceleration = calculator.acceleration(temp_car);


    var target_acceleration = (car.data.throttle ** 2) * maximum_acceleration;

    if (frame_number == 40) {
        console.log(Math.round(target_acceleration * 100) / 100, Math.round(maximum_acceleration * 100) / 100);
    }


    var temp_car_2 = JSON.parse(JSON.stringify(car));
    var best_gear = car.data.gear;
    var smallest_difference = Math.abs(target_acceleration - calculator.acceleration(car));
    var current_difference = smallest_difference;

    for (let temp_gear = 1; temp_gear <= temp_car_2.data.gear_ratios.length; temp_gear += 1) {
        temp_car_2.data.gear = temp_gear;
        temp_car_2.data.rpm = calculator.rpm_from_speed(temp_car_2, temp_car_2.data.speed);
        let temp_accel = calculator.acceleration(temp_car_2);
        let temp_diff = Math.abs(target_acceleration - temp_accel); 

        if (temp_diff < smallest_difference && temp_diff < current_difference * 0.85) {
            best_gear = temp_gear;
            smallest_difference = temp_diff;
        }
    }


    if (car.data.shift_progress == 1) {
        if (car.data.gear != best_gear) {
            car.shift_into_gear(best_gear);
        }

        if (car.data.rpm >= car.data.rpm_limiter - 2) {
            car.shift_up();
        }
        else if (car.data.rpm < car.data.idle_rpm) {
            car.shift_down();
        }
    }
}






function autoshift_logic_2() {
    var temp_car = JSON.parse(JSON.stringify(car));
    var temp_cars = [];

    for (let selected_gear = 1; selected_gear <= temp_car.data.gear_ratios.length; selected_gear += 1) {
        let temp_car_2 = JSON.parse(JSON.stringify(car));
        temp_car_2.data.gear = selected_gear;
        temp_car_2.data.rpm = calculator.rpm_from_speed(temp_car_2, temp_car_2.data.speed);
        temp_cars.push(temp_car_2);
    }


    var maximum_acceleration = calculator.acceleration(temp_cars[0]);

    for (let temp_car_2 of temp_cars) {
        if (temp_car_2.data.rpm >= temp_car_2.data.idle_rpm - 50 && temp_car_2.data.rpm < temp_car_2.data.rpm_limiter) {
            temp_car_2.data.throttle = 1;
            let max_accel_temp = calculator.acceleration(temp_car_2); 

            if (max_accel_temp >= maximum_acceleration) {
                maximum_acceleration = max_accel_temp;
                max_accel_gear = temp_car_2.data.gear;
            }
        }
    }


    var minimum_acceleration = 0;


    //var target_acceleration = (1 - car.data.throttle) * minimum_acceleration + car.data.throttle * maximum_acceleration;
    var target_acceleration = (1 - car.data.throttle ** 2) * minimum_acceleration + (car.data.throttle ** 2) * maximum_acceleration;

    if (frame_number == 40) {
        console.log(Math.round(target_acceleration * 100) / 100, Math.round(minimum_acceleration * 100) / 100, Math.round(maximum_acceleration * 100) / 100);
    }


    var best_gear = car.data.gear;
    var smallest_difference = Math.abs(target_acceleration - calculator.acceleration(car));

    for (let temp_car_2 of temp_cars) {
        if (temp_car_2.data.rpm >= temp_car_2.data.idle_rpm - 50 && temp_car_2.data.rpm < temp_car_2.data.rpm_limiter) {
            temp_car_2.data.throttle = car.data.throttle;
            let temp_difference = Math.abs(target_acceleration - calculator.acceleration(temp_car_2));

            if (temp_difference < smallest_difference) {
                best_gear = temp_car_2.data.gear;
                smallest_difference = temp_difference;
            }
        }
    }
    
    if (car.data.shift_progress == 1) {
        if (car.data.gear != best_gear) {
            car.shift_into_gear(best_gear);
        }
        else if (car.data.rpm >= car.data.rpm_limiter - 2) {
            car.shift_up();
        }
    }
}




function autoshift_logic_1() {
        var sportiness;

        var up_down_offset = car.data.rpm_limiter / 8;


        if (document.getElementById("autostrategy_input").checked === true) {
            sportiness = car.data.throttle ** 3;
            document.querySelector("#shift_strategy_input").value = sportiness;
            document.querySelector("#shift_strategy_input").disabled = true;
        }
        else {
            sportiness = parseFloat(document.querySelector("#shift_strategy_input").value);
            document.querySelector("#shift_strategy_input").disabled = false;
        }



        if (car.data.shift_progress == 1) {
            var did_shift = true;

            while (did_shift == true) {

               did_shift = false;

                var acceleration_upshift = (2 * car.data.gear_ratios[car.data.gear - 1] * car.data.max_torque_rpm * (car.data.throttle * car.data.gear_ratios[car.data.gear] + car.data.throttle * car.data.gear_ratios[car.data.gear - 1])) / (car.data.gear_ratios[car.data.gear]**2 + car.data.gear_ratios[car.data.gear] * car.data.gear_ratios[car.data.gear - 1] + car.data.gear_ratios[car.data.gear - 1]**2);

                if (acceleration_upshift > car.data.rpm_limiter) {
                    acceleration_upshift = car.data.rpm_limiter - 1;
                }

                var eco_upshift = (car.data.idle_rpm + up_down_offset) * (car.data.gear_ratios[car.data.gear - 1] / car.data.gear_ratios[car.data.gear]);

                var upshift = (1 - sportiness) * eco_upshift + sportiness * acceleration_upshift;

                var temp_car = JSON.parse(JSON.stringify(car));
                temp_car.data.shift_progress = 1;

                if (calculator.rpm_from_speed(temp_car, car.data.speed) >= upshift) {
                    /*car.shift_up();
                    did_shift = true;*/

                    did_shift = car.shift_up();
                }
            }
        }



        if (car.data.shift_progress == 1) {
            var did_shift = true;

            while (did_shift == true) {
                did_shift = false;

                var acceleration_downshift = (2 * car.data.gear_ratios[car.data.gear - 1] * car.data.max_torque_rpm * (car.data.throttle * car.data.gear_ratios[car.data.gear - 2] + car.data.throttle * car.data.gear_ratios[car.data.gear - 1])) / (car.data.gear_ratios[car.data.gear - 2]**2 + car.data.gear_ratios[car.data.gear - 2] * car.data.gear_ratios[car.data.gear - 1] + car.data.gear_ratios[car.data.gear - 1]**2) - up_down_offset;

                if (acceleration_downshift < car.data.idle_rpm) {
                    acceleration_downshift = car.data.idle_rpm;
                }

                var eco_downshift = car.data.idle_rpm;

                var downshift = (1 - sportiness) * eco_downshift + sportiness * acceleration_downshift;
                var temp_car = JSON.parse(JSON.stringify(car));
                temp_car.data.shift_progress = 1;

                if (calculator.rpm_from_speed(temp_car, car.data.speed) <= downshift) {
                    //WEIRDEST BUG EVER!!!!!!!!!!!!!!!!!
                    /*car.shift_down();
                    did_shift = true;*/

                    did_shift = car.shift_down();
                }
            }
        }
        if (frame_number % 10 == 0) {
        console.log(upshift, downshift);
    }
}
