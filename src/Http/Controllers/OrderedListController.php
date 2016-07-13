<?php

namespace JanDolata\CrudeCRUD\Http\Controllers;

use Illuminate\Routing\Controller;
use JanDolata\CrudeCRUD\Http\Controllers\Traits\ApiResponseTrait;
use JanDolata\CrudeCRUD\Http\Requests\OrderedListRequest;

class OrderedListController extends Controller
{

    use ApiResponseTrait;

    public function execute(OrderedListRequest $request, $crudeName)
    {
        $orderList = $request->input('orderList');

        if (! empty($orderList))
            $request->crude->reorder($orderList);

        return $this->successResponse([
            'message' => trans('CrudeCRUD::crude.new_order_saved')
        ]);
    }

}
