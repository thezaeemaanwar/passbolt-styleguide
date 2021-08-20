/**
 * Default props
 * @returns {*}
 */
export function defaultProps() {
  return {
    passwordGeneratorContext: {
      settings: {
        default_generator: "passphrase",
        generators: [
          {
            "name": "Password",
            "type": "password",
            "default_options": {
              "length": 18,
              "look_alike": true,
              "min_length": 8,
              "max_length": 128,
            },
            "masks": [
              {
                "name": "upper",
                "label": "A-Z",
                "characters": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
              },
              {
                "name": "lower",
                "label": "a-z",
                "characters": "abcdefghijklmnopqrstuvwxyz",
              },
              {
                "name": "digit",
                "label": "0-9",
                "characters": "0123456789",
                "required": true,
              },
              {
                "name": "parenthesis",
                "label": "{ [ ( | ) ] ] }",
                "characters": "([|])",
              },
              {
                "name": "special_char1",
                "label": "# $ % & @ ^ ~",
                "characters": "#$%&@^~"
              },
              {
                "name": "special_char2",
                "label": ". , : ;",
                "characters": ".,:;"
              },
              {
                "name": "special_char5",
                "label": "< * + ! ? =",
                "characters": "<*+!?="
              },
              {
                "name": "emoji",
                "label": "😘",
                "characters": "😀😃😄😁😆😅😂🤣🥲☺️😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🥸🤩🥳😏😒😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😤😠😡🤬🤯😳🥵🥶😱😨😰😥😓🤗🤔🤭🤫🤥😶😐😑😬🙄😯😦😧😮😲🥱😴🤤😪😵🤐🥴🤢🤮🤧😷🤒🤕🤑🤠😈👿👹👺🤡💩👻💀☠️👽👾🤖🎃😺😸😹😻😼😽🙀😿😾"
              },
              {
                "name": "ascii",
                "label": "ascii",
                "characters": "%&¡¢£¤¥¦§¨©ª«¬®¯°±²³µ¶·¸¹º»¼½¾¿ÀÁ ÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿŒœŠšŸƒ—„†‡•…‰€™"
              }
            ],
          },
          {
            "name": "Passphrase",
            "type": "passphrase",
            "default_options": {
              "word_count": 8,
              "word_case": "lowercase",
              "min_word": 4,
              "max_word": 40,
              "separator": " "
            },
          }
        ]
      },
      onPasswordGenerated: jest.fn()
    },
    history: {
      push: jest.fn(),
      goBack: jest.fn()
    }
  };
}