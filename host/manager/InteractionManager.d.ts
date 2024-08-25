import Emitter from 'eventemitter3';
import { Record as IRecord, Stack, List } from 'immutable';
export type IMode = 'command' | 'input' | 'default' | 'delegate';
export type IState = Record<string, any>;
export type Callbacks = {
    undo: (value: any) => void;
    redo: (value: any) => void;
    capture: () => any;
};
export default class InteractionManager extends Emitter {
    callbacks: Record<string, Callbacks>;
    history: History;
    mode: IMode;
    loaded: boolean;
    constructor();
    setMode(mode: IMode): void;
    load(state: IState): void;
    push(state: IState): void;
    undo(): void;
    redo(): void;
    attach(label: string, { undo, redo, capture }: Callbacks): void;
    detach(label: string): void;
}
declare const History_base: IRecord.Factory<{
    undos: List<IState>;
    redos: Stack<IState>;
    maxUndos: number;
    strategy: typeof lru;
}>;
/**
 * Data structure for an History of state, with undo/redo.
 */
declare class History extends History_base {
    static lru: typeof lru;
    get canUndo(): boolean;
    get canRedo(): boolean;
    get previous(): IState | undefined;
    get next(): IState | undefined;
    push(state: IState): History;
    /**
     * Go back to previous state. Return itself if no previous state.
     */
    undo(current: IState): this;
    /**
     * Go to next state. Return itself if no next state
     */
    redo(current: IState): this;
    /**
     * Prune undo/redo using the defined strategy,
     * after pushing a value on a valid History.
     */
    prune(): History;
}
declare function lru(history: History): History;
export {};
