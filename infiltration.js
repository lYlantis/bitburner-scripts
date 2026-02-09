/** @param {NS} ns */
export async function main(ns) {
  let locations = ns.infiltration.getPossibleLocations();
  ns.tprint("All locations: ", locations);
  for(var i=0; i<locations.length;i++) {
    ns.tprint(locations[i]["name"])
    ns.tprint(ns.infiltration.getInfiltration(locations[i]["name"]));
  }
}