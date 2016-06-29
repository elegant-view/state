/**
 * @file 提供状态管理的基类
 * @author yibuyisheng(yibuyisheng@163.com)
 */

const STATE = Symbol('state');

export default class State {

    constructor() {
        this[STATE] = {};
    }

    /**
     * 添加状态
     *
     * @public
     * @param {string} state 状态字符串
     */
    addState(state) {
        this[STATE][state] = true;
    }

    /**
     * 判断当前是否具有state状态
     *
     * @public
     * @param  {string}  state 状态字符串
     * @return {boolean}
     */
    hasState(state) {
        return !!this[STATE][state];
    }

    /**
     * 移除状态
     *
     * @public
     * @param  {string} state 状态字符串
     */
    removeState(state) {
        this[STATE][state] = false;
    }

    /**
     * 销毁
     *
     * @protected
     */
    destroy() {
        this[STATE] = {};
    }
}

/**
 * 装饰器函数，用于确保类方法执行的时候，当前对象的状态必须满足一定的条件
 *
 * @param {Array.<string>} stateConditions 一组state条件，示例如下：
 *                                            [
 *                                            	['not', 'destroied'], // 表明不具备destroied状态
 *                                            	['has', 'destroied'] // 表明具备destroied状态
 *                                            ]
 * @param {boolean} shouldThrowError 在不满足条件的情况下，是否应该抛出异常
 * @return {Function}
 */
export function ensureStates(stateConditions, shouldThrowError) {
    return function (target, name, descriptor) {
        const oldValue = descriptor.value;

        descriptor.value = function (...args) {
            let isStateSatisfied = true;
            for (let i = 0, il = stateConditions.length; i < il; ++i) {
                const condition = stateConditions[i];
                switch (condition[0]) {
                    case 'not':
                        isStateSatisfied = !this.hasState(condition[1]);
                        break;
                    case 'has':
                        isStateSatisfied = this.hasState(condition[1]);
                        break;
                }
            }

            if (!isStateSatisfied && shouldThrowError) {
                throw new Error('invalid state');
            }

            return oldValue.apply(this, args);
        };

        return descriptor;
    };
}

/**
 * 更具有可读性的写法，建议结合ensureStates使用
 *
 * @param  {string} state 状态字符串
 * @return {Array}
 */
export function not(state) {
    return ['not', state];
}

/**
 * 更具有可读性的写法，建议结合ensureStates使用
 *
 * @param  {string} state 状态字符串
 * @return {Array}
 */
export function has(state) {
    return ['has', state];
}
