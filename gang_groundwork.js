import { other_gangs, gang_names, priority_crimes_before_gang } from "enumerations.js"
/** @param {NS} ns */
export async function main(ns) {
  // let other_gangs = ["The Black Hand", "Tetrads", "The Syndicate", "The Dark Army", "Speakers for the Dead", "NiteSec"];
  // let gang_names = ["cydne", "jake", "saul", "larry david", "tom", "jerry", "bob ross", "kramer", "ringo", "donnie", "walter", "kitty"]
  let current_activity = null;
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
        let skills = ns.getPlayer().skills;
        let skill_minimum = 30;
        let stat_to_train = "None";
        let train_stat = false;
        let stay_training = false
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
        } 
        if(train_stat) {
          if(current_activity == stat_to_train) {
            stay_training = true;
            await ns.sleep(5000);
            continue;
          } else {
            current_activity = stat_to_train;
          }
          let success;
          if(ns.bladeburner.inBladeburner()) {
              success = ns.bladeburner.startAction("General", "Training");
              if(!success) {
                ns.print("Failed to assign player to bladeburner training");
              }
          } else {
              success = ns.singularity.gymWorkout("Powerhouse Gym", stat_to_train);
              if(!success) {
                ns.print("Failed to assign player to gym training");
              }
          }
        }
        if(!train_stat) {
          for(const potential_crime of priority_crimes_before_gang) {
            let chance = ns.singularity.getCrimeChance(potential_crime);
            if(chance > .75) {
              if(current_activity == potential_crime) {
                ns.print("Current activity is the same")
                break;
              }
              ns.print("current_activity = ", current_activity);
              ns.print("potential_crime = ", potential_crime);
              ns.singularity.commitCrime(potential_crime);
              current_activity = potential_crime;
              ns.print("current_activity = ", current_activity);
              ns.print("potential_crime = ", potential_crime);
              break;
            }
          }
        }
      await ns.sleep(5000);
      }
    } else {
      ns.tprint("In gang");
      ns.spawn("manage_gang.js", {threads: 1, spawnDelay: 0});
      break;
    }
  }
}