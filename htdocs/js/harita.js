class Harita  {
    constructor(url) {
        this.url = url;

    }

    static create() {
        return new Harita();
    }

    setURL(url) {
        this.url = url;
        return this;
    }

    setCallback(callback) {
        this.callback = callback;
        return this;
    }

    veriGetir() {
        fetch(this.url).then(r => r.json()).then(data=> {
            this.veri = data;
            this.veri.callback = this.callback;
            this.veriBas();
        });
    }

    veriBas() {
        let event = new CustomEvent('musterileriAl', { detail: this.veri });
        document.dispatchEvent(event);
    }

    goster() {
        this.veriGetir();
        let event = new Event('goster');
        document.dispatchEvent(event);
    }
}