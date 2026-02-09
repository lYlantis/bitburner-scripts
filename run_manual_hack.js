/** @param {NS} ns */
export async function main(ns) {
  
}

export function run_manual_hack(ns, hostname) {
  let script = "manual_hack.js";
  ns.scp(script, hostname);
  ns.exec(script, hostname);
}