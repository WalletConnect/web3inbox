export const getLocalStorageConsumptionInKb = () => {
  let lsTotal = 0

  for (const key in localStorage) {
    if (localStorage.getItem(key)) {
      // Add the length of the key, as well as the length of the value
      const keyConsumption = key.length + (localStorage.getItem(key)?.length ?? 0)
      lsTotal += keyConsumption
    }
  }

  // Multiply it by 2 since localStorage stores the value in UTF-16
  return lsTotal * 2
}
