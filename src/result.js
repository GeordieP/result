'use strict'

/*---
  Constructor -> Result
  
  Args
    ok: boolean - true means Ok Result, false means Error Result.
    value: T - (optional) Result payload, expect any type. Often contains an Error object if Result is error.
    origin: string - (optional) Message explaining source of value; useful for tracking errors.
    errorType: string - (optional )String representing type of error.
  
  Note that no types are enforced; the descriptions above represent common use cases.
---*/

function Result(ok, value, origin, errorType) {
    this._isOk = ok
    this.value = value
    this.origin = origin
    this.errorType = errorType
}

/*---
  expect -> T value, throws Result
  
  No Args
  
  Convenience method especially good for working with async/await, avoiding the
  need for boilerplate Ok checking for every Result.

  Return contained value, or throw self.
  If Result instance is an error result, throw self (caller's catch can then read
    Result value, origin, and errorType like normal).
  Otherwise, Result is Ok; return data in 'value' property.
---*/

Result.prototype.expect = function() {
    if (!this._isOk) throw this
    return this.value
}

/*---
  isOk -> boolean
  
  No Args
  
  Return status of Result instance.
  True represents Ok, false represents Error.
---*/

Result.prototype.isOk = function() {
    return this._isOk
}

/*---
  isError -> boolean
  
  Return _isOk negated
  True represents Error, false represents Ok.
---*/

Result.prototype.isError = function() {
    return !this._isOk
}

/*---
  fromJson() -> Result

  Args:
  template: Result Object or JSON String - Result Object or Stringified Result Object to create a new Result from
  
  When we JSON.stringify a Result, we lose associated functions.
  fromJson takes an existing Result object (or json string) and returns a new Result with the same
  values, allowing associated Result functions to be used with the data once again.
  
  Argument 'template' can be a Result in the form of a JSON string or an already parsed object.
---*/

Result.fromJson = function(template) {
    if (typeof template === 'string') {
        template = JSON.parse(template)
    }

    return new Result(
        template._isOk,
        template.value,
        template.origin,
        template.errType
    )
}

/*---
  newOk -> Result
  
  Args:
    value: T - value to pass to constructor
    origin: string - (optional) origin to pass to constructor
  
  Shortcut for creating a new Ok result
---*/

Result.newOk = function(value, origin) {
    return new Result(true, value, origin)
}

/*---
  newError -> Result
  
  Args:
    value: T - value to pass to constructor
    origin: string - (optional) origin to pass to constructor
    errType: string - (optional) errorType to pass to constructor
    
  
  Shortcut for creating a new Error result
---*/

Result.newError = function(value, origin, errType) {
    return new Result(false, value, origin, errType)
}

module.exports = Result
