[Demo](https://qqjckimo.github.io/json_condensed_formater/)

### Goal
Formating JSON list elements from multiple line to single line :
```javascript
{
    'prop_a': [1, 
          2, 
          3, 
          4, 
          5],
    'prop_b': [
        {
        'prop_c': [
          1,
          2,
          3
        ]
        }{
        'prop_c': [
          4,
          5,
          6
        ]
        },
    ]
}
```
after formatted, with specified property name : prop_a, prop_b
```javascript
{
    'prop_a': [1, 2, 3, 4, 5],
    'prop_b': [
        {'prop_c': [1, 2, 3]},
        {'prop_c': [4, 5, 6]},
    ]
}
```

