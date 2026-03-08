import { priority_crimes_before_gang, priority_crimes_after_gang } from "enumerations.js"
/** @param {NS} ns */
export async function main(ns) {
    while(true) {
        let karma = ns.heart.break();
        if(karma <= -54000) {
            let crime_assigned = false;
            for(const potential_crime of priority_crimes_before_gang) {
                let chance = ns.singularity.getCrimeChance(potential_crime);
                if(chance > .75) {
                  ns.sleeve.setToCommitCrime(0, potential_crime);
                  crime_assigned = true;
                  break;
                }
            }
            if(!crime_assigned) {
              ns.sleeve.setToCommitCrime(0, "Shoplift");
            }
        } else {
            let crime_assigned = false;
            for(const potential_crime of priority_crimes_after_gang) {
                let chance = ns.singularity.getCrimeChance(potential_crime);
                if(chance > .75) {
                  ns.sleeve.setToCommitCrime(0, potential_crime);
                  crime_assigned = true;
                  break;
                }
            }
            if(!crime_assigned) {
              ns.sleeve.setToCommitCrime(0, "Shoplift");
            }
        }
    }
}