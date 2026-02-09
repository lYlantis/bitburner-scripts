/** @param {NS} ns */
export async function main(ns) {
  let task_names = ns.gang.getTaskNames();
  for(const task of task_names) {
    ns.tprint("Task : ", task, " stats: ", ns.gang.getTaskStats(task));
    ns.tprint("\n");
  }
  ns.tprint("\n");

  // let eqip_names = ns.gang.getEquipmentNames();
  // for(const name of eqip_names) {
  //   ns.tprint("Name: ", name);
  //   ns.tprint("Cost: ", ns.gang.getEquipmentCost(name));
  //   ns.tprint("Stats: ", ns.gang.getEquipmentStats(name));
  //   ns.tprint("Type: ", ns.gang.getEquipmentType(name));
  // }
}