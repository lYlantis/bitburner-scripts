import {find_weak_server, num_threads_to_exec} from "utilities.js"
/** @param {NS} ns */
export async function main(ns) {
  let no_wait = false;
  if (ns.args.length > 0) {
    no_wait = ns.args[0];
    if(no_wait == 1) {
      no_wait = true;
    } else {
      no_wait = false;
    }
  }
  let percent = .15;
  if (ns.args.length > 1) {
    percent = ns.args[1];
  }
  let max_servers = ns.getPurchasedServerLimit();
  if (ns.args.length > 2) {
    max_servers = ns.args[2];
  }
  
  let ram = 8;

  let purchased_num = 0;

  let hacking_script = "goodhack.js";

  let usable_money = ns.getServerMoneyAvailable("home") * percent;

  let i = 0;
  while(i < max_servers) {
    if(ns.getPurchasedServers().length >= max_servers) {
      if(no_wait) {
        await ns.sleep(100);
      } else{
        await ns.sleep(60000);
      }
      break;
    }
    usable_money = ns.getServerMoneyAvailable("home") * percent;
    if(usable_money > ns.getPurchasedServerCost(ram)) {
      let hostname = ns.purchaseServer("aserver_" + purchased_num, ram);
      purchased_num += 1;
      let ret_value = find_weak_server(ns, false);
      let weak_server = ret_value[0]
      ns.tprint("New Server: ", hostname);
      ns.scp(hacking_script, hostname);
      ns.exec(hacking_script, hostname, num_threads_to_exec(ns, hostname, hacking_script), weak_server);
      i++;
    } 
    if(no_wait) {
      await ns.sleep(100);
    } else {
      await ns.sleep(120000);
    }
  }
  
  while(true) {
    let servers = ns.getPurchasedServers();
    usable_money = ns.getServerMoneyAvailable("home") * percent;
    for(let i = 0; i < servers.length; i++) {
      let hostname = servers[i];
      let server_ram = ns.getServerMaxRam(hostname);
      let upgrade_cost = ns.getPurchasedServerUpgradeCost(hostname, server_ram * 2)  
      if(upgrade_cost < usable_money) {
        ns.tprint("Upgrading ", hostname, " to ", server_ram * 2, " ram.")
        usable_money = usable_money - upgrade_cost;
        ns.upgradePurchasedServer(hostname, server_ram * 2);
        ns.killall(hostname, true);
        let ret_value = find_weak_server(ns, false);
        let weak_server = ret_value[0]
        let num_threads = num_threads_to_exec(ns, hostname, hacking_script);
        ns.exec(hacking_script, hostname, num_threads, weak_server);
      }
      if(no_wait) {
        await ns.sleep(100);
      } else {
        await ns.sleep(120000);
      }
    }
  }
}