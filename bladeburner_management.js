/** @param {NS} ns */
export async function main(ns) {
  while(true) {
    if(ns.bladeburner.inBladeburner()) {
      break;
    } else {
      ns.bladeburner.joinBladeburnerDivision();
      ns.bladeburner.joinBladeburnerFaction();
    }
  }

  while(true) {

  }
} 