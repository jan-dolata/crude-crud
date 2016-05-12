<?php

namespace App\Http\Controllers\Admin;

use Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DB;

/**
 * Controller for autocomplete field
 */
class AutocompleteController extends Controller
{

    /**
     * Call method to get list for $attr autocomplete input in $model form
     * @param  Request $request - with 'term' string value
     * @param  string  $model   - form model name
     * @param  string  $attr    - form input attribute name
     * @return JSON with array
     */
    public function get(Request $request, $model, $attr)
    {
        $term = $request->input('term');
        $attr = $this->underscoreToCamelCase($attr);

        $result = call_user_func([$this, 'autocomplete' . $model . $attr], $term);

        return response()->json($result, 200);
    }

    /**
     * Call mathod to get first label for $attr autocomplete input in $model form
     * @param  Request $request - with
     *                          'model' - model name
     *                          'attr'  - attribute name
     *                          'value' - model[attr]
     * @return JSON with string
     */
    public function label(Request $request)
    {
        $model = ucwords($request->input('model'));
        $attr = $this->underscoreToCamelCase($request->input('attr'));
        $value = $request->input('value');

        $result = call_user_func([$this, 'label' . $model . $attr], $value);
        if(empty($result))
            $result = '';

        return response()->json($result, 200);
    }

    /**
     * Underscore to CamelCase
     * @param  string $string
     * @return string
     */
    public function underscoreToCamelCase($string)
    {
        return str_replace('_', '', ucwords($string, '_'));
    }
}
