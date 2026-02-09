/** @param {NS} ns */
export async function main(ns) {
  let host;
  if(ns.args.length > 0) {
    host = ns.args[0];
  } else {
    host = "home";
  }
  kill_all_server_scripts(ns, host);
}

export function kill_all_server_scripts(ns, host) {
  ns.killall(host, true);
}
