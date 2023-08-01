/* eslint-disable no-unused-vars */
/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-const */

/**
 * 判断对象是否为null或者undefined
 * @param {*} obj
 */
export function isNullOrUndefined (obj: null) {
  return typeof obj === 'undefined' || obj === null;
}
/**
 * 判断对象是否为数组
 * @param obj
 * @returns {boolean}
 */
export function objectIsArray (obj: any) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}
/**
 *  判断对象是否为空
 *
 * @param obj
 * @returns {boolean}
 */
export function isEmptyObject (obj: any) {
  if (isNullOrUndefined(obj) || obj === '') {
    return true;
  }
  // 兼容arra自定义属性
  if (typeof obj === 'object') {
    if (objectIsArray(obj)) {
      return obj.length === 0;
    }
    if (obj instanceof Date) {
      return false;
    }
  } else {
    return false;
  }
  return true;
}
/**
 * 判断是否为单纯的对象
 * @param obj
 */
function isPlainObject (obj: any) {
  let proto: { constructor: any },
    ctor: any,
    toString: { (): string; call?: any },
    hasOwn: { (v: PropertyKey): boolean; toString?: any; call?: any },
    fnToString: { call: (arg0: ObjectConstructor) => any };
  const class2type = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Object]': 'object'
  };
  toString = class2type.toString;
  // Detect obvious negatives
  // Use toString instead of jQuery.type to catch host objects
  if (!obj || toString.call(obj) !== '[object Object]') {
    return false;
  }
  proto = Object.getPrototypeOf(obj);
  // Objects with no prototype (e.g., `Object.create( null )`) are plain
  if (!proto) {
    return true;
  }
  hasOwn = class2type.hasOwnProperty;
  fnToString = hasOwn.toString;
  // Objects with prototype are plain iff they were constructed by a global Object function
  ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
  return (
    typeof ctor === 'function' &&
    fnToString.call(ctor) === fnToString.call(Object)
  );
}
/**
 * 判断对象是否为函数
 * @param obj
 * @returns {boolean}
 */
export function objectIsFunction (obj: any) {
  return typeof obj === 'function' && typeof obj.nodeType !== 'number';
}
/**
 * 对象继承
 * @returns {Object|{}|default|any}
 */
export function extendObjects () {
  let options: { [x: string]: any } | null;
  let name: string | number;
  // let src: any;
  let copy: undefined;
  let copyIsArray: boolean;
  let target = arguments[0] || {};
  let i = 1;
  let length = arguments.length;
  let deep = false;

  // let clone = [] as any;
  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target;

    // Skip the boolean and the target
    target = arguments[i] || {};
    i++;
  }
  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && !objectIsFunction(target)) {
    target = {};
  }

  // Extend jQuery itself if only one argument is passed
  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    options = arguments[i];
    if (options !== null) {
      // Extend the base object
      for (name in options) {
        // src = target[name];
        copy = options[name];

        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        copyIsArray = Array.isArray(copy);
        if (deep && copy && (isPlainObject(copy) || copyIsArray)) {
          if (copyIsArray) {
            copyIsArray = false;
            // clone = src && Array.isArray(src) ? src : [];
          } else {
            // clone = src && isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[name] = extendObjects();

          // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  return target;
}
