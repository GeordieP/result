# @geordiep/result

A Result object for tracking operation status and value.

Created primarily for use in an Electron application when sending data through Electron's IPC. When the Electron backend sends the product of some operation back down to the frontend web application, the Result object provides a simple way to detect whether or not an action was successful, and in the case of an error, report where the error happened without revealing a full stack trace unless so desired (This allows us to report backend errors inside the frontend, with friendly error messages that still give a hint as to where the error occurred).

This module is intended to be flexible, and as such is very forgiving. No data types are enforced, and all constructor arguments are technically optional (though omitting the first will cause things to break).


## Install

`npm install geordiep/result`

or

`yarn install geordiep/result`

JavaScript import:

```js
// don't forget the @!
const Result = require('@geordiep/result')
```

## Basic Usage

### Creating Result objects

#### Type: Ok

Create Ok result using constructor:

```js
let res = new Result(true, 'my success value!')
```

or, using Result module newOk function:

```js
let res = Result.newOk('my success value!')
```

#### Type: Error

Create Err result using constructor:

```js
let myErrValue = new Error('encountered an error!')
let res = new Result(false, myErrValue, 'myModule @ myFunctionName()' 'err_something_went_wrong')
```

or, using Result module newError function:

```js
let myErrValue = new Error('encountered an error!')
let res = Result.newError(myErrValue, 'myModule @ myFunctionName()' 'err_something_went_wrong')
```

### Using Result objects

*NOTE:* Assume a Result instance `res` is in current scope for the following examples.

Check result is Ok, and use contained value

```js
if (res.isOk()) {
    const theValue = res.value
    console.log('result contained value', theValue)
}
```

Check result is Error and use contained value, origin, and error type

```js
if (res.isError()) {
    console.error('Result was an error.')
    console.error('error value:', res.value)
    console.error('origin:', res.origin)
    console.error('error type:', res.errorType)
}
```


Extract value from Result objects if Ok, or throw Result if Error using expect()

*NOTE:* Assume Result instances `firstRes` and `secondRes` are in current scope for the following example.

```js
try {
    const myFirstValue = firstRes.expect()
    const mySecondValue = secondRes.expect()

    console.log('Both results were Ok status')
    console.log('Value held in first result was', myFirstValue)
    console.log('Value held in second result was', mySecondValue)
} catch(r) {
    console.error('One of the Result objects was an error.')
    console.error('error value:', r.value)
    console.error('origin:', r.origin)
    console.error('error type:', r.errorType)
}
```

## Result Prototype Functions

### Constructor `new Result(ok, value, origin, errorType)`

```
  Constructor -> Result
  
  Args:
    ok: boolean - true means Ok Result, false means Error Result.
    value: T - (optional) Result payload, expect any type. Often contains an Error object if Result is error.
    origin: string - (optional) Message explaining source of value; useful for tracking errors.
    errorType: string - (optional) String representing type of error.
  
  Note that no types are enforced; the descriptions above represent common use cases.
```

### Expect `.expect()`

```
  expect -> T value, throws Result

  No Args
  
  Convenience method especially good for working with async/await, avoiding the
  need for boilerplate Ok checking for every Result.

  Return contained value, or throw self.
  If Result instance is an error result, throw self (caller's catch can then read
    Result value, origin, and errorType like normal).
  Otherwise, Result is Ok; return data in 'value' property.
```

### isOk `.isOk()`

```
  isOk -> boolean

  No Args
  
  Return status of Result instance.
  True represents Ok, false represents Error.
```

### isError `.isError()`

```
  isError -> boolean

  No Args
  
  Return _isOk negated
  True represents Error, false represents Ok.
```

## Result Module Functions 

### `static` fromJson `Result.fromJson(template)`

```
  fromJson -> Result

  Args:
    template: Result Object or JSON String - Result Object or Stringified Result Object to create a new Result from
  
  When we JSON.stringify (and later JSON.parse) a Result, we lose associated functions.
  fromJson takes an existing Result object (or json string) and returns a new Result with the same
  values, allowing associated Result functions to be used with the data once again.
  
  Argument 'template' can be a Result in the form of a JSON string or an already parsed object.
```

### `static` newOk `Result.newOk(value, origin)`

```
  newOk -> Result
  
  Args:
    value: T - value to pass to constructor
    origin: string - (optional) origin to pass to constructor
  
  Shortcut for creating a new Ok result
```

### `static` newError `Result.newError(value, origin, errType)`

```
  newError -> Result
  
  Args:
    value: T - value to pass to constructor
    origin: string - (optional) origin to pass to constructor
    errType: string - (optional) errorType to pass to constructor
  
  Shortcut for creating a new Error result
```

## Further Usage

### Send stringified Result through network, parse on recv

Server Side:

```js
const Result = require('@geordiep/result')

// create result
let res = new Result(true, 'my success value')

// convert to json
let jRes = JSON.stringify(res)

// send through network
// ...
//

```

Client Side:

```js
const Result = require('@geordiep/result')

// recv from network
let jRes = myNetworkRequest.response

// convert JSON into object
let res = JSON.parse(jRes)

// at this point, Result will simply be an object with its fields; none of the associated methods will exist
// To bring the methods back, use the utility function 'fromJson'
res = Result.fromJson(res)

// now we can use methods as usual

try {
    // call expect to get value from result object or throw error
    let continedValue = res.expect()

    // if we got here, expect didn't throw; use the value
    console.log('successful request; value is', containedValue)
} catch(e) {
    // result was an error type, calling expect() caused it to throw itself
    // now deal with the error
    console.error('recvd error from', e.origin)
    console.error('err type string', e.errType)
}
```
