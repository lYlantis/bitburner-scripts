/** @param {import(".").NS } ns */

import { GymLocationName } from ".";

/** @param {NS} ns */
export async function main(ns) {
    while(true) {
        let num_sleeves = ns.sleeve.getNumSleeves();
        for(let i = 0; i < num_sleeves; i++) {
            let sleeve_info = ns.sleeve.getSleeve(i);
            
            let shock = sleeve_info.shock;
            let skill_minimum = 30;
            let train_stat = false;
            let stat_to_train = "dexterity";

            if(shock > 0) {
                let success = ns.sleeve.setToShockRecovery(i);
                if(!success) {
                    ns.print("Failed to set to shock recovery");
                } 
            } else if(sleeve_info.skills.agility < skill_minimum) {
                stat_to_train = "agi";
                train_stat = true;
            } else if(sleeve_info.skills.dexterity < skill_minimum) {
                stat_to_train = "dex";
                train_stat = true;
            } else if(sleeve_info.skills.strength < skill_minimum) {
                stat_to_train = "str";
                train_stat = true;
            } else if(sleeve_info.skills.defense < skill_minimum) {
                stat_to_train = "def";
                train_stat = true;
            } if(train_stat) {
                if(ns.bladeburner.inBladeburner()) {
                    success = ns.sleeve.setToBladeburnerAction(i, "Training");
                    if(!success) {
                        ns.print("Failed to assign sleeve to bladeburner training");
                    }
                } else {
                    ns.sleeve.setToGymWorkout(i, "Sector12PowerhouseGym", stat_to_train);
                }
            }
        }
        ns.tprint(num_sleeves)
    }
}