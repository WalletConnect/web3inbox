export const getLocalStorageConsumptionInKb = () => {
  let lsTotal = 0

  for (const key in localStorage) {
    if (localStorage.getItem(key)) {
      const keyConsumption = (key.length + (localStorage.getItem(key)?.length ?? 0)) * 2
      lsTotal += keyConsumption
    }
  }

  return lsTotal
}
