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
Lösung: aktuellen Gang bevorzugen (nur bergauf?)

Variante 5
Gas bestimmt die Drehzahl
Problem: Gear hunting bergauf
*/


function autoshift_logic_5() {
    var target_rpm = (1 - car.data.throttle ** 3) * car.data.idle_rpm + (car.data.throttle ** 3) * car.data.rpm_limiter;

    var best_gear = car.data.gear;
    var smallest_difference = Math.abs(target_rpm - car.data.rpm);
    var current_difference = smallest_difference;

    for (let i = 0; i < car.data.gear_ratios.length; i++) {
        temp_rpm = car.data.rpm * (car.data.gear_ratios[i] / car.data.gear_ratios[car.data.gear - 1]);
        var temp_diff = Math.abs(target_rpm - temp_rpm);

        if (temp_diff < smallest_difference && temp_diff < current_difference * 0.5) {
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

        if (car.data.rpm >= car.data.rpm_limiter - 2) {
            car.shift_up();
        }
        else if (car.data.rpm < car.data.idle_rpm) {
            car.shift_down();
        }
    }
}



function autoshift_logic_4() {
    var accel_gear_ratio = (car.data.max_power_rpm * Math.PI * car.data.tire_diameter) / (60 * car.data.speed * car.data.final_drive);

    if (accel_gear_ratio > car.data.gear_ratios[0]) {
        accel_gear_ratio = car.data.gear_ratios[0];
    }

    else if (accel_gear_ratio < car.data.gear_ratios[car.data.gear_ratios.length - 1]) {
        accel_gear_ratio = car.data.gear_ratios[car.data.gear_ratios.length - 1];
    }

    var eco_gear_ratio = (car.data.idle_rpm / car.data.rpm) * car.data.gear_ratios[car.data.gear - 1];

    if (eco_gear_ratio > car.data.gear_ratios[0]) {
        eco_gear_ratio = car.data.gear_ratios[0];
    }

    else if (eco_gear_ratio < car.data.gear_ratios[car.data.gear_ratios.length - 1]) {
        eco_gear_ratio = car.data.gear_ratios[car.data.gear_ratios.length - 1];
    }

    var target_gear_ratio = (1 - car.data.throttle ** 2) * eco_gear_ratio + (car.data.throttle ** 2) * accel_gear_ratio;


    var best_gear = car.data.gear;
    var smallest_difference = Math.abs(target_gear_ratio - car.data.gear_ratios[car.data.gear - 1]);
    var current_difference = smallest_difference;

    for (let i = 0; i < car.data.gear_ratios.length; i++) {
        let difference = Math.abs(target_gear_ratio - car.data.gear_ratios[i]);

        if (difference < smallest_difference && difference < current_difference * 0.75) {
            best_gear = i + 1;
            smallest_difference = Math.abs(difference);
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



function autoshift_logic_3() {
    var temp_car = JSON.parse(JSON.stringify(car));
    //temp_car.data.rpm = temp_car.data.max_torque_rpm;
    temp_car.data.rpm = temp_car.data.max_power_rpm;


    var optimal_gear_ratio = (temp_car.data.rpm * Math.PI * temp_car.data.tire_diameter) / (60 * temp_car.data.speed * temp_car.data.final_drive);

    if (optimal_gear_ratio < car.data.gear_ratios[car.data.gear_ratios.length - 1]) {
        optimal_gear_ratio = car.data.gear_ratios[car.data.gear_ratios.length - 1];
    }
    /*else if (optimal_gear_ratio > car.data.gear_ratios[0]) {
        optimal_gear_ratio = car.data.gear_ratios[0];
    }*/


    temp_car.data.gear_ratios[0] = optimal_gear_ratio;
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

    for (let temp_gear = 1; temp_gear <= temp_car_2.data.gear_ratios.length; temp_gear += 1) {
        temp_car_2.data.gear = temp_gear;
        temp_car_2.data.rpm = calculator.rpm_from_speed(temp_car_2, temp_car_2.data.speed);
        let temp_accel = calculator.acceleration(temp_car_2);
        let temp_diff = Math.abs(target_acceleration - temp_accel); 

        if (temp_diff < smallest_difference && temp_diff < current_difference * 0.95) {
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






function autoshift_logic_1() {
    var sportiness = car.data.throttle ** 3;
    var up_down_offset = car.data.rpm_limiter / 8;


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
                did_shift = car.shift_down();
            }
        }
    }

    if (frame_number % 10 == 0) {
        console.log(upshift, downshift);
    }
}
