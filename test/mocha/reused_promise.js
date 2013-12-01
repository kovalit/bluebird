"use strict";

var assert = require("assert");

var adapter = require("../../js/debug/bluebird.js");
var fulfilled = adapter.fulfilled;
var rejected = adapter.rejected;
var pending = adapter.pending;
var Promise = adapter;



describe("If promise is reused to get at the value many times over the course of application", function() {
    var three = Promise.fulfilled(3);

    specify("It will not keep references to anything", function(done){
        var fn = function(){};
        var l = 256;
        while(l--) {
            three.then(fn, fn, fn);
            three.then(fn, fn, fn);
            three.then(fn, fn, fn);
            three.then(fn, fn, fn);
            three.then(fn, fn, fn);
        }

        setTimeout(function(){
            for( var i = 0; i < three._length() - 5; ++i) {
                assert( three[i] === void 0 );
            }
            assert( three._promise0 === void 0 );
            assert( three._fulfillmentHandler0 === void 0 );
            assert( three._rejectionHandler0 === void 0 );
            assert( three._progressHandler0 === void 0 );
            assert( three._receiver0 === void 0 );
            done();
        }, 13);
    });

    specify("It will be able to reuse the space", function(done) {
        var fn = function(){};
        var prom = three.then(fn, fn, fn);

        var l = 256;
        while(l--) {
            three.then(fn, fn, fn);
            three.then(fn, fn, fn);
            three.then(fn, fn, fn);
            three.then(fn, fn, fn);
        }


        assert( three._promise0 === prom );
        assert( three[0] === fn );
        assert( three[1] === fn );
        assert( three[2] === fn );
        assert( three._receiver0 === void 0 );

        three.then(function(){
            setTimeout(function(){
                assert(three._length() === 0);
                done();
            }, 13);
        });
    });
});
