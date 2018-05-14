const before = (state, action) => {
  console.log('State before action:', state)
  console.log('Full action:', action)
}

const after = (state, action, dispatch) => {
  console.log('State after action:', state)
}

export {
  before,
  after
}
