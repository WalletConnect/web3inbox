// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {}

export const waitFor = (condition: () => Promise<boolean>) => {
  return new Promise<void>((resolve) => {
    const intervalId = setInterval(() => {
      condition().then((isValid) => {
	if(isValid) {
	  clearInterval(intervalId)
	  resolve();
	}
      })
    }, 100)
  })
}
