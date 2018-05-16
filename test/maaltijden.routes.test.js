const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const db = require('../datasource/dbConnection');

let validToken;
let amount;
let maaltijden;

chai.should();
chai.use(chaiHttp);

describe('Maaltijden API Post', function () {
    before(function() {
        validToken = require('./authentication.routes.test').token;

        chai.request(app)
            .get('/api/studentenhuis')
            .set('Authorization', validToken)
            .end((err, res) => {
                amount = res.body.length
            })
    });

    this.timeout(10000);

    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(app)
            .post('/api/studentenhuis/1/maaltijd')
            .set('Authorization', 'test')
            .send({
                "naam":"Pasta met pesto",
                "beschrijving":"Super makkelijk studentengerecht voor arme studenten",
                "ingredienten":"Pasta en pesto",
                "allergie":"geen",
                "prijs":5
            })
            .end((err, res) => {
                res.should.have.status(401);
                done()
            })
    });

    it('should throw an error when naam is missing', (done) => {
        chai.request(app)
            .post('/api/studentenhuis/' + amount + '/maaltijd')
            .set('Authorization', validToken)
            .send({
                "beschrijving":"Super makkelijk studentengerecht voor arme studenten",
                "ingredienten":"Pasta en pesto",
                "allergie":"geen",
                "prijs":5
            })
            .end((err, res) => {
                res.should.have.status(412);
                done()
            })
    });

    it('should throw an error when beschrijving is missing', (done) => {
        chai.request(app)
            .post('/api/studentenhuis/' + amount + '/maaltijd')
            .set('Authorization', validToken)
            .send({
                "naam":"Pasta met pesto",
                "ingredienten":"Pasta en pesto",
                "allergie":"geen",
                "prijs":5
            })
            .end((err, res) => {
                res.should.have.status(412);
                done()
            })
    });

    it('should throw an error when ingredienten is missing', (done) => {
        chai.request(app)
            .post('/api/studentenhuis/' + amount + '/maaltijd')
            .set('Authorization', validToken)
            .send({
                "naam":"Pasta met pesto",
                "beschrijving":"Super makkelijk studentengerecht voor arme studenten",
                "allergie":"geen",
                "prijs":5
            })
            .end((err, res) => {
                res.should.have.status(412);
                done()
            })
    });

    it('should throw an error when allergie is missing', (done) => {
        chai.request(app)
            .post('/api/studentenhuis/' + amount + '/maaltijd')
            .set('Authorization', validToken)
            .send({
                "naam":"Pasta met pesto",
                "beschrijving":"Super makkelijk studentengerecht voor arme studenten",
                "ingredienten":"Pasta en pesto",
                "prijs":5
            })
            .end((err, res) => {
                res.should.have.status(412);
                done()
            })
    });

    it('should throw an error when ingredienten is missing', (done) => {
        chai.request(app)
            .post('/api/studentenhuis/' + amount + '/maaltijd')
            .set('Authorization', validToken)
            .send({
                "naam":"Pasta met pesto",
                "beschrijving":"Super makkelijk studentengerecht voor arme studenten",
                "allergie":"geen",
                "prijs":5
            })
            .end((err, res) => {
                res.should.have.status(412);
                done()
            })
    });

    it('should throw an error when prijs is missing', (done) => {
        chai.request(app)
            .post('/api/studentenhuis/' + amount + '/maaltijd')
            .set('Authorization', validToken)
            .send({
                "naam":"Pasta met pesto",
                "beschrijving":"Super makkelijk studentengerecht voor arme studenten",
                "ingredienten":"Pasta en pesto",
                "allergie":"geen",
            })
            .end((err, res) => {
                res.should.have.status(412);
                done()
            })
    });
});

//--------IGNORE THIS--------
// describe('Maaltijden API GET', function () {
//     before(function () {
//         validToken = require('./authentication.routes.test').token
//
//         chai.request(app)
//             .get('/api/studentenhuis')
//             .set('Authorization', validToken)
//             .end((err, res) => {
//                 amount = res.body.length
//             });
//
//         chai.request(app)
//             .get('/api/studentenhuis/' + amount + '/maaltijd')
//             .set('Authorization', validToken)
//             .end((err, res) => {
//                 maaltijden = res.body.length
//             });
//
//     });
//     this.timeout(10000);
//
//     it('should throw an error when using invalid JWT token', (done) => {
//         chai.request(app)
//             .get('/api/studentenhuis/' + amount + '/maaltijd')
//             .set('Authorization', 'test')
//             .end((err, res) => {
//                 res.should.have.status(401);
//                 done()
//             })
//     });
//
//     it('should throw an error when using invalid JWT token with maaltijdId', (done) => {
//         chai.request(app)
//             .get('/api/studentenhuis/' + amount + maaltijden)
//             .set('Authorization', 'test')
//             .end((err, res) => {
//                 res.should.have.status(401);
//                 done()
//             })
//     });
// });