# Winston Logger

Opinionated winston:

* Use `console` for terminal.
* Use `winston-daily-rotate-file` for file. By default, the logs are saved in ./logs, which is located in the root folder where you run the application.

> [!IMPORTANT]
> Properties with an undefined value will not be logged.
> This behavior differs from console.log, which can display `"key": undefined`.
> However, if there is an `undefined` value inside an array, it will be logged as `null`.
> See the usage below for more details.

## Usage

```ts
import { WinstonLogger, defaultTransports } from "winston-logger";

const logger = new WinstonLogger("debug", defaultTransports({
  console: true,
  dailyRotateFile: true,
}));

const root = {
  a: undefined,
  b: null,
  c: 0,
  d: "",
  e: 1,
  f: "1",
  g: [null, undefined],
  h: [undefined, undefined],
};

const meta = Object.assign({}, root, {
  i: root,
  j: [root, root],
  k: [1, 2],
  l: ["a", "b"],
  m: Object.assign({}, root, { n: root }),
});

logger.log("debug", {
  meta
});
```

The output

```
{"level":"debug","message":{"id":"d2af8d40-5adc-11ef-bc4a-231e06abc82d","level":"debug","meta":{"b":null,"c":0,"d":"","e":1,"f":"1","g":[null,null],"h":[null,null],"i":{"b":null,"c":0,"d":"","e":1,"f":"1","g":[null,null],"h":[null,null]},"j":[{"b":null,"c":0,"d":"","e":1,"f":"1","g":[null,null],"h":[null,null]},{"b":null,"c":0,"d":"","e":1,"f":"1","g":[null,null],"h":[null,null]}],"k":[1,2],"l":["a","b"],"m":{"b":null,"c":0,"d":"","e":1,"f":"1","g":[null,null],"h":[null,null],"n":{"b":null,"c":0,"d":"","e":1,"f":"1","g":[null,null],"h":[null,null]}}}},"timestamp":"2024-08-15T08:03:14.580Z"}
```

and after reformat it manually,

```json
{
  "level": "debug",
  "message": {
    "id": "d2af8d40-5adc-11ef-bc4a-231e06abc82d",
    "level": "debug",
    "meta": {
      "b": null,
      "c": 0,
      "d": "",
      "e": 1,
      "f": "1",
      "g": [
        null,
        null
      ],
      "h": [
        null,
        null
      ],
      "i": {
        "b": null,
        "c": 0,
        "d": "",
        "e": 1,
        "f": "1",
        "g": [
          null,
          null
        ],
        "h": [
          null,
          null
        ]
      },
      "j": [
        {
          "b": null,
          "c": 0,
          "d": "",
          "e": 1,
          "f": "1",
          "g": [
            null,
            null
          ],
          "h": [
            null,
            null
          ]
        },
        {
          "b": null,
          "c": 0,
          "d": "",
          "e": 1,
          "f": "1",
          "g": [
            null,
            null
          ],
          "h": [
            null,
            null
          ]
        }
      ],
      "k": [
        1,
        2
      ],
      "l": [
        "a",
        "b"
      ],
      "m": {
        "b": null,
        "c": 0,
        "d": "",
        "e": 1,
        "f": "1",
        "g": [
          null,
          null
        ],
        "h": [
          null,
          null
        ],
        "n": {
          "b": null,
          "c": 0,
          "d": "",
          "e": 1,
          "f": "1",
          "g": [
            null,
            null
          ],
          "h": [
            null,
            null
          ]
        }
      }
    }
  },
  "timestamp": "2024-08-15T08:03:14.580Z"
}
```
