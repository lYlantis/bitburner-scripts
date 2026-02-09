import { other_gangs, gang_names, priority_crimes } from "enumerations.js"
/** @param {NS} ns */
export async function main(ns) {
  // let other_gangs = ["The Black Hand", "Tetrads", "The Syndicate", "The Dark Army", "Speakers for the Dead", "NiteSec"];
  // let gang_names = ["cydne", "jake", "saul", "larry david", "tom", "jerry", "bob ross", "kramer", "ringo", "donnie", "walter", "kitty"]
  while(true) {
    let in_gang = ns.gang.inGang();
    if(!in_gang) {
      let karma = ns.heart.break();
      if(karma <= -54000) {
        let create_gang = ns.gang.createGang("Slum Snakes");
        if(create_gang) {
          ns.tprint("Created Gang");
          break;
        } else {
          await ns.sleep(100000);
        }
      } else {
        for(const potential_crime in priority_crimes) {
          let chance = ns.singularity.getCrimeChance(potential_crime);
          let crime_assigned = false;
          if(chance > .75) {
            ns.singularity.commitCrime(potential_crime);
            crime_assigned = true;
          }
        }
        let skills = ns.getPlayer().skills;
        if(!crime_assigned) {
          if(skills.agility < skill_minimum) {
              stat_to_train = "agi";
              train_stat = true;
          } else if(skills.dexterity < skill_minimum) {
              stat_to_train = "dex";
              train_stat = true;
          } else if(skills.strength < skill_minimum) {
              stat_to_train = "str";
              train_stat = true;
          } else if(skills.defense < skill_minimum) {
              stat_to_train = "def";
              train_stat = true;
          } if(train_stat) {
              if(ns.bladeburner.inBladeburner()) {
                  success = ns.bladeburner.startAction("General", "Training");
                  if(!success) {
                      ns.print("Failed to assign player to bladeburner training");
                  }
              } else {
                  ns.singularity.gymWorkout("Sector12PowerhouseGym", stat_to_train);
              }
          }
        }
      }
    } else {
      ns.tprint("In gang");
      ns.spawn("manage_gang.js", {threads: 1, spawnDelay: 0});
      break;
    }
  }
}