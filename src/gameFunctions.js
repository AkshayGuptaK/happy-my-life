exports.cardFuncs = {
  'banana': changePlayerStateFuncFactory(1, 'energy'),
  'waterbottle': noChange,
  'raincheck': composeStateFunc(changePlayerStateFuncFactory(1, 'draft'), draw), // add draw
  'boxofsweets': changePlayerStateFuncFactory(4, 'energy'),
  'blueberrypie': changePlayerStateFuncFactory(2, 'energy'),
  'brainstorm': noChange,
  'hardwork': changePlayerStateFuncFactory(2, 'effort'),
  'runerrand': changePlayerStateFuncFactory(1, 'effort'),
  'study': changePlayerStateFuncFactory(1, 'draft'),
  'train': changePlayerStateFuncFactory(2, 'draft')
}

exports.draw = draw
exports.shuffle = shuffle

function composeStateFunc (func1, func2) {
  return (x) => func1(func2(x))
}

function draw (state) {
  if (state.deck.length > 0) {
    state.hand.push(state.deck.shift())
    return state
  }
  if (state.discard.length > 0) {
    state.deck = shuffle(state.discard)
    state.discard = []
    return draw(state)
  } return state
}

function shuffle (arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let index = Math.floor(Math.random() * (i + 1))
    let current = arr[i]
    let swap = arr[index]
    arr[index] = current
    arr[i] = swap
  } return arr
}

function noChange (state) { // placeholder function for not implemented cards
  return state
}

function changePlayerStateFuncFactory (int, property) {
  return function changePlayerState (state) {
    state.player[property] += int
    return state
  }
}
