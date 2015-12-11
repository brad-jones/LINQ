module TsLinq.Constants
{
    /** Default predicate, always true */
    export const TRUE_FN = () => true;

    /** Default transformer, returns self */
    export const SELF_FN = o => o;

    /** Default Grouping */
    export const DEFAULT_GROUPING = (a, b) =>
    {
        if ('undefined' != typeof b['key'])
        {
            throw "Object already has property [key]";
        }

        b['key'] = a;

        return b;
    };

    /** Returns default value for the type */
    export const DEFAULT_VALUE = (type: string) =>
    {
        // Handle simple types (primitives and plain function/object)
        switch (type)
        {
            case 'boolean': return false;
            case 'function': return function () { };
            case 'null': return null;
            case 'number': return 0;
            case 'object': return {};
            case 'string': return "";
            case 'symbol': return Symbol();
            case 'undefined': return void 0;
        }

        try
        {
            // Grab the global scope.
            // @see: http://goo.gl/Wr6jnG
            var globalScope = (function(){ return this || (1,eval)('this') })();

            // Look for constructor in the global scope
            var ctor;
            if (typeof globalScope[type] === 'function')
            {
                ctor = globalScope[type];
            }
            else
            {
                ctor = eval(type);
            }
            return new ctor;

            // Constructor not found, return new object
        }
        catch (e)
        {
            return {};
        }
    }

    export const NOTHING_FOUND = "No element satisfies the condition in predicate";
    export const NO_ELEMENTS = "The source sequence is empty.";
    export const TOO_MANY = "More than one element satisfies the condition in predicate.";
}
