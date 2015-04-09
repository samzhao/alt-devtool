import DevActions from '../actions/DevActions'
import DispatcherStore from './DispatcherStore'
import alt from '../flux/alt'
import stringScore from '../utils/stringScore'

const DispatcherSearchStore = alt.createStore({
  displayName: 'DispatcherSearchStore',

  bindListeners: {
    addItem: DevActions.addDispatch,
    clearAll: DevActions.clearDispatches,
    revert: DevActions.revert,
    search: DevActions.search,
    select: DevActions.selectRow,
    toggleLogDispatch: DevActions.toggleLogDispatch
  },

  state: {
    dispatches: [],
    logDispatches: DispatcherStore.getState().logDispatches,
    revertId: null,
    searchValue: '',
    selectedPayload: {}
  },

  beforeEach() {
    this.waitFor(DispatcherStore)
  },

  addItem() {
    const { logDispatches } = DispatcherStore.getState()

    if (!logDispatches) {
      return false
    }

    return this.updateSearch(this.state.searchValue)
  },

  clearAll() {
    this.state.dispatches = []
    this.state.searchValue = ''
    this.state.selectedPayload = {}
  },

  revert(id) {
    this.state.revertId = id
  },

  search(searchValue) {
    return this.updateSearch(searchValue)
  },

  select(payload) {
    this.state.selectedPayload = payload
  },

  toggleLogDispatch() {
    this.state.logDispatches = DispatcherStore.getState().logDispatches
  },

  updateSearch(searchValue) {
    const { dispatches } = DispatcherStore.getState()

    if (!searchValue.trim()) {
      return this.setState({
        dispatches,
        searchValue
      })
    }

    const filteredDispatches = dispatches.filter((dispatch) => {
      return stringScore(dispatch.action.replace('#', ''), searchValue) > .25
    })

    const selectedPayload = filteredDispatches.reduce((obj, dispatch) => {
      return dispatch.data === this.state.selectedPayload
        ? dispatch.data
        : obj
    }, {})

    return this.setState({
      dispatches: filteredDispatches,
      searchValue,
      selectedPayload
    })
  }
})

export default DispatcherSearchStore
