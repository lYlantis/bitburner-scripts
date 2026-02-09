import {bfs} from "get_servers.js"
/** @param {NS} ns */
export async function main(ns) {
  run_startup(ns);
  let neighbor = ns.scan();
  for (let i = 0; i < neighbor.length; i++) {
    hack_server(ns, neighbor[i]);
    send_goodhack(ns, neighbor[i])
  }
  let visited = bfs(ns);
  ns.print(visited);
  ns.print(visited.length);
  ns.tprint(visited)
  ns.tprint(visited.length);
  for(const k of visited.keys()) {
    hack_server(ns, k);
    send_goodhack(ns, k);
  }
}

export function run_startup(ns) {
  ns.tprint("Neighbors of current server.");
  ns.print("Neighbors of current server.");
  let neighbor = ns.scan();
  for (let i = 0; i < neighbor.length; i++) {
    ns.print(neighbor[i]);
    hack_server(ns, neighbor[i]);
    if(neighbor[i] == "n00dles") {
      noodles_special(ns, neighbor[i]);
    }
    send_goodhack(ns, neighbor[i]);
  }
  let host = ns.getHostname();
  if(host == "home") {
    let num_threads = Math.floor(num_threads_to_exec(ns, host, "n00dles.js") / 1.25);
    ns.run("n00dles.js", num_threads);  
  }
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
  }
  // ns.run("backdoor");
}

export function send_goodhack(ns, hostname) {
  if(ns.fileExists("goodhack.js")) {
    ns.scp("goodhack.js", hostname);
  } else {
    ns.tprint("Error, goodhack.js doesn't exist");
    exit();
  }
  let num_threads = num_threads_to_exec(ns, hostname, "goodhack.js");
  let max_money = ns.getServerMaxMoney(hostname);
  if(num_threads > 0 && max_money > 0) {
    ns.exec("goodhack.js", hostname, num_threads);
    ns.tprint("Exec goodhack.js with ", num_threads, " threads on ", hostname)
    ns.print("Exec goodhack.js with ", num_threads, " threads on ", hostname)
  } else {
    let req_hack_level = ns.getServerRequiredHackingLevel(hostname);
    let my_hack_level = ns.getHackingLevel();
    if(hostname !== "home" || req_hack_level < my_hack_level) {
      noodles_special(ns, hostname);
    }
  }
}

export function num_threads_to_exec(ns, hostname, script) {
  let max_ram = ns.getServerMaxRam(hostname);
  let script_ram = ns.getScriptRam(script); 
  let num_threads = Math.floor(max_ram/script_ram);
  return num_threads;
}

export function noodles_special(ns, hostname) {
  if(ns.fileExists("grow_noodles.js")) {
      ns.scp("grow_noodles.js", hostname);
    } else {
      ns.tprint("Error, grow_noodles.js doesn't exist");
      exit();
    }
  ns.exec("grow_noodles.js", hostname);
  ns.exec("grow_noodles.js", hostname);
  if(ns.fileExists("hackanyways.js")) {
      ns.scp("hackanyways.js", hostname);
    } else {
      ns.tprint("Error, hackanyways.js doesn't exist");
      exit();
    }
  ns.exec("hackanyways.js", hostname);
}