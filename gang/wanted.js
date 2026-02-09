/** @param {NS} ns */
export async function main(ns) {
  ns.tprint("Wanted Penalty: ", ns.gang.getGangInformation().wantedPenalty);
  ns.tprint("Wanted Level: ", ns.gang.getGangInformation().wantedLevel);
  ns.tprint("Wanted Level Gain Rate: ", ns.gang.getGangInformation().wantedLevelGainRate);
}