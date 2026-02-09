import { bfs } from "get_servers.js"
import { init_ram_map, num_threads_to_exec, hack_server, kill_all_server_scripts, find_weak_server, ports_open, ready_to_hack } from "utilities.js"
import { analyze_host } from "evaluate_server.js"
import { run_manual_hack } from "run_manual_hack.js"
/** @param {NS} ns */
export async function main(ns) {
  let kill_scripts = false;
  if (ns.args.length > 0) {
    kill_scripts = ns.args[0];
    kill_scripts = true;
  }
  if (ns.scriptRunning("buy_servers.js", "home")) {
    ns.kill("buy_servers.js", "home")
  }
  let visited = bfs(ns);
  if (kill_scripts) {
    kill_all_server_scripts(ns);
  }
  let ret_values = find_weak_server(ns, false);
  let best_target = ret_values[0];
  var server_map = ret_values[1];
  ns.tprint("server_map: ", server_map);
  ns.tprint("visited: ", visited);
  let ram_map = init_ram_map(ns, server_map);
  for (const host of visited.keys()) {
    let target = best_target;
    let hacked = ready_to_hack(ns, host);
    hack_server(ns, host);
    if (ns.getServerMaxMoney(host) == 0) {
      target = best_target;
    } else {
      /* Make sure target isn't too hard. */
      let req_hack_level = ns.getServerRequiredHackingLevel(host);
      let my_hack_level = ns.getHackingLevel();
      if (req_hack_level > my_hack_level * .6) {
        target = best_target;
      } else {
        target = host;
      }
    }
    if (host == "home" || host.includes("aserver")) {
      let num_open = ports_open(ns);
      let num_threads = 0;
      if (num_open < 2) {
        target = "n00dles";
        num_threads = Math.floor(num_threads_to_exec(ns, host, "goodhack.js") / 1.05);
        if (num_threads > 0) {
          ns.run("goodhack.js", num_threads, target);
          ns.tprint("Exec goodhack.js with ", num_threads, " threads on ", host, " targeting ", target);
          ns.print("Exec goodhack.js with ", num_threads, " threads on ", host, " targeting ", target);
        }
      } else {
        num_threads = Math.floor(num_threads_to_exec(ns, host, "goodhack.js") / 1.05);
        for (const host2 of server_map.keys()) {
          if (host2 == "home" || host2.includes("aserver") || ns.getServerMaxMoney(host2) == 0) {
            continue;
          }
          let ret_values2 = analyze_host(ns, host2);
          let hack_threads = ret_values2[0];
          let grow_threads = ret_values2[2];
          let weaken_threads = ret_values2[4]
          let targeted = ram_map.get(host2);
          targeted = targeted[1]
          if (targeted == 1) {
            continue;
          }
          if (!ready_to_hack(ns, host2)) {
            continue
          }
          if (num_threads > 0) {
            let max = Math.max(hack_threads, grow_threads, weaken_threads);
            if (max < 1) {
              max = 1;
            } if(max > num_threads) {
              max = num_threads;
            }
            // max = max * 2;
            num_threads = num_threads - max;
            if (host == "home") {
              ns.run("goodhack.js", max, host2);
            } else {
              ns.scp("goodhack.js", host);
              ns.exec("goodhack.js", host, max, host2);
            }
            ns.tprint("Exec goodhack.js with ", max, " threads on ", host, " targeting ", host2);
            ns.print("Exec goodhack.js with ", max, " threads on ", host, " targeting ", host2);
            ram_map.set(host2, [0, 1]);
          }
        }
      }
    } else if (hacked == true) {
      let num_threads = 0;
      let max_money = ns.getServerMaxMoney(host)
      if (max_money == 0) {
        send_goodhack(ns, host, best_target);
      } else {
        send_goodhack(ns, host, target);
      }
    }
  }
  // if (ns.scriptRunning("buy_servers.js", "home")) {
  //   ns.kill("buy_servers.js", "home")
  //   ns.exec("buy_servers.js", "home", 1);
  // } else {
  //   ns.exec("buy_servers.js", "home", 1);
  // }
  let servers = ns.getPurchasedServers();
  for(var i = 0; i < servers.length; i++) {
    let used_ram = ns.getServerUsedRam(servers[i]);
    let max_ram = ns.getServerMaxRam(servers[i]);
    if(used_ram < max_ram) {
      let num_threads = num_threads_to_exec(ns, servers[i], "goodhack.js");
      if(num_threads > 0) {
        ns.exec("goodhack.js", servers[i], num_threads, best_target);
      }
    }
  }
  ns.spawn("gang_groundwork.js", {threads: 1, spawnDelay: 0});
}

export function send_goodhack(ns, hostname, target) {
  if (ns.fileExists("goodhack.js")) {
    ns.scp("goodhack.js", hostname);
  } else {
    ns.tprint("Error, goodhack.js doesn't exist");
    exit();
  }
  let num_threads = num_threads_to_exec(ns, hostname, "goodhack.js");
  if (num_threads > 0) {
    ns.exec("goodhack.js", hostname, num_threads, target);
    ns.tprint("Exec goodhack.js with ", num_threads, " threads on ", hostname, " targeting ", target);
    ns.print("Exec goodhack.js with ", num_threads, " threads on ", hostname, " targeting ", target);
  }
}

