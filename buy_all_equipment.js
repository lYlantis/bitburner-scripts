/** @param {NS} ns */
export async function main(ns) {
  let percent = .15;
  let augment_only = true;
  if (ns.args.length > 0) {
    percent = ns.args[0];
  }
  if (ns.args.length > 1) {
    augment_only = false;
  }
  let all_names = ns.gang.getMemberNames();
  for(const gang_member_name of all_names) {
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
}