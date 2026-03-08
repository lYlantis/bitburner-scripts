import { location_factions, program_names } from "./enumerations"; 
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
        if(!location_factions.includes(invite) || join_only == true) {
            ns.singularity.joinFaction(invite);
        }
    }
    if(!join_only) {
        let money = ns.getServerMoneyAvailable("home");
        if (money > 200000) {
            let success = ns.singularity.purchaseTor();
            if (success) {
                for(const program of program_names) {
                    success = ns.singularity.purchaseProgram(program);
                }
            }
        }
        ns.spawn("start_over.js", {threads: 1, spawnDelay: 0});
    }
}