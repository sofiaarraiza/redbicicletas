var Bicicleta = require('../../models/bicicleta')
var mongoose = require('mongoose')
var server = require('../../bin/www');

describe('Testing Bicicletas', function(){
    beforeEach(function (done) {
        mongoose.connection.close().then(() => {
            var mongoDB = "mongodb://localhost/testdb";
            mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
    
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'MongoDB connection error: '));
            db.once('open', function () {
                console.log('We are connected to test database!');
                done();
            });

        });

    });

    afterEach(function(done) {
        Bicicleta.deleteMany({}, function(err, success){
            if (err) console.log(err)
            done()
        })
    })

    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de Bicicleta', (done) => {
            var bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -54.1])

            expect(bici.code).toBe(1)
            expect(bici.color).toBe('verde')
            expect(bici.modelo).toBe('urbana')
            expect(bici.ubicacion[0]).toEqual(-34.5)
            expect(bici.ubicacion[1]).toEqual(-54.1)

            done()
        })
    })
    
    describe('Bicicleta.allBicis', () => {
        it('comienza vacia', (done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0)
                done()
            })
        })
    })

    describe('Bicicleta.add', () => {
        it('agrega solo una bici', (done) => {
            var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"})
            Bicicleta.add(aBici, function(err, newBici) {
                if(err) console.log(err)
                Bicicleta.allBicis(function(err, bicis){
                    expect(bicis.length).toEqual(1)
                    expect(bicis[0].code).toEqual(aBici.code)
                    done()
                })
            })
        })
    })
    
    describe('Bicicleta.findByCode', () => {
        it('debe devolver la bici con code 1', (done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0)

                var aBici = new Bicicleta({code: 1, color: "verde", modelo:"urbana"})
                Bicicleta.add(aBici, function(err, newBici){
                    if(err) console.log(err)
                })

                var aBici2 = new Bicicleta({code: 2, color: "rojo", modelo:"urbana"})
                Bicicleta.add(aBici2, function(err, newBici){
                    if(err) console.log(err)
                    Bicicleta.findByCode(1, function(error, targetBici){
                        expect(targetBici.code).toBe(aBici.code)
                        expect(targetBici.color).toBe(aBici.color)
                        expect(targetBici.modelo).toBe(aBici.modelo)

                        done()
                    })
                })
            })
        })
    })

    describe('Bicicleta.removeByCode', () => {
        it('debe borrar la bici con code 2', (done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0)
        
                var aBici = new Bicicleta({code: 2, color: "verde", modelo:"urbana"})
                Bicicleta.add(aBici, function(err, newBici){
                    if(err) console.log(err)
                })

                Bicicleta.removeByCode(2, function(err, targetBici){
                    expect(bicis.length).toBe(0)
                    done()
                })
            })
        })
    })

})