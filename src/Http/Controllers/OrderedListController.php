<?php

namespace JanDolata\CrudeCRUD\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use JanDolata\CrudeCRUD\Http\Controllers\Traits\ApiResponseTrait;
use JanDolata\CrudeCRUD\Http\Requests\OrderedListRequest;

class OrderedListController extends BaseController
{

    use ApiResponseTrait;

    public function execute(OrderedListRequest $request, $crudeName)
    {
        $orderList = $request->input('orderList');

        if (! empty($orderList))
            $request->crude->reorder($orderList);

        return $this->successResponse([
            'message' => $request->crude->getCrudeSetup()->trans('new_order_saved')
        ]);
    }

}
