export async function main(ns) {
  let host;
  if(ns.args.length > 0) {
    host = ns.args[0];
  } else {
    host = ns.getHostname();
  }
  while (true) {
    let max_money = ns.getServerMaxMoney(host);
    let server_money = ns.getServerMoneyAvailable(host);
    let server_security_level = ns.getServerSecurityLevel(host);
    let server_min_security = ns.getServerMinSecurityLevel(host);
    while(server_security_level > server_min_security + 5.0){
      await ns.weaken(host);
      server_security_level = ns.getServerSecurityLevel(host);
    }
    if (server_money/max_money > .75) {
      await ns.hack(host);
    } else {
      await ns.grow(host);
    }
  }
}