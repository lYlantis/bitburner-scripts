/** @param {NS} ns */
export async function main(ns) {
  let max_nodes = ns.hacknet.maxNumNodes();
  let num_nodes = ns.hacknet.numNodes();
  // let money = ns.getServerMaxMoney("home");
  let num_purchase = Math.ceil(max_nodes / 2) ;
  for(let i = 0; i < num_purchase; i++){
    ns.hacknet.purchaseNode();
  }
  for(let j = 0; j < num_nodes; j++){
    ns.hacknet.upgradeLevel(j, 5);
  }
  for(let k = 0; k < num_nodes; k++){
    ns.hacknet.upgradeRam(k, 1);
  }
  for(let l = 0; l < num_nodes; l++){
    ns.hacknet.upgradeCore(l, 1);
  }
}