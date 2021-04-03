var Usuario = require('../../models/usuario');
var mongoose = require('mongoose');
var request = require('request');
var server = require('../../bin/www');

var base_url = 'http://localhost:3000/api/usuarios'

describe('test API Usuarios', () => {
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
        Usuario.deleteMany({}, function (err, success) {  
            if(err) console.log(err)
            mongoose.connection.close(done)
        });   
    });
    
    describe('GET', () => {
        it('Status 200', (done) => {
            request.get(base_url, function (error, res, body) {  
                expect(res.statusCode).toBe(200);
                var result = JSON.parse(body);
                expect(result.usuarios.length).toBe(0);
                done();
            });
        });
    });

    describe("POST /create", ()=> {
        it("Status 200", (done)=> {
            let headers = {'content-type': 'application/json'};
            let user = '{"nombre":"Sofia"}';
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: user
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                var userSaved = JSON.parse(body);
                expect(userSaved.nombre).toBe("Sofia");
                done();
            });
        });
    })
});