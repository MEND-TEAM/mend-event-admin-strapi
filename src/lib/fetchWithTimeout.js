const fetchWithTimeout = (url, options, timeout = 10000) => {
    return Promise.race([
        fetch(url, options)
            .then((res) => {
                if (res.ok) {
                    let data = res.json()
                    return data //TODO: success ued butsah utguudiig {code: 1000, {...data} || list}  iimerhuu bolgoh, strapi API endpoint
                } else if (res.status == 403) {//forbidden
                    return {code: 1001, message: 'forbidden'}
                } else {
                    return {code: 1001, message: res.statusText, error: true}
                }
            })
            .catch((err) => {
                console.log('fetch: ', err)
            return {code: 1001, message: err.message, error: true}
        }),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Сервер хариу өгсөнгүй!')), timeout)
        ).catch((err) => {
            return {code: 1001, message: err.message, error: true}
        })
    ]);
}

export default fetchWithTimeout