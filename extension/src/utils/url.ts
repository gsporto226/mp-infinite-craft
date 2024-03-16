export const protocolRegexp = /^[^:\\]*\:\/\//

export class NativeURLWrapper {

    private URL: URL

    constructor(url: string) {
        this.URL = new URL(url)
    }

    static withProtocol(url: string, protocol = 'https') {
        if (protocolRegexp.test(url)) {
            return new NativeURLWrapper(url.replace(protocolRegexp, `${protocol}://`))
        }
        return new NativeURLWrapper(`${protocol}://${url}`)
    }

    innerUrl() {
        return this.URL
    }

    toString() {
        return this.URL.toString()
    }
}
