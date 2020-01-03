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
    }

    show() {
        //URL den verileri al
        //eğer rut listesi varsa ekrana çiz
        //Modalı göster
    }

    veriGetir() {
        let veri;fetch('http://localhost:8888/veri').then(r => r.json()).then(data=> {
            veri = data;
            let event = new CustomEvent('musterileriAl', { detail: veri });
            document.dispatchEvent(event);
            let event2 = new Event('goster');
            document.dispatchEvent(event2);
            let event3 = new CustomEvent('musteriCallback', { detail: function(data) {
                console.log('Tamam');
                console.log(data);
            } });
            document.dispatchEvent(event3);
        });
        this.veri =
fetch('http://localhost:8888/veri').then(r => r.json()).then(data=> {
    let veri = data;
    veri.callback = function(data) {
        console.log('Tamam');
        console.log(data);
    }
    let event = new CustomEvent('musterileriAl', { detail: veri });
    document.dispatchEvent(event);
    let event4 = new Event('goster');
    document.dispatchEvent(event4);
});
        this.veriBas();
    }

    veriBas() {
        let event = new CustomEvent('musterileriAl', { detail: this.veri.veri });
        document.dispatchEvent(event);
        let event2 = new CustomEvent('sortedClients', { detail: this.veri.sorted });
        document.dispatchEvent(event2);
    }

    goster() {
        let event = new Event('goster');
        document.dispatchEvent(event);
    }
}
