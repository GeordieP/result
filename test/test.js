'use strict'

const assert = require('assert')
const Result = require('../src/result')

function testConstructor() {
    // create Ok result
    let payload = 'success value string'

    let goodRes = new Result(true, payload)

    // object was created
    assert(goodRes, 'Result object not null')
    // Result object is an instance of Result type
    assert(goodRes instanceof Result, 'Result object is an instance of Result type')
    // ok status through .isOk()
    assert.equal(goodRes.isOk(), true, 'Result is Ok type, using .isOk method')
    // ok status through ._isOk
    assert.equal(goodRes._isOk, true, 'Result is Ok type, using _isOk field')
    // value is expected
    assert.equal(goodRes.value, payload, 'Result value matches payload')
    
    // create Error result
    let originString = 'test.js testConstructor()'
    let errTypeString = 'unknown_error'
    let err = new Error('encountered an error')

    let badRes = new Result(
        false,
        err,
        originString,
        errTypeString
    )

    // error status through .isOk()
    assert.equal(badRes.isOk(), false, 'Result is Error type, using .isOk method')
    // error status through .isError()
    assert.equal(badRes.isError(), true, 'Result is Error type, using .isError method')
    // error status through ._isOk
    assert.equal(badRes._isOk, false, 'Result is Error type, using _isOk field')
    // value is an Error object
    assert(badRes.value instanceof Error, 'Result value is an instance of Error type')
    // origin is expected
    assert.equal(badRes.origin, originString, 'Result origin is expected')
    // error type is expected
    assert.equal(badRes.errorType, errTypeString, 'Result error type is expected')
    
    console.log('testConstructor success')
}

function testNewOk() {
    // create Ok result
    let payload = 'success value string'
    let res = Result.newOk(payload)

    // object was created
    assert(res, 'Result object not null')
    // Result object is an instance of Result type
    assert(res instanceof Result, 'Result object is an instance of Result type')
    // ok status through .isOk()
    assert.equal(res.isOk(), true, 'Result is Ok type, using ok method')
    // value is expected
    assert.equal(res.value, payload, 'Result value matches payload')

    console.log('testNewOk success')
}

function testNewErr() {
    let originString = 'test.js testnewErr()'
    let errTypeString = 'unknown_error'
    let err = new Error('encountered an error')

    let res = Result.newError(err, origin, errTypeString)

    // error status through .isOk()
    assert.equal(res.isOk(), false, 'Result is Error type, using isOk method')
    // error status through .isError()
    assert.equal(res.isError(), true, 'Result is Error type, using isError method')
    // value is an Error object
    assert(res.value instanceof Error, 'Result value is an instance of Error type')
    // origin is expected
    assert.equal(res.origin, originString, 'Result origin is expected')
    // error type is expected
    assert.equal(res.errorType, errTypeString, 'Result error type is expected')
    
    console.log('testNewErr success')
}

function testJsonOps() {
    // create a success Result
    let payload = 'success value string'
    let res = new Result(true, payload)

    assert(res instanceof Result, 'Result object is an instance of Result type')

    // stringify Result
    let expectedString = '{"_isOk":true,"value":"success value string"}'
    let jRes = JSON.stringify(res)

    // stringified Result is a string
    assert.equal(typeof jRes, 'string', 'Stringified Result is a string')
    // stringified Result is expected string
    assert.equal(jRes, expectedString, 'Stringified Result is expected string')

    // 
    // parse json Result
    let parsedRes = JSON.parse(jRes)

    // parsed Result is NOT a Result object - it should be a plain object
    assert.equal((parsedRes instanceof Result), false, 'Parsed Result object is not an instance of Result type')
    // parsed Result has NO .expect method
    assert.equal(parsedRes.expect, undefined, 'Parsed Result object has no .expect method')
    // parsed Result has NO .isOk method
    assert.equal(parsedRes.isOk, undefined, 'Parsed Result object has no .isOk method')
    // parsed Result is ok using _isOk field
    assert.equal(parsedRes._isOk, true, 'Parsed Result is Ok type, using _isOk field')
    // parsed Result value is expected
    assert.equal(parsedRes.value, payload, 'Parsed Result value matches payload')

    //
    // turn json result back into a Result instance
    let newRes = Result.fromJson(parsedRes)

    // new Result object is an instance of Result type
    assert(newRes instanceof Result, 'New Result object is an instance of Result type')
    // new Result has .expect method
    assert.notEqual(newRes.expect, undefined, 'New Result object has .expect method')
    // new Result has .isOk method
    assert.notEqual(newRes.isOk, undefined, 'New Result object has .isOk method')
    // ok status through .isOk()
    assert.equal(newRes.isOk(), true, 'New Result is Ok type, using .isOk method')
    // value is expected
    assert.equal(newRes.value, payload, 'New Result value matches payload')

    console.log('testJsonOps success')
}

function testExpectOk() {
    // create Ok result
    let payload = 'success value string'
    let newPayload
    let res = new Result(true, payload)

    try {
        newPayload = res.expect()
    } catch(e) {
        assert.fail('Result.expect threw unexpected error: should have been Ok')
    }

    // expectped value matches original payload
    assert.equal(newPayload, payload, 'New payload matches original payload')
    
    console.log('testExpectOk success')
}

function testExpectErr() {
    // create Err result
    let originString = 'test.js testExpectErr()'
    let errTypeString = 'unknown_error'
    let err = new Error('encountered an error')
    let newPayload

    let res = new Result(
        false,
        err,
        originString,
        errTypeString
    )
    
    try {
        newPayload = res.expect()
    } catch(e) {
        // expect Result to throw itself
        assert(e instanceof Result, 'Caught object is an instance of Result type')
        assert(e.value instanceof Error, 'Result value is an instance of Error type')
        console.log('testExpectErr success')
        return
    }

    assert.fail('Expected a Result to be thrown, but nothing was caught')
}

testConstructor()
testJsonOps()
testExpectOk()
testExpectErr()
