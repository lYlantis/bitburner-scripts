/** @param {NS} ns */
export async function main(ns) {
  let servers = ns.getPurchasedServers();
  for(var i = 0; i < servers.length; i++) {
    ns.tprint("Server: ", servers[i], "\tMax RAM: ", ns.getServerMaxRam(servers[i]), "\tUsed RAM: ", ns.getServerUsedRam(servers[i]));
  }
}