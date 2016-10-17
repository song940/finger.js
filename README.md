## Finger.js

```js
var finger = new Finger('#view');

finger.on('tap', function(e){
  console.log('tap', e);
});

finger.on('tap2', function(e){
  console.log('double tap', e);
});

finger.on('move', function(e){
  console.log('move', e);
});

finger.on('swipe', function(e){
  console.log('swipe', e);
});

finger.on('pinch', function(e){
  console.log('scale', e);
});

finger.on('rotate', function(){
  console.log('rotate', e);
});
```