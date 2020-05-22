//specifications for simulated cars


const car_data = [
    {
        //1985 Mercedes-Benz 190 D; 1997ccm² Diesel; automatic
        properties: {
            name: "1985 Mercedes-Benz 190 D",
            gear_ratios: [4.25, 2.41, 1.49, 1.0],
            shift_time: 0.7,
            final_drive: 3.23,
            tire_diameter: 0.6,
            mass: 1290,
            max_torque: 122,
            max_torque_rpm: 2800,
            max_power_rpm: 3730,
            rpm_limiter: 5000,
            idle_rpm: 900,
            idle_throttle: 0.16,
            drag_coefficient: 0.35,
            frontal_area: 1.94,
            maximum_brake_deceleration: 10,
            cylinder_count: 4,
            sound: {
                frequencies: [2/4, 4/4, 5/4, 6/4, 7/4, 8/4, 10/4],
                base_gains: [0.1, 0.1, 0.05, 0.075, 0.05, 0.06, 0.01],
                throttle_gains: [0.075, 0.2, 0.05, 0.08, 0.05, 0.1, 0.025]
            }
        }
    },



    {
        //2012 Porsche 911 Carrera Coupe PDK
        properties: {
            name: "2012 Porsche 911 Carrera", 
            gear_ratios: [3.91, 2.29, 1.65, 1.3, 1.08, 0.88, 0.62],
            shift_time: 0.2,
            final_drive: 3.44,
            tire_diameter: 0.6821,
            mass: 1475,
            max_torque: 390,
            max_torque_rpm: 5600,
            max_power_rpm: 7500,
            rpm_limiter: 8000,
            idle_rpm: 950,
            idle_throttle: 0.0845,
            drag_coefficient: 0.29,
            frontal_area: 2.01, 
            maximum_brake_deceleration: 10,
            cylinder_count: 6,
            sound: {
                frequencies: [3/6, 5/6, 1, 8/6, 9/6, 10/6, 12/6],
                base_gains: [0.10, 0.05, 0.10, 0.02, 0.02, 0.005, 0.003],
                throttle_gains: [0.05, 0.06, 0.15, 0.01, 0.01, 0.005, 0.003]
            }
        }
    },



    {
        //2006 BMW E91 320i Touring Steptronic
        properties: {
            name: "2006 BMW 320i", 
            gear_ratios: [4.17, 2.34, 1.52, 1.14, 0.87, 0.69],
            shift_time: 0.5,
            final_drive: 3.9,
            tire_diameter: 0.6319,
            mass: 1460,
            max_torque: 200,
            max_torque_rpm: 3600,
            max_power_rpm: 4800,
            rpm_limiter: 6500,
            idle_rpm: 900,
            idle_throttle: 0.12,
            drag_coefficient: 0.27,
            frontal_area: 2.17, 
            maximum_brake_deceleration: 10,
            cylinder_count: 4,
            sound: {
                frequencies: [1, 2/4, 3/4, 8/4, 10/4, 12/4, 14/4],
                base_gains: [0.05, 0.05, 0.05, 0.03, 0.02, 0.007, 0.0005],
                throttle_gains: [0.2, 0.05, 0.1, 0.075, 0.03, 0.01, 0.0005]
            }
        }
    },

    {
        //2004 Lexus IS 300 automatic
        properties: {
            name: "2004 Lexus IS 300", 
            gear_ratios: [3.38, 2.18, 1.42, 1, 0.75],
            shift_time: 0.5,
            final_drive: 3.58,
            tire_diameter: 0.6523,
            mass: 1500, 
            max_torque: 280,
            max_torque_rpm: 3800,
            max_power_rpm: 5067,
            rpm_limiter: 6200,
            idle_rpm: 900,
            idle_throttle: 0.12,
            drag_coefficient: 0.29,
            frontal_area: 2.01, 
            maximum_brake_deceleration: 10,
            cylinder_count: 6,
            sound: {
                frequencies: [3/6, 1, 8/6, 9/6, 10/6, 12/6],
                base_gains: [0.075, 0.075, 0.03, 0.03, 0.01, 0.005],
                throttle_gains: [0.075, 0.125, 0.03, 0.03, 0.01, 0.005]
            }
        }
    }
];
