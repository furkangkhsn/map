class Harita  {
    constructor() {}

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
        return this;
    }

    veriBas() {
        document.dispatchEvent(new CustomEvent('musterileriAl', { detail: this.veri }));
        this.goster();
        return this;
    }

    goster() {
        document.dispatchEvent(new Event('goster'));
        return this;
    }
}
