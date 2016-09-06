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
```javascirpt
{
    'prop_a': [1, 2, 3, 4, 5],
    'prop_b': [
        {'prop_c': [1, 2, 3]},
        {'prop_c': [4, 5, 6]},
    ]
}
```

