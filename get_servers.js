import { server_hack_priority } from "enumerations.js"
/** @param {NS} ns */
export async function main(ns) {
  let dest;
  let go_to;
  if(ns.args.length > 0) {
    go_to = ns.args[0];
    connect_to(ns, go_to);
  } else {
    // let priority = ["w0r1d_d43m0n", "CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "powerhouse-fitness", "rothman-uni"]
    // let priority = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "powerhouse-fitness", "rothman-uni"]
    let priority = server_hack_priority;
    for (const host of priority) {
      let ready = ready_to_hack(ns, host);
      if(ready && host != "home" && !host.includes("aserver")) {
        path_to_host(ns, host);
        await backdoor(ns, host);
      }
    }
    let visited = bfs(ns);
    for (const host of visited.keys()) {
      let ready = ready_to_hack(ns, host);
      if(ready && host != "home" && !host.includes("aserver")) {
        path_to_host(ns, host);
        await backdoor(ns, host);
      }
    }
    ns.singularity.connect("home");
  }
}

export async function backdoor(ns, dest) {
  ns.tprint(dest);
  let ret = connect_to(ns, dest);
  if(ret) {
    let server = ns.getServer(dest);
    if(!server.backdoorInstalled) {
      await ns.singularity.installBackdoor();
    }
  }
  ns.singularity.connect("home");
}

export function connect_to(ns, dest) {
  let graph = create_graph(ns);
  let path = get_path(ns, graph, "home", dest);
  ns.tprint(path)
  if(path === undefined) {
    return false;
  }
  for(const host of path) {
    let ret = ns.singularity.connect(host);
    if (ret == false) {
      ns.tprint("Error connecting to: " + host);
    }
  }
  return true;
}

export function path_to_host(ns, dest) {
  let graph = create_graph(ns);
  let path = get_path(ns, graph, "home", dest);
  ns.tprint(dest, " - path: ", path);
}

export function bfs(ns) {
  let neighbor = ns.scan();
  let visited = new Map();
  for (let i = 0; i < neighbor.length; i++) {
    if(!visited.has(neighbor[i])) {
       let queue = [];
       visited.set(neighbor[i], true);
       queue.push(neighbor[i]);

      while(queue.length !== 0) {
      let s = queue.shift();
      let explore = ns.scan(s);
      for(let j = 0; j < explore.length; j++) {
        ns.print(explore[j]);
        if(!visited.has(explore[j])){
          visited.set(explore[j], true)
          queue.push(explore[j]);
        }
      }
      }
    } 
  }
  return visited;
}

export function create_graph(ns) {
  let graph = new Map();
  let neighbors = ns.scan();
  graph.set("home", neighbors);
  while(neighbors.length) {
    let curr = neighbors.shift();
    if(!graph.has(curr)) {
      let new_neighbors = ns.scan(curr);
      graph.set(curr, new_neighbors);
      neighbors.push.apply(neighbors, new_neighbors);
    }
  }
  // ns.tprint(graph);
  // ns.tprint(graph.size);
  // for(let [key, value] of graph) {
  //   ns.tprint(key + ": " + value);
  // }
  // No clue why I needed this
  let neighbors2 = ns.scan();
  graph.set("home", neighbors2);
  return graph;
}

export function get_path(ns, graph, start, end) {
  let queue = [[start, []]];
  let seen = new Set;

  while (queue.length) {
    let [curVert, [...path]] = queue.shift();
    path.push(curVert);
    if (curVert === end) return path;

    if (!seen.has(curVert) && graph.has(curVert)) {
      queue.push(...graph.get(curVert).map(v => [v, path]));
    }
    // if (!seen.has(curVert) && graph[curVert]) {
    //   queue.push(...graph[curVert].map(v => [v, path]));
    // }
    seen.add(curVert);
  }
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