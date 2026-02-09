/** @param {NS} ns */
export async function main(ns) {
  let host = ns.getHostname();
  while (true) {
    await ns.hack(host);
    await ns.grow(host)
    await ns.grow(host)
    await ns.weaken(host);
  }
}