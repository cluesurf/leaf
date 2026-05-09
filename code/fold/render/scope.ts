/**
 * Scope chain shared by every renderer.
 *
 * Each renderer pushes a frame for iterators (`walk`, fold
 * embeds, future `bind`) and reads named bindings via `get`.
 * Inner frames shadow outer ones — `get` walks from the most
 * recently pushed frame back to the initial one.
 *
 * `push(frame)` returns a NEW Scope with the extended chain;
 * the original is untouched. This matters: the walker pushes a
 * per-iteration frame and discards the inner scope when the
 * iteration ends. If `push` mutated the chain, the outer
 * walker would see the inner frame after the iteration
 * completes.
 */

export type Mesh = Record<string, unknown>

export class Scope {
  private stack: ReadonlyArray<Mesh>

  constructor(initial: Mesh = {}) {
    this.stack = [initial]
  }

  private static fromStack(stack: ReadonlyArray<Mesh>): Scope {
    const out = new Scope()
    ;(out as unknown as { stack: ReadonlyArray<Mesh> }).stack = stack
    return out
  }

  get(name: string): unknown {
    for (let i = this.stack.length - 1; i >= 0; i -= 1) {
      const frame = this.stack[i]
      if (frame && Object.prototype.hasOwnProperty.call(frame, name)) {
        return frame[name]
      }
    }
    return undefined
  }

  /**
   * Returns a NEW Scope with `frame` pushed on top. The
   * original Scope is unchanged.
   */
  push(frame: Mesh): Scope {
    return Scope.fromStack([...this.stack, frame])
  }
}

export function makeScope(initial: Mesh = {}): Scope {
  return new Scope(initial)
}
