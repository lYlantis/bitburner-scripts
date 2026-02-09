import {bfs} from "get_servers.js"
import {analyze_host} from "evaluate_server.js"
import {num_threads_to_exec, hack_server, kill_all_server_scripts, find_weak_server, ports_open} from "utilities.js"
/** @param {NS} ns */
let ram_map = new Map();
let usable_ram = 0;
let server_map;

export async function main(ns) {
  // while(true) {
    let ret_values = find_weak_server(ns, false);
    server_map = ret_values[1];
    ns.tprint(server_map);
    init_scheduler(ns);
    for(let [key, value] of server_map) {
      let host = key;
      ret_values = analyze_host(ns, host);
      if(ret_values[0] == 0) {
        continue;
      }
      let hack_threads = ret_values[0]
      let hack_time = ret_values[1]
      let growth_threads_needed = ret_values[2]
      let grow_time = ret_values[3]
      let weaken_threads_actual = ret_values[4]
      let weaken_time = ret_values[5]
      for(let [key, value] of ram_map) {
        let allocated_hack = 0;
        let allocated_grow = 0;
        let allocated_weaken = 0;
        if(hack_threads > 0) {

        } 
        if(growth_threads_needed > 0) {

        }
        if(weaken_threads_actual > 0) {
          
        }
      }
      
    }
    ns.tprint("ram_map: ", ram_map);
    ns.tprint("server_map :", server_map);
    // await ns.sleep(60000);
  // }
}

export function schedule_script(ns) {

}

export function init_scheduler(ns) {
  for(let [key, value] of server_map) {
    let host = key;
    let max_ram = ns.getServerMaxRam(host);
    if(max_ram == 0) {
      continue;
    }
    if(host == "home") {
      usable_ram += max_ram / 1.15;
    } else {
      usable_ram += max_ram;
    }
    ram_map.set(host, [max_ram, 0]);
  }
}