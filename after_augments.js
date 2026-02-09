import { location_factions } from "./enumerations"; 
/** @param {NS} ns */
export async function main(ns) {
    let join_only = false;
    if (ns.args.length > 0) {
        join_only = true;
    }

    let faction_invites = ns.singularity.checkFactionInvitations();
    ns.tprint(faction_invites);
    for(const invite of faction_invites) {
        ns.tprint(invite);
        if(!location_factions.includes(invite)) {
            ns.singularity.joinFaction(invite);
        }
    }
    if(!join_only) {
        ns.spawn("start_over.js", {threads: 1, spawnDelay: 0});
    }
}