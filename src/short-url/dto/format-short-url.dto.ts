export class FormatShortUrl {
    static formatRedirected(shorturlDocument){
        return {
            redirectUrl:shorturlDocument.fullurl
        }
    }
    static formatShort(shorturlDocument){
        return {
            shortUrl:shorturlDocument.shorturl
        }
    }
}