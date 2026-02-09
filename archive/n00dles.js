/** @param {NS} ns */
export async function main(ns) {
  let count = 1;
  let host = "n00dles"
  while (true) {
    await ns.hack(host);
    if (count % 10 == 0) {
      await ns.weaken(host);
      count = 0;
    }
    count = count + 1;
  }
}