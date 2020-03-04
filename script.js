//10vw -> 10m
//speed in m/s
//frame_rate in ms

//No Downshift when braking (can break traction limit and no ABS)

/*
Always shift up when redline is reached
Always shift down when idle rpm is reached
100% throttle: Shift for maximum acceleration -> when peak power is reached
0% throttle: Shift to the gear that maintains current speed best. -> Downshift on downhills
In between: Shift for maximum fuel economy; Go closer to redline the more throttle you give
*/

/*
Formular for calculating rpm for maximum acceleration
wheel_torque(current_rpm, current_gear) = wheel_torque(new_rpm, new_gear)
//rpm = (b * g * o * (n + o)) / (n ** 2 + n * o + o ** 2)
rpm = (2 * car.gear_ratios[car.gear - 1] * 4000 *(car.throttle * car.gear_ratios[car.gear] + car.throttle * car.gear_ratios[car.gear - 1])) / (car.gear_ratios[car.gear]**2 + car.gear_ratios[car.gear] * car.gear_ratios[car.gear - 1] + car.gear_ratios[car.gear - 1]**2)

Formular for shifting at lowest rpm possible:
idle_rpm = current_rpm * (new_gear / current_gear);
rpm = car.idle_rpm * (car.gear_ratios[car.gear - 1] / car.gear_ratios[car.gear]);
*/



const frame_rate = 1000 / 60;
var frame_number = 0;
var first_frame_date = Date.now();
var current_frame_rate = 0;

const sound = true;
var context = new AudioContext();

var autoshift;
var aerodynamics;
var angle = 0;



var gauges = {
    initialize: function() {
        var rpm_gauge = document.getElementById("rpm_gauge");

        for (var i = 0; i <= car.data.rpm_limiter / 1000; i++) {
            var new_indicator_text = i;
            var new_indicator_rotation = i * 1000 / car.data.rpm_limiter * (360 - 120) - 120;

            var new_indicator = document.createElement("div");
            new_indicator.classList.add("indicator");
            new_indicator.style.transform = "rotate(" + new_indicator_rotation + "deg)";

            var new_indicator_text_container = "<span>" + new_indicator_text + "</span>";
            new_indicator.innerHTML = new_indicator_text_container;

            rpm_gauge.append(new_indicator);
        }


        var speed_gauge = document.getElementById("speed_gauge");

        for (var i = 0; i <= 300; i+= 50) {
            var new_indicator_text = i;
            var new_indicator_rotation = i / 300 * (360 - 120) - 120;

            var new_indicator = document.createElement("div");
            new_indicator.classList.add("indicator");
            new_indicator.style.transform = "rotate(" + new_indicator_rotation + "deg)";

            var new_indicator_text_container = "<span>" + new_indicator_text + "</span>";
            new_indicator.innerHTML = new_indicator_text_container;

            speed_gauge.append(new_indicator);
        }
    },

    update: function() {
        var rpm_gauge = document.getElementById("rpm_gauge");
        rpm_gauge_needle = rpm_gauge.getElementsByClassName("current_needle")[0];
        rpm_gauge_text_container = rpm_gauge.getElementsByTagName("span")[0];

	    rpm_gauge_needle.style.transform = `rotate(${car.data.rpm / car.data.rpm_limiter * (360 - 120) - 120}deg)`;
    	rpm_gauge_text_container.innerText = Math.round(car.data.rpm);


        var speed_gauge = document.getElementById("speed_gauge");
        speed_gauge_needle = speed_gauge.getElementsByClassName("current_needle")[0];
        speed_gauge_text_container = speed_gauge.getElementsByTagName("span")[0];

    	speed_gauge_needle.style.transform = `rotate(${car.data.speed * 3.6 / 300 * (360 - 120) - 120}deg)`;
    	speed_gauge_text_container.innerText = Math.round(car.data.speed * 3.6);


    	document.getElementById("gear_indicator").innerText = car.data.gear;
    },

    clear: function() {
        var indicators = document.querySelectorAll(".gauge .indicator");

        for (let indicator of indicators) {
            indicator.remove();
        }
    }
};



car.sound = car_data[1].sound;
car.data = car_data[1].data;



if (sound === true) {
    car.sound.setup_sound();
    window.onclick = function() {
        context.resume();
    }
}



function speed_from_rpm(car, rpm) {
    //var wheel_rpm = rpm / (car.data.shift_progress * car.data.gear_ratios[car.data.gear - 1] + (1 - car.data.shift_progress) * car.data.gear_ratios[car.data.previous_gear - 1]) / car.data.final_drive;
    
    var smooth_shift_progress = Math.sin(car.data.shift_progress / 2 * Math.PI);
    
    var wheel_rpm = rpm / (smooth_shift_progress * car.data.gear_ratios[car.data.gear - 1] + (1 - smooth_shift_progress) * car.data.gear_ratios[car.data.previous_gear - 1]) / car.data.final_drive;
    var wheel_rps = wheel_rpm / 60;
    var wheel_speed =  Math.PI * car.data.tire_diameter * wheel_rps;

    return wheel_speed;
}



function rpm_from_speed(car, speed) {
    var smooth_shift_progress = Math.sin(car.data.shift_progress / 2 * Math.PI);

    var wheel_rps = speed / (Math.PI * car.data.tire_diameter);
    var wheel_rpm = wheel_rps * 60;
    //var engine_rpm = wheel_rpm * car.data.final_drive * (car.data.shift_progress * car.data.gear_ratios[car.data.gear - 1] + (1 - car.data.shift_progress) * car.data.gear_ratios[car.data.previous_gear - 1]);
    var engine_rpm = wheel_rpm * car.data.final_drive * (smooth_shift_progress * car.data.gear_ratios[car.data.gear - 1] + (1 - smooth_shift_progress) * car.data.gear_ratios[car.data.previous_gear - 1]);

    return engine_rpm;
}



function wheel_torque(tcar) {
    return car.engine_torque(tcar.data.rpm, tcar.data.throttle) * (car.data.shift_progress * tcar.data.gear_ratios[tcar.data.gear - 1] + (1 - car.data.shift_progress) * tcar.data.gear_ratios[tcar.data.previous_gear - 1]) * tcar.data.final_drive;
}



function wheel_force(car) {
    return wheel_torque(car) / (car.data.tire_diameter / 2);
}



function acceleration(car) {
    var car_accel = (wheel_force(car) - car.data.maximum_braking_force * car.data.brake) / car.data.mass;
    var angle_accel = -1 * Math.sin(angle * Math.PI/180) * 9.81;
    var air_accel = 0;

    if (aerodynamics === true) {
        air_accel = (-1 * 0.5 * 1.23 * (car.data.speed ** 2) * car.data.drag_coefficient * car.data.frontal_area) / car.data.mass;
    }

    return car_accel + angle_accel + air_accel;
}



window.onload = function() {
	setInterval(frame, frame_rate);
	gauges.initialize();
};



function frame() {
    //get inputs
    car.data.throttle = parseInt(document.getElementById("throttle_input").value) / 100;
    car.data.brake = parseInt(document.getElementById("brake_input").value) / 100;
    angle = parseInt(document.getElementById("angle_input").value);
    document.getElementById("container").style.transform = `rotate(${-angle}deg)`;
    autoshift = document.getElementById("autoshift_input").checked;
    aerodynamics = document.getElementById("aerodynamics_input").checked;


    if (car.data.shift_progress < 1) {
        car.data.shift_progress += 1 / car.data.shift_time * (frame_rate / 1000) ;
    }
    if (car.data.shift_progress > 1) {
        car.data.shift_progress = 1;
    }


    //set speed and rpm
    if (car.data.rpm <= car.data.idle_rpm && car.data.throttle <= car.data.idle_throttle) {
        car.data.throttle = car.data.idle_throttle;
    }

    car.data.speed = car.data.speed + acceleration(car) * (frame_rate / 1000);

    if (car.data.speed < 0) {
        car.data.speed = 0;
    }

    car.data.rpm = rpm_from_speed(car, car.data.speed);

    if (car.data.rpm > car.data.rpm_limiter) {
        car.data.rpm = car.data.rpm_limiter;
        car.data.speed = speed_from_rpm(car, car.data.rpm_limiter);
    }


    //sound
    if (sound === true) {
        car.sound.update_sound();
    }



    //automatic shifting
    if (autoshift == true) {
        var sportiness;

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

                var eco_upshift = (car.data.idle_rpm + 500) * (car.data.gear_ratios[car.data.gear - 1] / car.data.gear_ratios[car.data.gear]);

                var upshift = (1 - sportiness) * eco_upshift + sportiness * acceleration_upshift;

                var temp_car = JSON.parse(JSON.stringify(car));
                temp_car.data.shift_progress = 1;

                if (rpm_from_speed(temp_car, car.data.speed) >= upshift) {
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

                var acceleration_downshift = (2 * car.data.gear_ratios[car.data.gear - 1] * car.data.max_torque_rpm * (car.data.throttle * car.data.gear_ratios[car.data.gear - 2] + car.data.throttle * car.data.gear_ratios[car.data.gear - 1])) / (car.data.gear_ratios[car.data.gear - 2]**2 + car.data.gear_ratios[car.data.gear - 2] * car.data.gear_ratios[car.data.gear - 1] + car.data.gear_ratios[car.data.gear - 1]**2);

                var eco_downshift = car.data.idle_rpm + 500;

                var downshift = (1 - sportiness) * eco_downshift + sportiness * acceleration_downshift - (250 + 250 * car.data.throttle); //Up- / Downshift-Verschiebung in Abhängigkeit von Last
                var temp_car = JSON.parse(JSON.stringify(car));
                temp_car.data.shift_progress = 1;

                if (rpm_from_speed(temp_car, car.data.speed) <= downshift) {
                    //WEIRDEST BUG EVER!!!!!!!!!!!!!!!!!
                    /*car.shift_down();
                    did_shift = true;*/

                    did_shift = car.shift_down();
                }
            }
        }

        //console.log(upshift, downshift);
    }



    //visualization
	var street = document.getElementById("street");
	street_position_relative = parseFloat(street.style.left);

    var scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scale'));

	street.style.left = (street_position_relative - car.data.speed * frame_rate / 1000 * scale) % (10 * scale) + "vw";



    //frame rate calulation
    if (frame_number >= 50) {
        var current_date = Date.now();
        current_frame_rate = 1000 / ((current_date - first_frame_date) / 50);
        first_frame_date = Date.now();
        frame_number = 0;
    }

    frame_number += 1;



    //print information
	document.getElementById("additional_info_container").innerText = 
	    `Geschwindigkeit: ${(car.data.speed * 3.6).toFixed(2)} km/h \n` +
	    `Drehzahl: ${car.data.rpm.toFixed(2)} U/min \n` +
	    `Gang: ${car.data.gear} \n` +
	    `Vorheriger Gang: ${car.data.previous_gear} \n` +
	    `Beschleunigung: ${(acceleration(car)).toFixed(2)} m/s² \n` +
	    `Motordrehmoment: ${car.engine_torque().toFixed(2)} Nm \n` +
	    `Raddrehmoment: ${wheel_torque(car).toFixed(2)} Nm \n` +
	    `Shiftprogress ${parseInt(car.data.shift_progress * 100) + "%"} \n` +
	    `Gas: ${(car.data.throttle * 100).toFixed(2) + "%"} \n` +
	    `Bremse: ${car.data.brake * 100 + "%"} \n` +
	    `FPS: ${current_frame_rate.toFixed(0)}`;

    gauges.update();
}




function change_car(car_index) {
    context.close();
    context = new AudioContext();
    car.sound = car_data[car_index].sound;
    car.sound.setup_sound();
    car.data = car_data[car_index].data;
    gauges.clear();
    gauges.initialize();
}
