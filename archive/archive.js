/** @param {NS} ns */
export async function main(ns) {

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