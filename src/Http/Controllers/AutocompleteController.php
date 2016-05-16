<?php

namespace JanDolata\CrudeCRUD\Http\Controllers;

use App\Http\Controllers\Controller;
use JanDolata\CrudeCRUD\Http\Requests\AutocompleteRequest;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;

/**
 * Controller for autocomplete field
 */
class AutocompleteController extends Controller
{

    /**
     * Call method to get list for $attr autocomplete input
     * @param  Request $request     - with 'term' string value
     * @param  string  $crudeName
     * @param  string  $attr        - form input attribute name
     * @return JSON with array
     */
    public function get(AutocompleteRequest $request, $crudeName, $attr)
    {
        $crude = CrudeInstance::get($crudeName);
        $methodName = 'autocomplete' . $this->underscoreToCamelCase($attr);

        if (! method_exists($crude, $methodName))
            return response()->json([], 200);

        $term = $request->input('term');
        $result = call_user_func([$crude, $methodName], $term);

        return response()->json($result, 200);
    }

    /**
     * Call mathod to get first label for $attr autocomplete input
     * @param  Request $request - with
     *                          'crudeName' - crude class name
     *                          'attr'  - attribute name
     *                          'value' - model[attr]
     * @return JSON with string
     */
    public function label(AutocompleteRequest $request)
    {
        $crude = CrudeInstance::get($request->input('crudeName'));
        $attr = $this->underscoreToCamelCase($request->input('attr'));
        $value = $request->input('value');
        $methodName = 'label' . $attr;

        $result = '';
        if (method_exists($crude, $methodName))
            $result = call_user_func([$crude, $methodName], $value);

        return response()->json($result, 200);
    }

    /**
     * Underscore to CamelCase
     * @param  string $string
     * @return string
     */
    private function underscoreToCamelCase($string)
    {
        return str_replace('_', '', ucwords($string, '_'));
    }
}
