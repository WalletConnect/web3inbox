export interface ExternalCommunicator {
  postToExternalProvider: <TReturn>(
    methodName: string,
    params: unknown,
    target: 'chat' | 'push'
  ) => Promise<TReturn>
}
