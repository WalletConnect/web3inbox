this.web3inbox.chat.on('getMessages', ev => {
  this.web3inbox.chat.postMessage(ev.id.toString(), {
    method: 'getMessages',
    result: [
      {
        topic: ev.params.topic,
        authorAccount: 'eip155:1:0x08e59B1456E70a1eDD3075c5e1104eE7040c6201',
        message: 'This is a dummy message',
        timestamp: Date.now()
      }
    ]
  })
})

this.web3inbox.chat.on('getThreads', ev => {
  const response = {
    method: 'getThreads',
    result: [
      {
        topic: 'notRealTopic',
        selfAccount: 'eip155:1:0x08e59B1456E70a1eDD3075c5e1104eE7040c6200',
        peerAccount: 'eip155:1:0x08e59B1456E70a1eDD3075c5e1104eE7040c6201'
      }
    ]
  }
  this.web3inbox.chat.postMessage(ev.id.toString(), response)
})
