/** @param {import(".").NS } ns */
/** @param {NS} ns */
export async function main(ns) {
    while(true) {
        let num_sleeves = ns.sleeve.getNumSleeves();
        for(let i = 0; i < num_sleeves; i++) {
            let sleeve_info = ns.sleeve.getSleeve(i);
            
            let shock = sleeve_info.shock;
            let sync = sleeve_info.sync;
            let skill_minimum = 30;
            let train_stat = false;
            let stat_to_train = "dexterity";
            let success;
            let prep_done = true;

            if(shock > 0) {
                success = ns.sleeve.setToShockRecovery(i);
                if(!success) {
                    ns.print("Failed to set to shock recovery");
                }
                ns.print("Set sleeve: ", i, " to shock recovery");
                prep_done = false;
            } else if(sync < 100) {
                success = ns.sleeve.setToSynchronize(i);
                if(!success) {
                    ns.print("Failed to set to sync");
                }
                ns.print("Set sleeve: ", i, " to sync"); 
                prep_done = false;
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
            } 
            
            if(train_stat) {
                if(ns.bladeburner.inBladeburner()) {
                    success = ns.sleeve.setToBladeburnerAction(i, "Training");
                    if(!success) {
                        ns.print("Failed to assign sleeve to bladeburner training");
                    }
                    ns.print("Set sleeve: ", i, " to bladeburner training");
                    prep_done = false;
                } else {
                    success = ns.sleeve.setToGymWorkout(i, "Sector12PowerhouseGym", stat_to_train);
                    if(!success) {
                        ns.print("Failed to assign sleeve to bladeburner training");
                    }
                    ns.print("Set sleeve: ", i, " to gym training");
                    prep_done = false;
                }
            }

            if(prep_done) {
                if (i == 0) {
                    if(!ns.isRunning("crime_sleeve.js", "home")); {
                        ns.run("crime_sleeve.js", 1);
                    }
                }
            }
        }
        await ns.sleep(5000);
    }
}