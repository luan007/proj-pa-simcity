var t = {
    a: {
        b: 0,
        c: {
            d: 0
        }
    },
    q: {
        q : 0,
        v : {
            adf: 123
        }
    }
};

var f = (o)=>{
    for(var i in o) {
        if(typeof(o[i]) == 'object') {
            var flat = f(o[i]);
            for(var q in flat) {
                o[i + "_" + q] = flat[q];
            }
            delete o[i];
        }
    }
    return o;
};

console.log(f(t));