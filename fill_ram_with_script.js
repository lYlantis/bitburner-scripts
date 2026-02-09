import { num_threads_to_exec } from "utilities.js"
/** @param {NS} ns */
export async function main(ns) {
  let script;
  let script_args = 0;
  if (ns.args.length > 0) {
    script = ns.args[0];
    ns.tprint(script);
    if(!ns.fileExists(script)) {
      ns.tprint("Error: script doesn't exist.");
      ns.exit();
    }
  } else {
    ns.tprint("Error: need to supply script name.");
    ns.exit();
  } 
  if (ns.args.length > 1){
    script_args = ns.args[1];
    ns.tprint(script_args);
  }  
  
  let num_threads = Math.floor(num_threads_to_exec(ns, "home", script)) - 4;
  ns.tprint(num_threads);
  if(num_threads > 1) {
    if (script_args != 0) {
      ns.run(script, num_threads, script_args);
    } else {
      ns.run(script, num_threads, script_args);
      ns.tprint("Exec ", script, " with ", num_threads, " threads on home with args ", script_args);
    }
  } else {
      ns.tprint("Can't run ", script, " numthreads is ", num_threads)
  }
}