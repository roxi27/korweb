//process.env.NODE_ENV = 'test';


'use strict';


let mongoose = require("mongoose");
let Story= require('../app/models/story');
let User= require('../app/models/user');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
  describe('/POST /signup', () => {
      it('it should not signup because the user allready exists', (done) => {
        let User = {
            name: 'batman',
			username: 'batman',
			password: 'abc123',
        }
            chai.request('http://localhost:3000')
            .post('/api/signup')
            .send(User)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Létező felhasználó');
              done();
            });
      });
      
      it('it should signup a user', (done) => {
        let User = {
            name: 'hello2',
			username: 'uj2',
			password: 'felhasznalo',
        }
            chai.request('http://localhost:3000')
            .post('/api/signup')
            .send(User)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Sikeres regisztráció');
              done();
            });
      });
  });

    describe('/POST /login', () => {
      it('it should login', (done) => {
        let User = {
			username: 'halika4',
			password: 'abc123',
        }
            chai.request('http://localhost:3000')
            .post('/api/login')
            .send(User)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Sikeres bejelentkezés');
              done();
            });
      });
      
      it('it should not login because the user doesnt exists ', (done) => {
        let User = {
			username: 'xxxxx',
			password: 'you',
        }
            chai.request('http://localhost:3000')
            .post('/api/login')
            .send(User)
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Nincs ilyen felhasználó');
              done();
            });
      });
  });

 
  describe('/POST /:username/message', () => {
      it('it should not POST the message, because the user doesnt exists ', (done) => {
        let Story = {
            creator: 'batman',
			content: 'a',
			reciever: 'roxi',
        }
            chai.request('http://localhost:3000')
            .post('/api/user/rox/message')
            .send(Story)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Nincs ilyen felhasználó');
              done();
            });
      });
      
      it('it should POST a message ', (done) => {
        let Story = {
            creator: 'batman',
			content: 'a',
			reciever: 'roxi',
        }
            chai.request('http://localhost:3000')
            .post('/api/user/roxi/message')
            .send(Story)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Üzenet elküldve');
              done();
            });
      });
  });
  
  describe('/GET :username/message', () => {
    it('should list all users', function(done) {
        chai.request('http://localhost:3000')
            .get('/api/users')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
            done();
         });
     });
  
    it('should not list users message because token is missing', function(done) {
        chai.request('http://localhost:3000')
            .get('/api/user/halika4/message')
            .end(function(err, res){
                res.should.have.status(401);
                res.body.should.have.property('message').eql('Hiányzó token');
            done();
         });
     });
  
    it('should list users message', function(done) {
        chai.request('http://localhost:3000')
            .get('/api/user/are3/message')
            .set('x-acces-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ODI1Yjc3YzlkODZkNjQyMzQ5YmM2YSIsIm5hbWUiOiJ3aG8zIiwidXNlcm5hbWUiOiJhcmUzIiwiaWF0IjoxNDg0OTM4MTAzLCJleHAiOjE0ODUwODIxMDN9.dMZJGKvvRQ68MEqTFDJwRYnElVzgNyFgMtizk-GJ6oM')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
            done();
         });
     });

     it('should not list users mesage because token is wrong', function(done) {
        chai.request('http://localhost:3000')
            .get('/api/user/are3/message')
            .set('x-acces-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ODI1Yjc3YzlkODZkNjQyMzQ5YmM2YSIsIm5hbWUiOiJ3aG8zIiwidXNlcm5hbWUiOiJhcmUzIiwiaWF0IjoxNDg0OTM4MTAzLCJleHAiOjE0ODUwODIxMDN9.dMZJGKvvRQ68MEqTFDJwRYnElVzgNyFgMtizk-GJ6o')
            .end(function(err, res){
                res.should.have.status(403);
                res.body.should.have.property('message').eql('Hibás token');
            done();
         });
     });
  });

  
