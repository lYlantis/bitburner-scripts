export function main(ns) {
  let host = ns.getHostname();
  let hack_percent = ns.formulas.hacking.hackPercent(ns.getServer(host), ns.getPlayer());
  let hack_threads = .25 / hack_percent;
  if(hack_threads < 1) {
    hack_threads = 1
  }
  let hack_time = ns.formulas.hacking.hackTime(ns.getServer(host),ns.getPlayer());

  let grow_time = ns.formulas.hacking.growTime(ns.getServer(host),ns.getPlayer());

  let weaken_time = ns.formulas.hacking.weakenTime(ns.getServer(host),ns.getPlayer());
  let weaken_threads = 1;

  let max_money = ns.getServerMaxMoney(ns.getServer(host));
  let min_money = floor(max_money * .75);
  let money_available = ns.getServerMoneyAvailable(ns.getServer(host));

  let grow_threads = ns.formulas.hacking.growThreads(ns.getServer(host), ns.getPlayer(), min_money);

  ns.tprint(hack_threads);
  ns.tprint(grow_threads);
  ns.tprint(weaken_threads);

  return [hack_threads, grow_threads, weaken_threads];
}