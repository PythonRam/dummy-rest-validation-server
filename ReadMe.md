
# Dummy I/O Validation ReST server
---
> This is a handy node app to setup a mock server that supports all http method requests, it validates your request using values or regex and sends you back a response. All you need to do is write a simple config.json file.

Let's see one simple config file
#### Simple GET Request
```
{
    "/helloworld": {
        "method": "GET",
        "output": {
            "world": "hello"
        }
    }
}
```
Using this config file, when a client sends a GET request to the path **/helloworld** it sends back output.

#### Simple POST Request 
```
{
    "/infinitywar1":{
        "method": "POST",
        "input":{
            "name": "Tony Stark",
            "alterEgo": "Iron Man",
            "powers": [
                "Rich",
                "Genius"
            ]
        },
        "output":{
            "died": false, 
        }
    }
}
```
Here when you send a request to the url, it will check if the values in the request body match the values in the config input. If any value does not match it will show you exactly where the mismatch is happening. 

For example if we fail to send "Genius" in the list of powers then we get a **422 error**  
```
Expected key not found at /powers/1 
```
This specifies exactly what went wrong and where to find it. 

#### Using regex to validate 

You can also, configure any path to use regex validation instead of value.

```
"/ironman/suits":{
        "method": "POST",
        "inputMode": "REGEX",
        "inputRegex":{
            "name": "^Mark-[0-9]{1}$"
        },
        "output":{
            "destroyed": false
        }
    }
```
This will enable regex mode *only for this path* and will show where and what the error is.

#### Using path variables

Path variables are also supported and they can be used to send different outputs and validate against different inputs. 

```
"/infinitywar/<war>/<hero>":{
        "method": "POST",
        "input":{
            "<war>":{
                "1":{
                    "<hero>":{
                        "starlord": {
                            "hated": "YES!"
                        }
                    },
                    "default":{
                        "hated": "No"
                    }
                },
                "2":{
                    "hated": "probably not"
                }
            },
            "default":{
                "hated": "Idk"
            }
        },
        "output":{
            "<war>":{
                "1":{
                    "<hero>":{
                        "starlord": {
                            "response": "THEY ALMOST HAD THE GAUNTLET OFF!"
                        }
                    },
                    "default":{
                        "response": "Spidey was fun"
                    }
                }
            },
            "default":{
                "hated": "Can't wait for infinity war though!"
            }
        }
    }
```
In this example there are two path variables and inputMode is 'MOCK' by default, regex can also be used to validate input. 

 Understanding the above configuration: 

**For Input**

* When war is 1 and hero is starlord, hated needs to be "YES!". 
* When war is 1 and hero is spidey, hated needs to be "NO!".
* When war is 1 and hero is not starlord or spidey, hated needs to be "No".
* When war is 2 and hero is *anything*, hated needs to be "probably not".
* When war is neither 1 nor 2 and hero is *anything*, hated needs to be "Idk".

**For Output**

* When war is 1 and hero is starlord, response will be "THEY ALMOST HAD THE GAUNTLET OFF!". 
* When war is 1 and hero is not starlord, response will be "Spidey was fun".
* When war is not 1 and hero is *anything*, response will be "Can't wait for infinity war though!".
 
| param | Mandatory | Default | Description | Accepted Values |
|------------|-------------------------|---------|-------------------------------------------------------------------------------|---------------------------------|
| method | false | ALL | Specifies the method to allow for this path. Accepts all methods by default.  | POST, GET, PUT, DELETE, OPTIONS |
| input | true  (for 'MOCK' mode) |  | Input values to be checked against request body |  |
| output | true |  | Output value to be sent in response |  |
| inputMode | false | MOCK | Mode of input validation. | MOCK, REGEX |
| inputRegex | true (for 'REGEX' mode) |  | Input regex strings to validate the request body |  |