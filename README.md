# Thimble game

To try out the game open a [demo link](https://thimble-game.herokuapp.com/)

## Get Started

To setup project localy execute commands in terminal

```sh
git clone https://github.com/andrey-ponamarev/game-thimble.git

cd game-thimble

npm install

npm run dev:server

npm run dev:client
```

## Overview

### Server

Each time when user click on play button client sends request to get animation path.
Successful response represents animation path as array of _Moves_.
Each _Move_ is array of two numbers numbers where first number is a position of container needed to be replaced to the second - position in order of containers.

Example below shows animation path of 4 moves:

```javascript
{
  path: [[2, 0], [0, 1], [1, 2], [1, 0]]
  // AnimationPath: [Move, Move, Move, Move]
  // Move: [ContainerIndex, ContainerIndex]
}
```

### Client

By receiving animation's path client iterates through _moves_ with given [SPEED_GAME](https://github.com/andrey-ponamarev/game-thimble/blob/master/src/client/src/config.js#L3) interval and draws one transition.
Before game started the _order_ of containers reset to the default. _Order_ of containers is array of _ContainerId_ which represent current position of thimbles.

Example of ordering container id's [default position](https://github.com/andrey-ponamarev/game-thimble/blob/master/src/client/src/components/Board.js#L15) and [before starting](https://github.com/andrey-ponamarev/game-thimble/blob/master/src/client/src/components/Board.js#L27) looks like:

```javascript
;[0, 1, 2] // [ContainerId, ContainerId, ContainerId]
```

[The logic of calculation](https://github.com/andrey-ponamarev/game-thimble/blob/master/src/client/src/components/Board.js#L68) next containers order after _move_ is simple: Take value(**ContainerId**) in order by index which is the first element (**ContainerIndex**) in _move_ and replace it with value(**ContainerId**) in current order by index of the second element(**ContainerIndex**) in _move_

```javascript
// Order is [0, 1 ,2]
setNextPosition([1, 2]) // Paramameter is a Move
// Order is [0, 2, 1]
setNextPosition([0, 2])
// Order is [1, 2, 0]
```

### Containers animation

To move container from current to next position we have to find out how far container should be moved from default position (by default each container has css property [translateX(0%)](https://github.com/andrey-ponamarev/game-thimble/blob/master/src/client/src/components/Board.js#L28))

Formula calculation position:

```javascript
(ContainerIndex - ContainerId) * 100%
```

[After applying formula for each item in order](https://github.com/andrey-ponamarev/game-thimble/blob/master/src/client/src/components/Board.js#L77) we can find out all item positions:

```javascript
// fn(order) -> positions
calculatePosition([0, 1, 2]) // Positions [    0%,    0%,    0%]
calculatePosition([1, 0, 2]) // Positions [  100%, -100%,    0%]
calculatePosition([1, 2, 0]) // Positions [  200%, -100%, -100%]
```

### Ball

[The winning ball position](https://github.com/andrey-ponamarev/game-thimble/blob/master/src/client/src/config.js#L4) correspond to the **ContainerId** in current order.
Ball animates in the same way as containers and always follow the corresponded **ContainerId**
