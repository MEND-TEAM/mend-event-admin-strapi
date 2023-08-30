export const stateLogger = store => next => action => {
    // console.group(action.type)
    // console.info('dispatching', action)
    let state = store.getState();
    // console.log('before state', store.getState())
    let result = next(action)
    // console.log('next state', store.getState())
    // console.groupEnd(action.type)
    return result
}