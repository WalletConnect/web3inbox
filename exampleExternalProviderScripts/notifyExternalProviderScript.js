this.web3inbox.notify.on('getActiveSubscriptions', ev => {
  const response = {
    id: ev.id,
    method: 'getActiveSubscriptions',
    result: {
      f8ed407bb082035b913a60d4e5ca1b992e4518b104501d29b956bfe30f431153: {
        topic: 'f8ed407bb082035b913a60d4e5ca1b992e4518b104501d29b956bfe30f431153',
        account: '0xB68328542D0C08c47882D1276c7cC4D6fB9eAe71',
        relay: { protocol: 'irn' },
        metadata: {
          name: 'Snapshot',
          description: 'Where decisions get made.',
          url: 'https://snapshot.org/',
          icons: [
            'https://explorer-api.walletconnect.com/v3/logo/md/b96552e9-6c7d-467c-bb37-486224d77e00?projectId=2f05ae7f1116030fde2d36508f472bfb'
          ]
        }
      },
      '1d3f9b8c82b054b1b0572cae4a1acc86db1bd2924b32caac5118b10aa6685d63': {
        topic: '1d3f9b8c82b054b1b0572cae4a1acc86db1bd2924b32caac5118b10aa6685d63',
        account: '0xB68328542D0C08c47882D1276c7cC4D6fB9eAe71',
        relay: { protocol: 'irn' },
        metadata: {
          name: 'Uniswap',
          description: 'Buy, sell, and explore tokens and NFTs',
          url: 'https://app.uniswap.org/',
          icons: [
            'https://explorer-api.walletconnect.com/v3/logo/md/32a77b79-ffe8-42c3-61a7-3e02e019ca00?projectId=2f05ae7f1116030fde2d36508f472bfb'
          ]
        }
      }
    }
  }

  this.web3inbox.push.postMessage(response)
})

this.web3inbox.notify.on('getMessageHistory', ev => {
  const response = {
    id: ev.id,
    method: 'getMessageHistory',
    result: {
      1676830250101782: {
        id: 1676830250101782,
        topic: ev.topic,
        publishedAt: 1676969627782,
        message: {
          title: 'Test Push 1',
          body: 'This is a test push notification',
          icon: 'https://f8n-production.imgix.net/collections/a39acu5u8.jpg?q=45&w=128&h=128&fit=crop&dpr=2',
          url: 'https://walletconnect.com'
        }
      },
      1676830250192957: {
        id: 1676830250192957,
        topic: ev.topic,
        publishedAt: 1676969637782,
        message: {
          title: 'Test Push 2',
          body: 'This is another test push notification',
          icon: 'https://f8n-production.imgix.net/collections/a39acu5u8.jpg?q=45&w=128&h=128&fit=crop&dpr=2',
          url: 'https://walletconnect.com'
        }
      }
    }
  }

  this.web3inbox.notify.postMessage(response)
})
