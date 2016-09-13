/**
 * @flow
 */

import expect, {createSpy, expectSpy, spyOn} from 'expect';
import {_$_} from 'meta-constant';
import Q from 'q';
import {_} from 'underscore';
import {AsyncAction, SyncAction, createActions} from './index';

const NOP = () => {};

describe('SyncAction class', () => {
    it('should be the same if type equals', () => {
        const action1 = new SyncAction('TEST-TYPE');
        const action2 = new SyncAction('TEST-TYPE');

        expect(action1.is(action2)).toBeTruthy();
        expect(action2.is(action1)).toBeTruthy();
    });

    it('should not be the same if types not equal', () => {
        const action1 = new SyncAction('TYPE-1');
        const action2 = new SyncAction('TYPE-2');

        expect(action1.is(action2)).toBeFalsy();
        expect(action2.is(action1)).toBeFalsy();
    });

    it('should be the same if other has action form', () => {
        const action = new SyncAction('TEST');
        const actionForm = {
            type: 'TEST'
        };
        expect(action.is(actionForm)).toBeTruthy();
        expect(action.is(action.asDispatchable())).toBeTruthy();
    });

    it('should not be the same if supplied is undefined', () => {
        const action = new SyncAction('TEST');
        expect(action.is(undefined)).toBeFalsy();
    });
});

describe('AsyncAction class', () => {
    const nopAsyncAction = () => {
        return Promise.resolve();
    };
    it('should be the same if type equals', () => {
        const action1 = new AsyncAction('TEST-TYPE', nopAsyncAction);
        const action2 = new AsyncAction('TEST-TYPE', nopAsyncAction);

        expect(action1.is(action2)).toBeTruthy();
        expect(action2.is(action1)).toBeTruthy();
    });

    it('should not be the same if types not equal', () => {
        const action1 = new AsyncAction('TYPE-1', nopAsyncAction);
        const action2 = new AsyncAction('TYPE-2', nopAsyncAction);

        expect(action1.is(action2)).toBeFalsy();
        expect(action2.is(action1)).toBeFalsy();
    });

    it('should be the same if other has action form', () => {
        const action = new AsyncAction('TEST', nopAsyncAction);
        const actionForm = {
            type: 'TEST'
        };
        expect(action.is(actionForm)).toBeTruthy();
    });

    it('should not be the same if supplied is undefined', () => {
        const action = new AsyncAction('TEST', nopAsyncAction);
        expect(action.is(undefined)).toBeFalsy();
    });

    it('should wrap the passed function on asDispatchable call', () => {
        let fnCalled = false;
        const dispatcher = NOP;
        const getState = NOP;
        const fn = () => {
            fnCalled = true;
            return Promise.resolve();
        };
        const action = new AsyncAction('TEST', fn);

        action.asDispatchable()(dispatcher, getState);
        expect(fnCalled).toBeTruthy();
    });
});

describe('createActions function', () => {

    let action1 = new SyncAction('DUMMY_ACTION_1');
    let action2 = new SyncAction('DUMMY_ACTION_2');

    it('should do nothing if empty object supplied', () => {
        const dummyDispatcher = createSpy();
        const result = createActions({})(dummyDispatcher);
        expect(result).toEqual({});
    });

    it('should throw error if mapped value is not an action', () => {
        const dummyDispatcher = createSpy();
        expect(() => {
            createActions({action1: action1,
                           action2NotOk: 'no a action'})(dummyDispatcher);
        }).toThrow();
    });

    it('should create actions if all are actions', () => {
        const dummyDispatcher = createSpy();
        const createdActions = createActions({action1: action1,
                                              action2: action2})(dummyDispatcher);
        expect(createdActions.action1).toBeTruthy();
        expect(createdActions.action2).toBeTruthy();
    });
});
