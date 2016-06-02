# ASWWU Request
A Modular [Angular 2](https://angular.io) Requests Service for [ASWWU](https://aswwu.com)  
Includes authentication and functions for GET, POST, login, and verification

## Install the NPM Package
`npm install --save git://github.com/aswwu-web/aswwu-requests`

## Setup
Add map and package entries for SystemJS  

**EXAMPLE:**  
```
System.config({
  map: {
    "aswwu-requests": "node_modules/aswwu-requests"
  },
  packages: {
    "aswwu-requests": { "defaultExtension": "js" }
  }
});
```

## Import and Usage
```
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RequestService } from 'aswwu-requests/aswwu-requests';

@Component({
  templateUrl: 'app/routes/login/login.component.html',
  providers: [ RequestService ]
})

export class LoginComponent {
  username: string;
  password: string;

  constructor( private router: Router, private req: RequestService ) { }

  login() {
    this.req.login(this.username, this.password, Callback(data) { });
  }
}
```

**NOTE:** If this package will be used multiple places, remove `providers: [ RequestService ]` from above and place it in the highest possible parent; often even as an array item when bootstrapping.

## General Usage
(Assuming `this.req` is defined as in the constructor example above)  

`this.req.get(URI, SuccessCallback(data) { }, ErrorCallback(data) { });`  
`this.req.post(URI, dataAsObject, SuccessCallback(data) { }, ErrorCallback(data) { });`

Where `URI` is simply `/search` or `search` rather than `https://server.com/search`

To verify login status at any time call `this.req.verify(Callback(data) { })`  
To check authentication status call `this.req.isAuthenticated()`

## Accessing Current User Data
The data passed to the callback functions for `this.req.login()` and `this.req.verify()` will be a JavaScript object including the user's:
  * WWUID
  * Username
  * Full Name (if provided)
  * Status (student|faculty|staff)
  * Roles (more on that later)

**NOTE:** This data is also available anytime by calling `this.req.getUser()`


## Changing Server URL
By default this uses `API_ENDPOINT = "https://aswwu.com/server/"` but this can be changed with `this.req.API_ENDPOINT = "some other URL"`
