/** @param {NS} ns */
export async function main(ns) {
  let hostname = ns.args[0];
  let script = "manual_hack.js";
  ns.scp(script, hostname);
  ns.singularity.connect(hostname);
  while(true) {
    await ns.singularity.manualHack();
  }
}