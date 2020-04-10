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
    var max_accel_gear = 0;

    for (let temp_car_2 of temp_cars) {
        //if (temp_car_2.data.rpm >= temp_car_2.data.idle_rpm - 50 && temp_car_2.data.rpm < temp_car_2.data.rpm_limiter) {
            temp_car_2.data.throttle = 1;
            let max_accel_temp = calculator.acceleration(temp_car_2); 

            if (max_accel_temp >= maximum_acceleration) {
                maximum_acceleration = max_accel_temp;
                max_accel_gear = temp_car_2.data.gear;
            }
        //}
    }



    /*var minimum_acceleration = Math.abs(maximum_acceleration);//calculator.acceleration(temp_cars[0]);
    var min_accel_gear = 0;

    for (let temp_car_2 of temp_cars) {
        if (temp_car_2.data.rpm >= temp_car_2.data.idle_rpm - 50 && temp_car_2.data.rpm < temp_car_2.data.rpm_limiter) {
            temp_car_2.data.throttle = 0.01;///!!!
            let min_accel_temp = calculator.acceleration(temp_car_2);

            if (Math.abs(min_accel_temp) <= Math.abs(minimum_acceleration)) {
                minimum_acceleration = min_accel_temp;
                min_accel_gear = temp_car_2.data.gear;
            }
        }
    }*/
    var minimum_acceleration = 0;



    var target_acceleration = (1 - car.data.throttle) * minimum_acceleration + car.data.throttle * maximum_acceleration;
    //var target_acceleration = (1 - car.data.throttle ** 3) * minimum_acceleration + (car.data.throttle ** 3) * maximum_acceleration;
    
    if (frame_number == 40) {
        console.log(maximum_acceleration);
        /*console.log(Math.round(target_acceleration * 100) / 100, Math.round(minimum_acceleration * 100) / 100, Math.round(maximum_acceleration * 100) / 100);*/
    }
    

    var best_gear = car.data.gear;
    var smallest_difference = Math.abs(target_acceleration - calculator.acceleration(car));

    for (let temp_car_2 of temp_cars) {
        if (temp_car_2.data.rpm >= temp_car_2.data.idle_rpm - 50 && temp_car_2.data.rpm < temp_car_2.data.rpm_limiter) {
            temp_car_2.data.throttle = car.data.throttle;
            let temp_difference = Math.abs(target_acceleration - calculator.acceleration(temp_car_2));

            if (temp_difference <= smallest_difference) {
                best_gear = temp_car_2.data.gear;
                smallest_difference = temp_difference;
            }
        }
    }
    
    if (car.data.shift_progress == 1) {
        car.shift_into_gear(best_gear);
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
