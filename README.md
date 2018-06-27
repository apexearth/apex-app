<a name="module_apex-app"></a>

## apex-app
For creating interactive apps using *pixi.js*.

## Example App

Particle Sandbox  
URL: http://particlesandbox.com  
GitHub: https://github.com/apexearth/particle-sandbox  
App Class: https://github.com/apexearth/particle-sandbox/blob/develop/app/ParticleSandbox.js#L25

### Basic Usage

1. Create an App.
2. Add AppObjects to it.
3. Create a renderer for the App.
4. The renderer starts the update & draw loop, rendering the App.

```javascript
const {
   App,
   AppObject,
   createRenderer,
   PIXI,
   setting,
   properties,
   property
} = require('apex-app')

// Extend App
// Initialize with a single AppObject drawn as a white square.
class Game extends App {
   constructor() {
       super()
       let obj = new AppObject({app: this, parent: this})
       obj.graphics.beginFill(0xffffff, 1)
       obj.graphics.drawRect(0, 0, 10, 10)
       obj.graphics.endFill()
       this.add(obj)
   }
}

// Create renderer and attach canvas to `document.body`.
createRenderer(new Game(), {
   rendererOptions: {
       backgroundColor: 0x333333
   }
})
```

<a name="App"></a>

## App
The core app containing the update loop.

**Kind**: global class  

* [App](#App)
    * [new App(options)](#new_App_new)
    * _instance_
        * [.type](#App+type) : <code>string</code>
        * [.objects](#App+objects) : <code>Array.&lt;AppObject&gt;</code>
        * [.view](#App+view)
        * [.position](#App+position) ⇒ <code>App.container.position</code> \| <code>Object</code>
        * [.scale](#App+scale) ⇒ <code>App.container.scale</code> \| <code>Object</code>
        * [.targetScale](#App+targetScale) ⇒ <code>Object</code>
        * [.screenWidth](#App+screenWidth) ⇒ <code>Number</code>
        * [.screenHeight](#App+screenHeight) ⇒ <code>Number</code>
        * [.paused](#App+paused) ⇒ <code>boolean</code>
        * [.paused](#App+paused)
        * [.zoom](#App+zoom)
        * [.zoom](#App+zoom)
        * [.centerOn(object)](#App+centerOn)
        * [.togglePause()](#App+togglePause)
        * [.pauseRendering()](#App+pauseRendering)
        * [.resumeRendering()](#App+resumeRendering)
        * [.kill()](#App+kill)
        * [.translatePosition(position)](#App+translatePosition) ⇒ <code>Object</code>
        * [.update(seconds)](#App+update)
        * [.previewObject(object)](#App+previewObject) ⇒ <code>AppObject</code>
        * [.cancelPreview(object)](#App+cancelPreview) ⇒ <code>AppObject</code>
        * [.removeObjects(objects)](#App+removeObjects)
        * [.contains(object)](#App+contains) ⇒ <code>boolean</code>
        * [.add(object)](#App+add) ⇒ <code>AppObject</code>
        * [.remove(object)](#App+remove) ⇒ <code>AppObject</code>
        * [.addFx(object)](#App+addFx)
        * [.removeFx(object)](#App+removeFx)
        * [.updateZoom(seconds)](#App+updateZoom)
        * [.selectObject(object, additive)](#App+selectObject)
        * [.select(left, top, right, bottom, additive)](#App+select)
        * [.selectAll()](#App+selectAll)
        * [.deselectAll()](#App+deselectAll)
        * [.removeSelected()](#App+removeSelected)
    * _static_
        * [.defaultOptions](#App.defaultOptions) ⇒ <code>Object</code>

<a name="new_App_new"></a>

### new App(options)

| Param | Description |
| --- | --- |
| options | The options to use in the App. |

<a name="App+type"></a>

### app.type : <code>string</code>
The object type. ("app")

**Kind**: instance property of [<code>App</code>](#App)  
<a name="App+objects"></a>

### app.objects : <code>Array.&lt;AppObject&gt;</code>
The AppObjects added to the App.

**Kind**: instance property of [<code>App</code>](#App)  
<a name="App+view"></a>

### app.view
View options.

**Kind**: instance property of [<code>App</code>](#App)  
<a name="App+position"></a>

### app.position ⇒ <code>App.container.position</code> \| <code>Object</code>
This position {x, y} of the App view.

**Kind**: instance property of [<code>App</code>](#App)  
<a name="App+scale"></a>

### app.scale ⇒ <code>App.container.scale</code> \| <code>Object</code>
The scale {x, y} of the App view.

**Kind**: instance property of [<code>App</code>](#App)  
<a name="App+targetScale"></a>

### app.targetScale ⇒ <code>Object</code>
The target scale {x, y} of the App view. (zoom target)

**Kind**: instance property of [<code>App</code>](#App)  
<a name="App+screenWidth"></a>

### app.screenWidth ⇒ <code>Number</code>
The width of the window.

**Kind**: instance property of [<code>App</code>](#App)  
<a name="App+screenHeight"></a>

### app.screenHeight ⇒ <code>Number</code>
The height of the window.

**Kind**: instance property of [<code>App</code>](#App)  
<a name="App+paused"></a>

### app.paused ⇒ <code>boolean</code>
Get the app paused value.

**Kind**: instance property of [<code>App</code>](#App)  
<a name="App+paused"></a>

### app.paused
Set the app paused value.

**Kind**: instance property of [<code>App</code>](#App)  

| Param | Type |
| --- | --- |
| val | <code>boolean</code> | 

<a name="App+zoom"></a>

### app.zoom
Get the zoom value.

**Kind**: instance property of [<code>App</code>](#App)  
<a name="App+zoom"></a>

### app.zoom
Set the zoom value.

**Kind**: instance property of [<code>App</code>](#App)  

| Param |
| --- |
| val | 

<a name="App+centerOn"></a>

### app.centerOn(object)
Center on an object in the App.

**Kind**: instance method of [<code>App</code>](#App)  

| Param |
| --- |
| object | 

<a name="App+togglePause"></a>

### app.togglePause()
Toggle app paused value.

**Kind**: instance method of [<code>App</code>](#App)  
<a name="App+pauseRendering"></a>

### app.pauseRendering()
Pause rendering of the app.

**Kind**: instance method of [<code>App</code>](#App)  
<a name="App+resumeRendering"></a>

### app.resumeRendering()
Resume rendering of the app.

**Kind**: instance method of [<code>App</code>](#App)  
<a name="App+kill"></a>

### app.kill()
Kill the app renderer.

**Kind**: instance method of [<code>App</code>](#App)  
<a name="App+translatePosition"></a>

### app.translatePosition(position) ⇒ <code>Object</code>
Translate a position from the window into the app.

**Kind**: instance method of [<code>App</code>](#App)  

| Param |
| --- |
| position | 

<a name="App+update"></a>

### app.update(seconds)
The main update loop of the app, which is triggered by the renderer.

**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type |
| --- | --- |
| seconds | <code>Number</code> | 

<a name="App+previewObject"></a>

### app.previewObject(object) ⇒ <code>AppObject</code>
Add an AppObject to the view, but not the game loop.

**Kind**: instance method of [<code>App</code>](#App)  
**Returns**: <code>AppObject</code> - - (object)  

| Param | Type |
| --- | --- |
| object | <code>AppObject</code> | 

<a name="App+cancelPreview"></a>

### app.cancelPreview(object) ⇒ <code>AppObject</code>
Remove an AppObject from the view which was added with .previewObject()

**Kind**: instance method of [<code>App</code>](#App)  
**Returns**: <code>AppObject</code> - - (object)  

| Param | Type |
| --- | --- |
| object | <code>AppObject</code> | 

<a name="App+removeObjects"></a>

### app.removeObjects(objects)
Remove an array of AppObjects.

**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type | Description |
| --- | --- | --- |
| objects | <code>Array.&lt;AppObject&gt;</code> | An array of AppObjects to remove from the App. |

<a name="App+contains"></a>

### app.contains(object) ⇒ <code>boolean</code>
Check if the App contains an AppObject.

**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>AppObject</code> | The AppObject to check. |

<a name="App+add"></a>

### app.add(object) ⇒ <code>AppObject</code>
Add an AppObject to the App.

**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>AppObject</code> | The AppObject to add. |

<a name="App+remove"></a>

### app.remove(object) ⇒ <code>AppObject</code>
Remove an AppObject from the App.

**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>AppObject</code> | The AppObject to remove. |

<a name="App+addFx"></a>

### app.addFx(object)
Add an AppObject to the FX layer.

**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>AppObject</code> | The FX object to add. |

<a name="App+removeFx"></a>

### app.removeFx(object)
Remove an AppObject from the FX layer.

**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>AppObject</code> | The FX object to remove. |

<a name="App+updateZoom"></a>

### app.updateZoom(seconds)
Update the App scale and position based on the targetScale (zoom).

**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type | Description |
| --- | --- | --- |
| seconds | <code>Number</code> | The amount of time passed since the last update. |

<a name="App+selectObject"></a>

### app.selectObject(object, additive)
Select an AppObject.

**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| object | <code>AppObject</code> |  | The object to select. |
| additive | <code>boolean</code> | <code>false</code> | Whether to add to the current selections, instead of replacing them. |

<a name="App+select"></a>

### app.select(left, top, right, bottom, additive)
Select all objects within the given coordinates.

**Kind**: instance method of [<code>App</code>](#App)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| left | <code>number</code> |  | The left coordinate. (x1) |
| top | <code>number</code> |  | The top coordinate. (y1) |
| right | <code>number</code> |  | The right coordinate. (x2) |
| bottom | <code>number</code> |  | The bottom coordinate. (y2) |
| additive | <code>boolean</code> | <code>false</code> | Whether to add to the current selections, instead of replacing them. |

<a name="App+selectAll"></a>

### app.selectAll()
Select all objects within the app.

**Kind**: instance method of [<code>App</code>](#App)  
<a name="App+deselectAll"></a>

### app.deselectAll()
Deselect all selected objects.

**Kind**: instance method of [<code>App</code>](#App)  
<a name="App+removeSelected"></a>

### app.removeSelected()
Remove all selected objects.

**Kind**: instance method of [<code>App</code>](#App)  
<a name="App.defaultOptions"></a>

### App.defaultOptions ⇒ <code>Object</code>
The default options which are used in an App.

**Kind**: static property of [<code>App</code>](#App)  
<a name="AppObject"></a>

## AppObject
AppObjects which are added to the App.

**Kind**: global class  

* [AppObject](#AppObject)
    * [new AppObject(app, parent, player, position, scale, pivot, rotation, momentum, dampening)](#new_AppObject_new)
    * [.select()](#AppObject+select)
    * [.deselect()](#AppObject+deselect)
    * [.selectionHitTest()](#AppObject+selectionHitTest)
    * [.beforeUpdate(seconds)](#AppObject+beforeUpdate)
    * [.update(seconds)](#AppObject+update)
    * [.afterUpdate(seconds)](#AppObject+afterUpdate)
    * [.updateMovement(seconds)](#AppObject+updateMovement)
    * [.updateDampening(seconds)](#AppObject+updateDampening)
    * [.draw()](#AppObject+draw)

<a name="new_AppObject_new"></a>

### new AppObject(app, parent, player, position, scale, pivot, rotation, momentum, dampening)
Instantiate a new AppObject.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | The App the AppObject belongs to. |
| parent | <code>App</code> \| [<code>AppObject</code>](#AppObject) | The parent of the AppObject. |
| player | <code>object</code> | The player who owns the AppObject. |
| position | <code>object</code> | The position {x, y} of the AppObject. |
| scale | <code>object</code> | The scale {x, y} of the AppObject. |
| pivot | <code>object</code> | The pivot point {x, y} for rotation of the AppObject. |
| rotation | <code>object</code> | The rotation of the AppObject. |
| momentum | <code>object</code> | The movement speed of the AppObject. |
| dampening | <code>object</code> | The amount that momentum and rotation decreases over time. |

<a name="AppObject+select"></a>

### appObject.select()
Select this AppObject.

**Kind**: instance method of [<code>AppObject</code>](#AppObject)  
<a name="AppObject+deselect"></a>

### appObject.deselect()
Deselect this AppObject

**Kind**: instance method of [<code>AppObject</code>](#AppObject)  
<a name="AppObject+selectionHitTest"></a>

### appObject.selectionHitTest()
Check if provided coordinates are cause for the selection of this AppObject

**Kind**: instance method of [<code>AppObject</code>](#AppObject)  
<a name="AppObject+beforeUpdate"></a>

### appObject.beforeUpdate(seconds)
The update operation to occur before all normal update operations within the App.

**Kind**: instance method of [<code>AppObject</code>](#AppObject)  

| Param | Type | Description |
| --- | --- | --- |
| seconds | <code>number</code> | The number of seconds since the last update. |

<a name="AppObject+update"></a>

### appObject.update(seconds)
The update operation for the main loop of the App.

**Kind**: instance method of [<code>AppObject</code>](#AppObject)  

| Param | Type | Description |
| --- | --- | --- |
| seconds | <code>number</code> | The number of seconds since the last update. |

<a name="AppObject+afterUpdate"></a>

### appObject.afterUpdate(seconds)
The update operation to occur after all normal update operations within the App.

**Kind**: instance method of [<code>AppObject</code>](#AppObject)  

| Param | Type | Description |
| --- | --- | --- |
| seconds | <code>number</code> | The number of seconds since the last update. |

<a name="AppObject+updateMovement"></a>

### appObject.updateMovement(seconds)
Update movement based on momentum.

**Kind**: instance method of [<code>AppObject</code>](#AppObject)  

| Param | Type | Description |
| --- | --- | --- |
| seconds | <code>number</code> | The number of seconds since the last update. |

<a name="AppObject+updateDampening"></a>

### appObject.updateDampening(seconds)
Update movement dampening, causing the AppObject to slow down.

**Kind**: instance method of [<code>AppObject</code>](#AppObject)  

| Param | Type | Description |
| --- | --- | --- |
| seconds | <code>number</code> | The number of seconds since the last update. |

<a name="AppObject+draw"></a>

### appObject.draw()
Update the visual appearance of the AppObject.

**Kind**: instance method of [<code>AppObject</code>](#AppObject)  
