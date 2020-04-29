const car_data = [
    {
        //1985 Mercedes-Benz 190 D; 1997ccm² Diesel; 4-speed automatic
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
            idle_rpm: 840,
            idle_throttle: 0.15,
            drag_coefficient: 0.35,
            frontal_area: 1.94,
            maximum_brake_deceleration: 10,
            cylinder_count: 4,
            sound: {
                frequencies: [1, 1/4, 2/4, 6/4, 8/4, 10/4, 12/4, 16/4],
                base_gains: [0.05, 0.02, 0.05, 0.04, 0.03, 0.03, 0.02, 0.005],
                throttle_gains: [0.1, 0.02, 0.075, 0.05, 0.05, 0.03, 0.03, 0.005]
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
            idle_rpm: 840,
            idle_throttle: 0.075,
            drag_coefficient: 0.29,
            frontal_area: 2.01, 
            maximum_brake_deceleration: 10,
            cylinder_count: 6,
            sound: {
                frequencies: [1, 2 / 6, 3 / 6, 8 / 6, 10 / 6, 12 / 6, 15 / 6],
                base_gains: [0.05, 0.05, 0.05, 0.03, 0.02, 0.005, 0.0005],
                throttle_gains: [0.1, 0.05, 0.1, 0.075, 0.03, 0.0075, 0.0005]
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
                frequencies: [1, 2 / 4, 3 / 4, 8 / 4, 10 / 4, 12 / 4, 14 / 4],
                base_gains: [0.05, 0.05, 0.05, 0.03, 0.02, 0.007, 0.0005],
                throttle_gains: [0.1, 0.05, 0.1, 0.075, 0.03, 0.01, 0.0005]
            }
        }
    }
];
