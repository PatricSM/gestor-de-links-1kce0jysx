migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    let userRecord
    try {
      userRecord = app.findAuthRecordByEmail('_pb_users_auth_', 'patric.martins@adapta.org')
    } catch (_) {
      userRecord = new Record(users)
      userRecord.setEmail('patric.martins@adapta.org')
      userRecord.setPassword('Skip@Pass')
      userRecord.setVerified(true)
      userRecord.set('name', 'Patric Martins')
      app.save(userRecord)
    }

    const links = app.findCollectionByNameOrId('links')
    const seedLinks = [
      {
        title: 'Skip Cloud Docs',
        category: 'Developer',
        url: 'https://docs.goskip.com',
        description: 'Skip documentation',
      },
      {
        title: 'Tailwind CSS UI',
        category: 'Design',
        url: 'https://tailwindcss.com',
        description: 'Tailwind CSS framework',
      },
      {
        title: 'React Hooks Guide',
        category: 'Education',
        url: 'https://react.dev',
        description: 'React documentation',
      },
    ]

    for (const item of seedLinks) {
      try {
        app.findFirstRecordByData('links', 'url', item.url)
      } catch (_) {
        const record = new Record(links)
        record.set('title', item.title)
        record.set('url', item.url)
        record.set('category', item.category)
        record.set('description', item.description)
        record.set('user', userRecord.id)
        app.save(record)
      }
    }
  },
  (app) => {
    try {
      const userRecord = app.findAuthRecordByEmail('_pb_users_auth_', 'patric.martins@adapta.org')
      const links = app.findRecordsByFilter('links', `user = '${userRecord.id}'`, '', 1000, 0)
      for (const link of links) {
        app.delete(link)
      }
      app.delete(userRecord)
    } catch (_) {}
  },
)
