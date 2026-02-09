/** @param {NS} ns */
export async function main(ns) {
  let host = ns.getHostname();
  let weaken_count = 0;
  while (true) {
    await ns.hack(host);
    let server_security_level = ns.getServerSecurityLevel(host);
    let server_max_security = ns.getServerMinSecurityLevel(host);
    weaken_count = weaken_count + 1;
    if (weaken_count > 10 && server_security_level > server_max_security) {
      await ns.weaken(host);
      weaken_count = 0;
    }
  }
}