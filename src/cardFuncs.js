module.exports = {
  'banana': changePlayerStateFuncFactory(1, 'energy'),
  'waterbottle': noChange,
  'raincheck': changePlayerStateFuncFactory(1, 'drafts'),
  'boxofsweets': changePlayerStateFuncFactory(4, 'energy'),
  'blueberrypie': changePlayerStateFuncFactory(2, 'energy'),
  'brainstorm': noChange,
  'hardwork': changePlayerStateFuncFactory(2, 'effort'),
  'runerrand': changePlayerStateFuncFactory(1, 'effort'),
  'study': changePlayerStateFuncFactory(1, 'drafts'),
  'train': changePlayerStateFuncFactory(2, 'drafts')
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
