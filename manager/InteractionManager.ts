import Emitter from 'eventemitter3'
import { Record as IRecord, Stack, List, Map } from 'immutable'
import defaults from 'lodash/defaults'
import isEqual from 'lodash/isEqual'

export type IMode = 'command' | 'input' | 'default' | 'delegate'

export type IState = Record<string, any>

export type Callbacks = {
  undo: (value: any) => void
  redo: (value: any) => void
  capture: () => any
}

export default class InteractionManager extends Emitter {
  callbacks: Record<string, Callbacks>

  history: History

  mode: IMode

  loaded: boolean

  constructor() {
    super()
    this.callbacks = {}
    this.history = new History()
    this.mode = 'default'
    this.loaded = false
  }

  setMode(mode: IMode) {
    this.mode = mode
  }

  load(state: IState) {
    if (this.loaded) {
      return
    }

    this.loaded = true
    this.push(state)
  }

  push(state: IState) {
    const last = this.history.undos.last()
    if (isEqual(last, state)) {
      return
    }
    this.history = this.history.push(defaults(state, last))
  }

  undo() {
    const last = this.history.undos.last()
    if (last) {
      this.history = this.history.undo(last)
      const state = this.history.undos.last()
      if (state) {
        for (const label in state) {
          const value = state[label]
          const callbacks = this.callbacks[label]
          callbacks.undo(value)
        }
      }
    }
  }

  redo() {
    const first = this.history.redos.first()
    if (first) {
      this.history = this.history.redo(first)
      const state = this.history.redos.first()
      if (state) {
        for (const label in state) {
          const value = state[label]
          const callbacks = this.callbacks[label]
          callbacks.redo(value)
        }
      }
    }
  }

  attach(label: string, { undo, redo, capture }: Callbacks) {
    this.callbacks[label] = { undo, redo, capture }
  }

  detach(label: string) {
    delete this.callbacks[label]
  }
}

const MAX_UNDOS = 500

const DEFAULTS = {
  // The previous states. Last is the closest to current (most
  // recent)
  undos: List<IState>(), // List<Snapshot>

  // The next states. Top is the closest to current (oldest)
  redos: Stack<IState>(), // Stack<Snapshot>

  maxUndos: MAX_UNDOS,

  strategy: lru,
}

/**
 * Data structure for an History of state, with undo/redo.
 */
class History extends IRecord(DEFAULTS) {
  static lru = lru

  get canUndo() {
    return !this.undos.isEmpty()
  }

  get canRedo() {
    return !this.redos.isEmpty()
  }

  get previous() {
    return this.undos.last()
  }

  get next() {
    return this.redos.first()
  }

  push(state: IState) {
    const newHistory = this.merge({
      undos: this.undos.push(state),
      redos: Stack(),
    })

    return newHistory.prune()
  }

  /**
   * Go back to previous state. Return itself if no previous state.
   */
  undo(current: IState) {
    if (!this.canUndo) {
      return this
    }

    return this.merge({
      undos: this.undos.pop(),
      redos: this.redos.push(current),
    })
  }

  /**
   * Go to next state. Return itself if no next state
   */
  redo(current: IState) {
    if (!this.canRedo) {
      return this
    }

    return this.merge({
      undos: this.undos.push(current),
      redos: this.redos.pop(),
    })
  }

  /**
   * Prune undo/redo using the defined strategy,
   * after pushing a value on a valid History.
   */
  prune() {
    if (this.undos.size <= this.maxUndos) {
      return this
    } else {
      return this.strategy(this)
    }
  }
}

function lru(history: History) {
  return history.set('undos', history.undos.shift())
}
