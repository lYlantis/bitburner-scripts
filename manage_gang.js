import { other_gangs, gang_names, priority_crimes } from "enumerations.js"
/** @param {NS} ns */
export async function main(ns) {
  let clash_start_chance = .55;
  let won_all_territory = false;
  while(true) {
    let i = 0;
    while(ns.gang.canRecruitMember() && (ns.gang.getMemberNames().length != 12)) {
      ns.print("recruiting members");
      let names = ns.gang.getMemberNames();
      if(names.includes(gang_names[i])) {
        i += 1;
        await ns.sleep(100);
        continue;
      }
      let recruited = ns.gang.recruitMember(gang_names[i]);
      if(recruited) {
        ns.print("recruited member ", gang_names[i]);
        let success = ns.gang.setMemberTask(gang_names[i], "Train Combat");
        if(!success) {
          ns.tprint("Error assigning ", gang_names[i], " gang member to Train Combat");
        } else {
          ns.print("Set ", gang_names[i], " to do Train Combat");
        }
        i += 1;
      }
      await ns.sleep(100);
    } 

    let all_names = ns.gang.getMemberNames();
    let length = all_names.length;
    let count = 0;
    for(const name of all_names) {
      let gang_info = ns.gang.getGangInformation();
           
      ns.print("Gang Wanted Level: ", gang_info.wantedLevel);
      let task = "Territory Warfare";
      let success = ns.gang.setMemberTask(name, task);
      if(!won_all_territory && length == 12) {
        if(gang_info.territory == 1) {
          won_all_territory = true;
          continue;
        }
        await ns.sleep(10000);
        let go_array = [];
        let low_chance = 1;
        for(const other_gang of other_gangs) {
          let chance = ns.gang.getChanceToWinClash(other_gang);
          ns.print("Clash chance with ", other_gang, " is: ", chance);
          if(chance > clash_start_chance) {
            go_array.push(1);
          } else {
            go_array.push(0);
          }
          if(chance < low_chance) {
            low_chance = chance;
          }
        }
        let sum = go_array.reduce((a, b) => a + b, 0);
        if(sum == 6) {
          let count2 = 0;
          ns.print("Gang clash chance with all gangs > ", clash_start_chance, " enabling clash.");
          for(const name2 of all_names) {
            if(low_chance > .75) {
              if(count2 % 2 == 1) {
                task = "Human Trafficking";
              } else {
                task = "Territory Warfare";
              }
              count2 += 1;
            } else {
              task = "Territory Warfare";
            }
            success = ns.gang.setMemberTask(name2, task);
            buy_all_equipment(ns, name, false);
            ns.gang.setTerritoryWarfare(true);
          }
          continue;
        } else {
          ns.print("Gang clash chance with all gangs < ", clash_start_chance, " disabling clash.");
          ns.gang.setTerritoryWarfare(false);
        }
      } else if(all_names.length == 12) {
        buy_all_equipment(ns, name, false);
      }

      ns.print(gang_info.wantedPenalty)
      if(gang_info.wantedLevel > 1000 && gang_info.wantedPenalty < .9) {
        task =  "Vigilante Justice";
      } else {
        let reputation = ns.singularity.getFactionRep("Slum Snakes");
        if(reputation < 1000000) {
          if(count % 2 == 1) {
          task = "Human Trafficking";
        } else {
          task = "Terrorism";
        }
        count += 1;
        } else {
          task = "Human Trafficking";
          // task = "Run a Con"
        }
      }

      let ascen_res = ns.gang.getAscensionResult(name);
      // ns.tprint(name, ": ", ascen_res);
      let ascen_mult = 1.15;
      if(ascen_res != undefined) {
        if((ascen_res.agi > ascen_mult | ascen_res.cha > ascen_mult | ascen_res.def > ascen_mult | ascen_res.dex > ascen_mult | ascen_res.hack > ascen_mult | ascen_res.str > ascen_mult)) {
          ns.gang.ascendMember(name);
          ns.print("Ascended ", name);
        } 
      }
      
      buy_all_equipment(ns, name, true);
    
      let member_info = ns.gang.getMemberInformation(name);
      // let charisma_min = 25;
      // if(member_info.cha < charisma_min) {
      //   task = "Train Charisma";
      // }

      let train_min = 150;
      if(member_info.agi < train_min | member_info.str < train_min | member_info.dex < train_min | member_info.def < train_min) {
        task = "Train Combat";
      }


      success = ns.gang.setMemberTask(name, task);
      if(!success) {
        ns.tprint("Error assigning ", name, " gang member to ", task);
      } else {
        // ns.print("Set ", name, " to do ", task );
      }

      buy_specific_equipment(ns, name, "Glock 18C");

    }
    await ns.sleep(10000);

  }
}

export function buy_specific_equipment(ns, gang_member_name, equip_name) {
  let percent = .05;
  let usable_money = ns.getServerMoneyAvailable("home") * percent;
  let cost = ns.gang.getEquipmentCost(equip_name);
  if(cost < usable_money) {
    let bought = ns.gang.purchaseEquipment(gang_member_name, equip_name);
  }
}

export function buy_all_equipment(ns, gang_member_name, augment_only) {
  let percent = .15;
  let usable_money = ns.getServerMoneyAvailable("home") * percent;
  let equip_names = ns.gang.getEquipmentNames();
  for(const equip_name of equip_names) {
    let type = ns.gang.getEquipmentType(equip_name);
    let cost = ns.gang.getEquipmentCost(equip_name);
    let bought;
    if(type == "Augmentation") {
      if(cost < usable_money) {
        bought = ns.gang.purchaseEquipment(gang_member_name, equip_name);
        if(bought) {
          usable_money -= cost;
        }
      }
    }
    if(!augment_only) {
      if(cost < usable_money) {
        bought = ns.gang.purchaseEquipment(gang_member_name, equip_name);
        if(bought) {
          usable_money -= cost;
        }
      }
    }
  }
}