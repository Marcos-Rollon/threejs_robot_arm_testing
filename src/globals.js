function debug(...args) {
    if (!process.env.PRODUCTION) {
        args.forEach(a => console.log(a))
    }
}

export { debug }