var map;
window.wp = [];
/*let waypoints = window.musteriler.map(x => {
    return {location: {lat: x.enlem, lng: x.boylam}}
});
*/
class mapControl {
    constructor() {
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 39, lng: 35},
            zoom: 6
        });
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(this.map);
        this.pointListener = this.map.addListener('click', (e) => {
            this.baslangic = e.latLng;
            this.baslangicAyarla();  
        });
        this.baslangic;
        this.musteriler = window.musteriler;
        this.sortedClients = [];
        this.marker;
        this.rut_sayisi;
        this.optimize = false;
        this.rutHesapla = this.rutHesapla.bind(this);
        this.rutCiz = this.rutCiz.bind(this);
        this.sortable = Sortable;
        this.markers = [];
    }

    rad(x) {
        return x * Math.PI / 180;
    };

    getDistance(p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = this.rad(p2.lat - p1.lat);
        var dLong = this.rad(p2.lng - p1.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    };

    baslangicAyarla() {
        if(this.marker != undefined) this.marker.setMap(null);
        this.marker = new google.maps.Marker({
            position: this.baslangic,
            map: this.map
        });
        let button = document.createElement('button');
        button.setAttribute('id', 'rut_hesapla');
        button.innerText = 'Rutu Hesapla';
        button.onclick = () => this.rutHesapla();
        document.querySelector('body').appendChild(button);
    }

    rutHesapla() {
        this.rut_sayisi = prompt('Kaç müşteri gezmek istiyorsunuz?');        
        if(this.rut_sayisi == undefined || this.rut_sayisi == '') {
            alert('Müşteri sayısı belirtilmeden rut hesaplanamaz!');
            return;
        }
        this.mesafeler = this.musteriler.map(x => {
            return {
                kodu: x.kodu,
                location: {lat: x.enlem, lng: x.boylam},
                uzakligi: this.getDistance({lat: this.baslangic.lat(), lng: this.baslangic.lng()}, {lat: x.enlem, lng: x.boylam})
            }
        }).sort((x, y) => x.uzakligi - y.uzakligi);
        for (let i = 0; i < this.rut_sayisi; i++) {
            this.sortedClients.push(this.musteriler.find(y => y.kodu == this.mesafeler[i].kodu));
            let mark = new google.maps.Marker({
                position: this.mesafeler[i].location,
                map: this.map
            });
            mark.setLabel(i+1+'');
            this.markers.push(mark);
        }
        this.rutuEkranaBas();
        document.querySelector('#rut_hesapla').remove();
        
        google.maps.event.removeListener(this.pointListener);
    }

    rutuEkranaBas() {
        let panelElem = document.createElement('div');
        panelElem.id = 'directionsPanel';

        let eylemlerElem = document.createElement('div');
        eylemlerElem.id = 'eylemlerRut';

        let rutlarElem = document.createElement('div');
        rutlarElem.id = 'rutlar';

        let rutIptalButon = document.createElement('button');
        rutIptalButon.id = 'rutuIptalEt';
        rutIptalButon.innerText = 'Rutu İptal Et';
        rutIptalButon.onclick = () => this.rutIptalEt();
        eylemlerElem.appendChild(rutIptalButon);

        let optimizeSpan = document.createElement('span');
        let optimizeEt = document.createElement('input');
        optimizeEt.id = 'optimizeEt';
        optimizeEt.type = 'checkbox';
        optimizeEt.onchange = () => this.optimize = !this.optimize;
        optimizeSpan.appendChild(optimizeEt);
        optimizeSpan.appendChild(document.createTextNode('Rutu Optimize Et'));
        eylemlerElem.appendChild(optimizeSpan);

        let rutCizButon = document.createElement('button');
        rutCizButon.id = 'rutCiz';
        rutCizButon.innerText = 'Rutu Çiz';
        rutCizButon.onclick = () => this.rutCiz();
        eylemlerElem.appendChild(rutCizButon);

        panelElem.appendChild(eylemlerElem);
        for (let i = 0; i < this.sortedClients.length; i++) {
            const client = this.sortedClients[i];
            
            let siraElem = document.createElement('div');
            siraElem.className = 'sira';
            siraElem.innerText = i+1;
            
            let routeElem = document.createElement('div');
            routeElem.className = 'route';
            routeElem.ondblclick = () => this.panTo({
                lat: client.enlem,
                lng: client.boylam,
            });

            let noElem = document.createElement('div');
            noElem.className = 'no';
            noElem.innerText = client.kodu;

            let neredenElem = document.createElement('div');
            neredenElem.className = 'nereden';
            neredenElem.innerText = client.adi;

            routeElem.appendChild(siraElem);
            routeElem.appendChild(noElem);
            routeElem.appendChild(neredenElem);
            rutlarElem.appendChild(routeElem);
        }

        panelElem.appendChild(rutlarElem);
        
        document.querySelector('body').appendChild(panelElem);

        let rutlar = document.querySelector('#rutlar');
        this.sorted = this.sortable.create(rutlar, {
            onEnd: (e) => {
                this.yenidenDuzenle(e.oldIndex, e.newIndex);                
            }
        });
    }

    yenidenDuzenle(oi, ni) {
        if(oi == ni) return;
        let degisen = this.sortedClients[oi];
        this.sortedClients.splice(oi, 1);
        this.sortedClients.splice(ni, 0, degisen);
        let children = this.sorted.el.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            child.firstElementChild.innerText = i+1;
        }
    }

    rutIptalEt() {
        document.querySelector('#directionsPanel').remove();
        this.sortedClients = [];
        this.marker = this.marker.setMap(null);
        this.mesafeler = [];
        this.pointListener = this.map.addListener('click', (e) => {
            this.baslangic = e.latLng;
            this.baslangicAyarla();  
        });
    }

    panTo(latLng) {
        this.map.panTo(latLng);
        this.map.setZoom(17);
    }
    
    rutCiz() {
        let dist = {
            lat: this.sortedClients[this.sortedClients.length-1].enlem,
            lng: this.sortedClients[this.sortedClients.length-1].boylam
        }
        let wp = this.sortedClients.map(x => {
            return {
                location: {
                    lat: x.enlem,
                    lng: x.boylam
                }
            }
        });
        let request = {
            origin: this.baslangic,
            destination: { location: dist },
            waypoints: wp,
            optimizeWaypoints: this.optimize,
            travelMode: 'DRIVING'
        };
        this.directionsService.route(request, (result, status) => {
            if (status == 'OK') {
                this.directionsRenderer.setDirections(result);
            }
        });
    }
}

mod = new mapControl();