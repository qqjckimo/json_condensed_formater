[Demo](https://qqjckimo.github.io/json_condensed_formater/)

### Goal
Formating JSON string in list element from this
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
to this, with specified property name : prop_a, prop_b
```javascript
{
    'prop_a': [1, 2, 3, 4, 5],
    'prop_b': [
        {'prop_c': [1, 2, 3]},
        {'prop_c': [4, 5, 6]},
    ]
}
```

