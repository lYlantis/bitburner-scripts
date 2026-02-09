import {bfs} from "get_servers.js"

export function init_ram_map(ns, server_map) {
  let ram_map = new Map();
  for(let [key, value] of server_map) {
      let host = key;
      let max_ram = ns.getServerMaxRam(host);
      let usable_ram;
      if(host == "home") {
        usable_ram += max_ram / 1.05;
      } else {
        usable_ram += max_ram;
      }
      ram_map.set(host, [max_ram, 0]);
    }
  return ram_map;
}

export function find_weak_server(ns, console_log=true){
  let visited = bfs(ns);
  let server_to_attack = "n00dles";
  let best_server_value = 0;
  let curr_server_value = 0;
  let server_map = new Map();
  for(const host of visited.keys()) {
    let ret_values = hack_server(ns, host);
    let open_ports = ret_values[1];
    if(open_ports < ns.getServerNumPortsRequired(host)) {
      continue;
    }
    let req_hack_level = ns.getServerRequiredHackingLevel(host);
    let my_hack_level = ns.getHackingLevel();
    if(req_hack_level > my_hack_level * .7 ) {
      server_map.set(host, 0);
      continue;
    }
    let max_money = ns.getServerMaxMoney(host)
    // let money_available = ns.getServerMoneyAvailable(host);
    let min_security_level = ns.getServerMinSecurityLevel(host);
    // let server_security_level = ns.getServerSecurityLevel(host);
    // let server_growth = ns.getServerGrowth(host);
    // let grow_time = ns.getGrowTime(host);
    // let hack_time = ns.getHackTime(host);
    // let weaken_time = ns.getWeakenTime(host);
    curr_server_value = (max_money / min_security_level);
    if(console_log) {
      ns.tprint(host, " attack_value=", curr_server_value);
    } else {
      ns.print(host, " attack_value=", curr_server_value);
    }
    server_map.set(host, curr_server_value);
    if(curr_server_value > best_server_value) {
      server_to_attack = host;
      best_server_value = curr_server_value;
    }
  }
  if(console_log) {
    ns.tprint(server_to_attack, " is target with best_attack_value=", best_server_value);
  } else {
    ns.print(server_to_attack, " is target with best_attack_value=", best_server_value);
  }
  const server_map_sorted = new Map([...server_map.entries()].sort((a, b) => b[1] - a[1]));
  return [server_to_attack, server_map_sorted];
}

export function kill_all_server_scripts(ns) {
  let visited = bfs(ns);
  for(const host of visited.keys()) {
    ns.killall(host, true);
  }
}

export function num_threads_to_exec(ns, hostname, script) {
  let server = ns.getServer(hostname);
  let max_ram = server.maxRam;
  let script_ram = ns.getScriptRam(script); 
  max_ram = max_ram - server.ramUsed;
  let num_threads = Math.floor(max_ram/script_ram);
  return num_threads;
}

export function hack_server(ns, hostname) {
  let ports_open = 0;
  if(ns.fileExists("BruteSSH.exe")) {
    ns.brutessh(hostname);
    ports_open += 1;
  }
  if(ns.fileExists("FTPCrack.exe")) {
    ns.ftpcrack(hostname);
    ports_open += 1;
  }
  if(ns.fileExists("HTTPWorm.exe")) {
    ns.httpworm(hostname);
    ports_open += 1;
  }
  if(ns.fileExists("SQLInject.exe")) {
    ns.sqlinject(hostname);
    ports_open += 1;
  }
  if(ns.fileExists("relaySMTP.exe")) {
    ns.relaysmtp(hostname);
    ports_open += 1;
  }
  let req_ports = ns.getServerNumPortsRequired(hostname);
  if(req_ports <= ports_open) {
    ns.nuke(hostname)
    return [true, ports_open];
  }
  return [false, ports_open];
}

export function ports_open(ns) {
  let ports_open = 0;
  if(ns.fileExists("BruteSSH.exe")) {
    ports_open += 1;
  }
  if(ns.fileExists("FTPCrack.exe")) {
    ports_open += 1;
  }
  if(ns.fileExists("HTTPWorm.exe")) {
    ports_open += 1;
  }
  if(ns.fileExists("SQLInject.exe")) {
    ports_open += 1;
  }
  if(ns.fileExists("relaySMTP.exe")) {
    ports_open += 1;
  }
  return ports_open;
}

export function ready_to_hack(ns, host) {
		return ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(host) && ports_open(ns) >= ns.getServerNumPortsRequired(host);
}
