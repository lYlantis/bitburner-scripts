/** @param {NS} ns */
export async function main(ns) {
  let host = ns.args[0];
  let min_security_level = ns.getServerMinSecurityLevel(host);
  ns.tprint("min_security_level ", min_security_level);
  let server_security_level = ns.getServerSecurityLevel(host);
  ns.tprint("server_security_level ", server_security_level);
}