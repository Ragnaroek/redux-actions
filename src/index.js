/**
 * @flow
 */
import {bindActionCreators} from 'redux';
import {_} from 'underscore';
import {Set, List} from 'immutable';

export type DispatchedSyncAction = {
     type: string,
     data: any
};

export type DispatchedAsyncAction = (dispatch: any, getState: () => any) => Promise<any>;

export class AsyncAction {
     _type: string;
     _fn: (data:any, dispatch: any, getState: () => any) => Promise<any>;

     constructor(
         type: string,
         fn: (data:any, dispatch: any, getState: () => any) => Promise<any>,
     ) {
         this._type = type;
         this._fn = fn;
     }

     getType(): string {
         return this._type;
     }

     asDispatchable(data: any): DispatchedAsyncAction {
         return (dispatch: any, getState: () => any) => {
              return this._fn(data, dispatch, getState);
         };
     }

     /**
      * Tests whether this action is another one given.
      * The given action only has to be an action form (SyncAction/AsyncAction or something
      * returned from asDispatchable).
      *
      * @returns {boolean}
      */
     is(other: any):boolean {
         if (!other) {
             return false;
         }
         const type = other._type || other.type;
         return this._type === type;
     }
 }

export class SyncAction {
     _type: string;

     constructor(type: string) {
         this._type = type;
     }

     getType(): string {
         return this._type;
     }

     asDispatchable(data: any): DispatchedSyncAction {
         return {
             type: this._type,
             data: data
         };
     }

     /**
      * Tests whether this action is another one given.
      * The given action only has to be an action form (SyncAction/AsyncAction or something
      * returned from asDispatchable).
      *
      * @returns {boolean}
      */
     is(other: any):boolean {
         if (!other) {
             return false;
         }
         const type = other._type || other.type;
         return this._type === type;
     }
}

export function createActions(obj: Object, options: ?Object): any {
     return dispatch => {
         let result = {};
         _.each(_.keys(obj), alias => {
             const action:(SyncAction|AsyncAction) = obj[alias];

             if (action instanceof SyncAction) {
                 result[alias] = bindActionCreators(_.bind(action.asDispatchable, action), dispatch);
             } else if (action instanceof AsyncAction) {
                 result[alias] = bindActionCreators(_.bind(action.asDispatchable, action), dispatch);
             } else {
                 throw new Error('action ' + action + 'is neither a SyncAction nor an AsyncAction');
             }
         });

         if (options && options.withDispatcher) {
             result[options.withDispatcher] = dispatch;
         }

         return result;
     };
 }

 // Combinators

 /**
  * A combinator for actions that calls dispatch with the dispatchable action
  */
 export function dispatchAction(action: (SyncAction|AsyncAction), dispatch: any) : (data: any) => void {
     return data => dispatch(action.asDispatchable(data));
 }
