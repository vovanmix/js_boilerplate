'use strict';

Number.prototype.formatMoney = function(c, d, t, u) {
    var n = this,
        s = n < 0 ? '-' : '',
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '',
        j = (j = i.length) > 3 ? j % 3 : 0;

    c = isNaN(c = Math.abs(c)) ? 2 : c;
    d = d === undefined ? '.' : d;
    t = t === undefined ? ',' : t;
    u = u === undefined ? '$' : u;
    return u + s + (j ? i.substr(0, j) + t : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
        (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};

export function Product(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = parseFloat(price);
}
Product.prototype = {
    getFormattedPrice: function() {
        return this.price.formatMoney();
    }
};


export function convertResponseToObjects(resp) {

    var res = [];

    if (resp.status.substr(0, 3) !== '200') {
        return [];
    }

    for (var i in resp.items) {
        if (resp.items.hasOwnProperty(i)) {
            var item = resp.items[i];
            if (typeof item.id !== 'undefined' &&
                typeof item.name !== 'undefined' &&
                typeof item.price !== 'undefined') {
                var p = new Product(item.id, item.name, item.price);
                res.push(p);
            }
        }
    }


    return res;

}