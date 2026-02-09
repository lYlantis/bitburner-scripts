 /** @param {NS} ns */
export async function main(ns) {
  let host = ns.args[0];

  analyze_host(ns, host);
}

export function analyze_host(ns, host, console_log=false) {
  let max_money = ns.getServerMaxMoney(host)
  if(max_money == 0) {
    return [0, 0, 0, 0, 0, 0];
  }
  let hack_percent = ns.hackAnalyze(host);
  let hack_chance = ns.hackAnalyzeChance(host);
  let security_increase = ns.hackAnalyzeSecurity(1, host);
  
  let desired_hack_amount = Math.ceil(max_money*0.25)
  let hack_threads = Math.ceil(ns.hackAnalyzeThreads(host, desired_hack_amount));
  let hack_time = ns.getHackTime(host);
  let threaded_hack_security_growth = hack_threads * security_increase;

  let grow_time = ns.getGrowTime(host); 
  let money_available = Math.floor(ns.getServerMoneyAvailable(host));
  if(money_available == 0) {
    money_available = 1;
  }
  let growth_factor_needed = max_money/money_available;
  if(!isFinite(growth_factor_needed)) {
    ns.tprint("growth_factor_needed for ", host, " is infinite.");
    growth_factor_needed = 1;
  }
  let growth_threads_needed = Math.ceil(ns.growthAnalyze(host, growth_factor_needed));
  let growth_from_min = Math.ceil(max_money / (max_money * .75));
  let growth_threads_from_min = Math.ceil(ns.growthAnalyze(host, growth_from_min));
  let server_growth = ns.getServerGrowth(host);
  let grow_security_increase = ns.growthAnalyzeSecurity(growth_threads_needed, host);
  let threaded_grow_security_growth = growth_threads_needed * grow_security_increase;

  let min_security_level = ns.getServerMinSecurityLevel(host);
  let server_security_level = ns.getServerSecurityLevel(host);
  let max_security_level = min_security_level + 5;
  let single_thread_weaken = ns.weakenAnalyze(1);
  let hack_and_grow_growth = threaded_grow_security_growth + threaded_hack_security_growth
  let weaken_threads_actual = Math.ceil(hack_and_grow_growth + ((server_security_level - min_security_level) / single_thread_weaken));
  let weaken_threads_max = Math.ceil((max_security_level) / single_thread_weaken);
    
  let weaken_time = ns.getWeakenTime(host);

  if(console_log == true) {
    ns.tprint(host, " hack_percent: ", hack_percent, ", hack chance: ", hack_chance, ", security increase: ", security_increase, ", threaded_hack_security_growth: ", threaded_hack_security_growth);
    ns.tprint(" max money: ", max_money, ", desired_hack_amount: ", desired_hack_amount, ", hack threads: ", hack_threads, ", hack time (s): ", hack_time/1000, ", hack time (ms): ", hack_time);

    ns.tprint(host, " max money: ", max_money, ", money available: ", money_available, ", growth_factor_needed: ", growth_factor_needed, " growth_threads_needed: ", growth_threads_needed, ", grow_security_increase: ", grow_security_increase, " threaded_grow_security_growth: ", threaded_grow_security_growth);
    ns.tprint("growth_from_min: ", growth_from_min, ", growth_threads_from_min: ", growth_threads_from_min, ", grow_time (s): ", grow_time/1000, ", grow_time (ms): ", grow_time, ", server_growth: ", server_growth);

    ns.tprint(host, " min_security_level: ", min_security_level, ", server_security_level: ", server_security_level, ", single_thread_weaken: ", single_thread_weaken);
    ns.tprint(" weaken_threads_actual: ", weaken_threads_actual, ", weaken_threads_max: ", weaken_threads_max, ", weaken_time (s): ", weaken_time/1000, ", weaken_time (ms): ", weaken_time);
    ns.tprint("\n");
  }
  
  return [hack_threads, hack_time, growth_threads_needed, grow_time, weaken_threads_actual, weaken_time];
}